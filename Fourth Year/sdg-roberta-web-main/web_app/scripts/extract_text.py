import sys
import json
import pymupdf as fitz  # PyMuPDF
import pytesseract
from PIL import Image, ImageFilter, ImageOps
import io
import re
import os

# Function to clean OCR output
def clean_text(text):
    text = re.sub(r'https?://\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'\S+@\S+', '', text)  # Remove emails
    text = re.sub(r'\n+', '\n', text)  # Replace multiple newlines with one
    text = re.sub(r'\b\w\b', '', text)  # Remove stray single letters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove excess spaces
    return text

# Function to preprocess images for OCR
def preprocess_image(image):
    image = image.convert("L")  # Grayscale
    image = image.filter(ImageFilter.SHARPEN)  # Sharpen image
    image = ImageOps.autocontrast(image)  # Enhance contrast
    return image

# Function to extract text and OCR images in a PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    extracted_text = ""

    for page_num in range(len(doc)):
        page = doc[page_num]

        # Extract text from the page
        text = page.get_text("text")
        extracted_text += text + "\n"

        # Extract images and perform OCR
        images = page.get_images(full=True)
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]

            # Convert image bytes to PIL Image and preprocess
            image = Image.open(io.BytesIO(image_bytes))
            image = preprocess_image(image)

            # Perform OCR on the image
            ocr_text = pytesseract.image_to_string(image, lang="eng")
            ocr_text = clean_text(ocr_text)  # Clean OCR text
            extracted_text += f"{ocr_text}\n"

    return clean_text(extracted_text)

# Function to annotate PDF with highlighted words
def annotate_pdf(pdf_path, aligned_words_by_sdg, output_path=None):
    if not output_path:
        base_name = os.path.basename(pdf_path)
        dir_name = os.path.dirname(pdf_path)
        output_path = os.path.join(dir_name, f"annotated_{base_name}")
    
    doc = fitz.open(pdf_path)
    
    # Define colors for different SDGs (cycle through these colors)
    colors = [
        (1, 0.9, 0.2),       # Yellow
        (0.4, 0.8, 0.2),     # Green
        (0.2, 0.6, 1),       # Blue
        (1, 0.6, 0.2),       # Orange
        (0.8, 0.2, 0.8),     # Purple
        (0.2, 0.8, 0.8),     # Teal
        (1, 0.4, 0.4),       # Coral
        (0.6, 0.4, 0.8),     # Lavender
        (0.2, 0.8, 0.6),     # Mint
        (0.8, 0.8, 0.2),     # Lime
        (0.8, 0.4, 0.2),     # Brown
        (0.4, 0.6, 0.8),     # Slate Blue
        (0.6, 0.8, 0.6),     # Light Green
        (1, 0.8, 0.8),       # Pink
        (0.6, 0.6, 0.6),     # Gray
        (0.8, 0.6, 0.4),     # Tan
        (0.4, 0.4, 0.8)      # Periwinkle
    ]
    
    # Create a color-coded legend
    legend_text = "SDG Annotations Legend:\n"
    
    for sdg_index, (sdg, words) in enumerate(aligned_words_by_sdg.items()):
        color_index = int(sdg) % len(colors) if sdg.isdigit() else sdg_index % len(colors)
        color = colors[color_index]
        legend_text += f"SDG {sdg}: {', '.join(words)} - {color}\n"
    
    # Add legend to the first page
    first_page = doc[0]
    legend_pos = fitz.Point(50, 50)  # Position for legend
    first_page.insert_text(legend_pos, legend_text, fontsize=10, color=(0, 0, 0))
    
    # Process each page
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Highlight words for each SDG
        for sdg_index, (sdg, words) in enumerate(aligned_words_by_sdg.items()):
            color_index = int(sdg) % len(colors) if sdg.isdigit() else sdg_index % len(colors)
            color = colors[color_index]
            
            for word in words:
                # Find all instances of the word
                word_pattern = re.compile(r'\b' + re.escape(word) + r'\b', re.IGNORECASE)
                text_instances = list(word_pattern.finditer(text))
                
                for match in text_instances:
                    # Search for the word on the page
                    instances = page.search_for(word)
                    
                    # Highlight each instance
                    for inst in instances:
                        annot = page.add_highlight_annot(inst)
                        annot.set_colors({"stroke": color})
                        annot.update()

    # Save the annotated PDF
    doc.save(output_path)
    doc.close()
    
    return output_path

# Main function
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No file path provided")
        sys.exit(1)

    pdf_path = sys.argv[1]  # Get file path from argument
    
    # If we have a JSON payload with the aligned words
    if len(sys.argv) > 2:
        try:
            aligned_words_json = sys.argv[2]
            aligned_words_by_sdg = json.loads(aligned_words_json)
            output_path = annotate_pdf(pdf_path, aligned_words_by_sdg)
            print(json.dumps({
                "text": extract_text_from_pdf(pdf_path),
                "annotated_file": output_path
            }))
        except Exception as e:
            print(json.dumps({
                "error": str(e),
                "text": extract_text_from_pdf(pdf_path)
            }))
    else:
        # Just extract text
        try:
            extracted_text = extract_text_from_pdf(pdf_path)
            print(json.dumps({"text": extracted_text}))
        except Exception as e:
            print(json.dumps({"error": str(e)}))