import sys
import json
import fitz  # PyMuPDF
import os
import traceback

# Basic debugging helper function
def log_debug(output_dir, message):
    """Write a debug message to a log file"""
    with open(os.path.join(output_dir, 'annotation_debug.log'), 'a') as f:
        f.write(f"{message}\n")

def highlight_words_in_pdf(pdf_path, highlights_by_sdg, output_path):
    """
    A simplified version of the highlighting function that focuses on reliability
    """
    # Define colors for different SDGs (in RGB format)
    # Simplified to just a few colors
    sdg_colors = {
        "1": [0.94, 0.32, 0.39],  # Red
        "2": [0.80, 0.65, 0.20],  # Yellow
        "3": [0.39, 0.68, 0.31],  # Green
        "4": [0.73, 0.15, 0.44],  # Burgundy
        "5": [0.96, 0.46, 0.11],  # Orange
        "6": [0.01, 0.61, 0.90],  # Blue
        "7": [0.95, 0.93, 0.20],  # Yellow
        "8": [0.75, 0.06, 0.29],  # Red
        "9": [0.96, 0.58, 0.21],  # Orange
        "10": [0.76, 0.27, 0.51], # Pink
        "11": [0.99, 0.71, 0.01], # Yellow
        "12": [0.79, 0.57, 0.20], # Brown
        "13": [0.46, 0.33, 0.61], # Purple
        "14": [0.02, 0.51, 0.82], # Blue
        "15": [0.49, 0.73, 0.38], # Green
        "16": [0.00, 0.36, 0.61], # Blue
        "17": [0.02, 0.41, 0.49]  # Teal
    }
    
    # Get the output directory for logging
    output_dir = os.path.dirname(output_path)
    log_debug(output_dir, f"Starting PDF highlighting: {pdf_path} -> {output_path}")
    log_debug(output_dir, f"Highlights: {highlights_by_sdg}")
    
    try:
        # First, create a copy of the original PDF
        doc = fitz.open(pdf_path)
        
        # Log basic PDF info
        log_debug(output_dir, f"PDF opened successfully. Pages: {doc.page_count}")
        
        # Process each page
        for page_num in range(min(doc.page_count, 3)):  # Process just the first 3 pages for now
            page = doc[page_num]
            log_debug(output_dir, f"Processing page {page_num+1}")
            
            # Get page text for simple word matching
            page_text = page.get_text()
            
            # Process each SDG's highlighted words
            for sdg, words in highlights_by_sdg.items():
                if not words:  # Skip if no words to highlight
                    continue
                
                # Use a simpler approach - just highlight exact words
                color = sdg_colors.get(sdg, [0.7, 0.7, 0.7])  # Default to gray
                
                for word in words:
                    # Skip words that are too short or long
                    if len(word) < 3 or len(word) > 20:
                        continue
                    
                    # Simple find-and-highlight
                    word_instances = page.search_for(word)
                    for inst in word_instances:
                        try:
                            highlight = page.add_highlight_annot(inst)
                            highlight.set_colors(stroke=color)
                            highlight.update()
                        except Exception as e:
                            log_debug(output_dir, f"Error highlighting word '{word}': {str(e)}")
                            continue
        
        # Save the annotated document
        doc.save(output_path)
        doc.close()
        
        log_debug(output_dir, f"PDF saved successfully to {output_path}")
        
        return {
            "status": "success",
            "annotated_file": output_path,
            "message": "PDF successfully annotated"
        }
        
    except Exception as e:
        log_debug(output_dir, f"Error in highlight_words_in_pdf: {str(e)}")
        log_debug(output_dir, traceback.format_exc())
        
        # Try to just copy the original file as a fallback
        try:
            doc = fitz.open(pdf_path)
            doc.save(output_path)
            doc.close()
            log_debug(output_dir, "Fallback: Created copy of original PDF")
            return {
                "status": "partial_success",
                "annotated_file": output_path,
                "message": f"Created copy without highlights due to error: {str(e)}"
            }
        except:
            return {
                "status": "error",
                "error": str(e),
                "message": "Error highlighting PDF and fallback also failed"
            }

def main():
    """Main function with very simplified JSON handling"""
    # Get the arguments
    if len(sys.argv) < 4:
        print(json.dumps({
            "status": "error",
            "error": "Missing arguments",
            "message": "Required arguments: pdf_path, highlights_json, output_path"
        }))
        return
    
    input_pdf = sys.argv[1]
    json_str = sys.argv[2]
    output_path = sys.argv[3]
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(output_path)
    os.makedirs(output_dir, exist_ok=True)
    
    # Start with clean log
    with open(os.path.join(output_dir, 'annotation_debug.log'), 'w') as f:
        f.write(f"Starting annotation script\n")
        f.write(f"Input PDF: {input_pdf}\n")
        f.write(f"Output path: {output_path}\n")
        f.write(f"JSON data length: {len(json_str)}\n")
    
    try:
        # Write JSON to temporary file first
        temp_json = os.path.join(output_dir, 'temp_highlights.json')
        with open(temp_json, 'w') as f:
            f.write(json_str)
        
        # Read back from file to avoid command line parsing issues
        with open(temp_json, 'r') as f:
            json_content = f.read()
        
        # Parse JSON with very conservative error handling
        try:
            highlights = json.loads(json_content)
            log_debug(output_dir, "JSON parsed successfully")
        except json.JSONDecodeError:
            # If that fails, try a super simple structure
            log_debug(output_dir, "JSON parsing failed, using default structure")
            highlights = {}
            for i in range(1, 18):
                highlights[str(i)] = []
        
        # Now highlight the PDF
        result = highlight_words_in_pdf(input_pdf, highlights, output_path)
        print(json.dumps(result))
        
    except Exception as e:
        log_debug(output_dir, f"Global exception: {str(e)}")
        log_debug(output_dir, traceback.format_exc())
        
        # Try to ensure we always return valid JSON
        print(json.dumps({
            "status": "error",
            "error": str(e),
            "message": "Error in script execution"
        }))

if __name__ == "__main__":
    main()