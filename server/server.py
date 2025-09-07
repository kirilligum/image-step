import os
import json
import base64
import logging
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("server.log"),
                        logging.StreamHandler()
                    ])

# --- App Setup ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- Gemini Client Setup ---
text_model = None
image_model = None
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file")
    genai.configure(api_key=api_key)
    text_model = genai.GenerativeModel('gemini-2.5-pro')
    image_model = genai.GenerativeModel('gemini-2.5-flash-image-preview')
    logging.info("Gemini client configured successfully.")
except Exception as e:
    logging.error(f"Error configuring Gemini client: {e}")

# --- Helper Functions ---
def generate_text_instructions(user_prompt):
    style_guide = "The overall style of the project should be like Ikea furniture assembly instructions: black and white, clear, simple diagrams, focusing on details. Nothing should be too small to see."
    prompt = f"""
    You are an expert in creating clear, step-by-step DIY instructions.
    Based on the user's request, generate a structured JSON object that breaks down the project.
    The user's request is: "{user_prompt}"
    The JSON object must have the following structure:
    {{
      "overview": "A brief, one-sentence summary of the project.",
      "overviewSteps": ["A list of short, one-line summaries for each main step."],
      "detailedSteps": [
        {{
          "id": 1,
          "title": "Step 1: [Descriptive Title]",
          "text": "The detailed instructions for this step.",
          "imagePrompt": "A detailed prompt for an image generation model to create a visual for this specific step. It should adhere to the style guide: {style_guide}",
          "comments": []
        }}
      ]
    }}
    Ensure the 'id' for each detailed step is a unique integer.
    Ensure every field is populated. Do not return markdown, only the raw JSON object.
    """
    logging.info("Generating text instructions...")
    response = text_model.generate_content(prompt)
    json_string = response.text.replace('```json', '').replace('```', '').strip()
    logging.info("Text instructions generated.")
    return json.loads(json_string)

def generate_image_for_step_prompt(image_prompt):
    logging.info(f"Generating image for prompt: {image_prompt[:50]}...")
    response = image_model.generate_content(image_prompt)
    image_part = response.parts[0]
    encoded_image = base64.b64encode(image_part._result.blob.data).decode('utf-8')
    logging.info("Image generated successfully.")
    return encoded_image

# --- API Route ---
@app.route('/api/generate', methods=['POST'])
def generate_instructions_route():
    logging.info("Received request on /api/generate")
    if not request.json or 'prompt' not in request.json:
        logging.warning("Request missing prompt.")
        return jsonify({'error': 'Missing prompt in request body'}), 400

    try:
        user_prompt = request.json['prompt']
        logging.info(f"User prompt: {user_prompt}")

        instruction_data = generate_text_instructions(user_prompt)

        for i, step in enumerate(instruction_data['detailedSteps']):
            logging.info(f"Processing step {i+1}...")
            try:
                image_data_base64 = generate_image_for_step_prompt(step['imagePrompt'])
                step['imageData'] = image_data_base64
            except Exception as img_e:
                logging.error(f"Could not generate image for step {step.get('id', i+1)}: {img_e}")
                step['imageData'] = 'failed'

        logging.info("Successfully generated all instructions and images.")
        return jsonify(instruction_data)

    except Exception as e:
        logging.error(f"An error occurred in /api/generate: {e}", exc_info=True)
        return jsonify({'error': 'Failed to process the request.'}), 500

# --- Main Execution ---
if __name__ == '__main__':
    logging.info("Starting Flask server...")
    app.run(debug=True, port=5000, use_reloader=False)
