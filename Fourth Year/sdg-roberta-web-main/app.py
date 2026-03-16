from flask import Flask, request, jsonify
import torch
import nltk
import string
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
# from autocorrect import Speller
from nltk.tokenize.treebank import TreebankWordDetokenizer
from transformers import RobertaTokenizer, RobertaForSequenceClassification
import os

# Initialize Flask app
app = Flask(__name__)

HF_MODEL = "joshdavid0109/sdg-roberta"
HF_TOKEN = os.getenv("HF_TOKEN")  # optional but recommended

tokenizer = RobertaTokenizer.from_pretrained(
    HF_MODEL,
    token=HF_TOKEN
)

model = RobertaForSequenceClassification.from_pretrained(
    HF_MODEL,
    token=HF_TOKEN
)

model.eval()

# Download necessary NLTK resources
nltk.download("stopwords")
nltk.download("punkt_tab")
nltk.download("wordnet")

# Initialize lemmatizer and spell checker
lemmatizer = WordNetLemmatizer()
# spell = Speller()

# Define abbreviations to avoid spell correction
abbreviations = {"MPSPC", "USA", "UN", "CEO", "NASA", "EU", "AI", "ML", "DLSU",
                 "ADMU", "UST", "UP", "UPLB", "MSU", "MOA", "LPU", "PSU"}

stop_words = set(stopwords.words('english'))

punctuation_set = set(string.punctuation)

def preprocess_text(text):
    """
    Cleans and preprocesses the input text to match the training preprocessing.
    """
    if isinstance(text, str):
        text = text.lower()
    else:
        text = str(text)

    # Remove URLs, emails, and mentions
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)  # Remove URLs
    text = re.sub(r"\S+@\S+", "", text)  # Remove emails
    text = re.sub(r"@\w+", "", text)  # Remove mentions (e.g., @username)

    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)

    # Tokenization
    tokens = word_tokenize(text)

    # Stopword Removal
    tokens = [word for word in tokens if word not in stop_words]

    # Remove words with digits and one-character words (could be meaningless)
    tokens = [word for word in tokens if not any(char.isdigit() for char in word) and len(word) > 1]

    # Lemmatization
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    # Handle negation words
    tokens = [word.replace("not", "not_") for word in tokens]

    # Remove digits
    tokens = [word for word in tokens if not word.isdigit()]

    # Reconstruct processed text
    return TreebankWordDetokenizer().detokenize(tokens)


def get_words_and_top_sdgs_v3_fixed(text, tokenizer, model, label_sdgs=5, max_length=128):
    """
    Processes text and extracts top SDGs with relevant words.
    The number of SDGs predicted is limited to the number of SDGs in the label.
    """
    # Preprocess text before sending it to the model
    text = preprocess_text(text)

    # Move model to GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()  # Ensure model is in evaluation mode

    # Tokenize text using the tokenizer
    tokens = tokenizer.tokenize(text, is_split_into_words=True)

    # Filter out stopwords, punctuation, and empty tokens
    filtered_tokens = [
        word for word in tokens
        if word.lower() not in stop_words and word not in punctuation_set and word.strip() != ""
    ]

    # Reconstruct filtered text
    filtered_text = tokenizer.convert_tokens_to_string(filtered_tokens)

    # Encode input
    encoding = tokenizer(
        filtered_text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=max_length,
    )

    # Move inputs to the same device as the model
    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    # Perform inference
    with torch.no_grad():
        outputs = model(input_ids, attention_mask=attention_mask, output_attentions=True)

    logits = outputs.logits
    attentions = outputs.attentions[-1].mean(dim=1).squeeze(0)

    # Get probabilities and top SDGs
    probabilities = torch.nn.functional.softmax(logits, dim=1).squeeze(0).tolist()

    # Adjust top_n based on the number of SDGs in the label
    top_n = label_sdgs if isinstance(label_sdgs, int) else len(label_sdgs)

    top_sdgs = sorted(
        [(i + 1, prob) for i, prob in enumerate(probabilities)],
        key=lambda x: x[1],
        reverse=True,
    )[:top_n]

    valid_words = []
    for token in tokenizer.convert_ids_to_tokens(input_ids.squeeze(0)):
        if token in {"<pad>", "</s>", "<s>"}:
            continue
        if token.startswith("Ġ"):  # Handle subword tokens from models like RoBERTa
            valid_words.append(token[1:])
        elif valid_words:
            valid_words[-1] += token

    # Filter out empty strings or invalid tokens
    valid_words = [word for word in valid_words if word.strip() != ""]


    results = []
    for sdg, prob in top_sdgs:
        class_specific_weights = attentions[:, sdg - 1] * prob
        class_specific_weights = class_specific_weights / class_specific_weights.sum()

        threshold = max(
            class_specific_weights.mean() + class_specific_weights.std() * 0.05,
            class_specific_weights.max() * 0.3,
        )

        aligned_words = [
            word for word, weight in zip(valid_words, class_specific_weights) if weight > threshold
        ]

        # Custom Filter to Remove Stop Words & Short Words
        aligned_words = [word for word in aligned_words if word.lower() not in stop_words and len(word) > 2]

        if len(aligned_words) < 2:
            aligned_words = [
                word for _, word in sorted(
                    zip(class_specific_weights, valid_words),
                    key=lambda x: x[0],
                    reverse=True
                )[:3]
            ]
            aligned_words = [word for word in aligned_words if word.lower() not in stop_words and len(word) > 2]

        results.append({
            "sdg": sdg,
            "percentage": round(prob * 100, 2),
            "aligned_words": tuple(set(aligned_words)),  # Ensure unique words
        })

    return results


# Define the API endpoint
@app.route("/predict", methods=["POST"])
def predict():
    # Get input data from the request
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Make predictions
    try:
        output = get_words_and_top_sdgs_v3_fixed(text, tokenizer, model)
        return jsonify({"predictions": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# Run the Flask app
if __name__ == "__main__":
    app.run(port=5000)