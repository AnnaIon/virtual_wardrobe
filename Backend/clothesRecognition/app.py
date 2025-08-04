from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set environment variable for Google Cloud credentials (if needed)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/anna/Downloads/automatic-rite-453213-s5-998d06bbd5c3.json"

# Initialize the Vision API client
client = vision.ImageAnnotatorClient()

# Updated categories dictionary
categories = {
    "Tops": ["T-Shirts", "Shirts", "Blouses", "Tank Tops", "Sweaters", "Hoodies", "Crop Tops"],
    "Bottoms": ["Jeans", "Trousers", "Leggings", "Shorts", "Skirts", "Joggers"],
    "Outerwears": ["Jackets", "Coats", "Blazers", "Cardigans", "Vests"],
    "Dresses": ["Mini", "Midi", "Maxi", "Bodycon", "Wrap", "A-line"],
    "Undergarments": ["Bras", "Underwear", "Slips"],
    "Footwear": ["Sneakers", "Boots", "Sandals", "Loafers", "Heels", "Flats"],
    "Specialty Clothing": ["Sleepwear", "Swimwear", "Formal Wear", "Traditional Clothing"],
    "Accessories": ["Scarves", "Hats", "Gloves", "Belts", "Sunglasses"],
    "Jewelry": ["Necklaces", "Earrings", "Bracelets", "Rings", "Watches", "Chokers", "Hair Accessories"],
}

@app.route('/detect', methods=['POST'])
def detect_clothes():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided. Use "image" as the form field name.'}), 400

    image_file = request.files['image']
    content = image_file.read()
    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    clothing_labels = []
    # Iterate over each detected label
    for label in labels:
        label_desc_lower = label.description.lower()
        # Check each category and its keywords
        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword.lower() in label_desc_lower:
                    clothing_labels.append({
                        'description': label.description,
                        'score': label.score,
                        'category': category,
                        'matched_keyword': keyword
                    })
                    # If you only need one match per label, break out of loops
                    break
            else:
                continue
            break

    if response.error.message:
        return jsonify({'error': response.error.message}), 500

    return jsonify({'clothing_labels': clothing_labels})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
