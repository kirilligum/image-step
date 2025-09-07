# Project Documentation: AI Visual Instruction Generator

## 1. Project Overview

This project is a full-stack web application designed to help users create visual, step-by-step DIY instructions using generative AI. A user provides a text prompt describing a project (e.g., "how to build a birdhouse"), and the application uses Google's Gemini models to generate a structured set of instructions, complete with text descriptions and corresponding images for each step.

The application features a "human-in-the-loop" design, allowing users to refine the generated content, publish the final instructions, and add comments.

## 2. Architecture

The application follows a modern client-server architecture to ensure security and separation of concerns.

### Frontend (`/client`)

*   **Framework:** React.js (initialized with Vite).
*   **Responsibilities:**
    *   Providing the user interface (UI).
    *   Capturing user input (the initial project prompt, comments, etc.).
    *   Making API calls to the backend server.
    *   Managing the display state (e.g., loading indicators, showing/hiding UI elements).
*   **Key Libraries:** `react`, `react-dom`.

### Backend (`/server`)

*   **Framework:** Python with Flask.
*   **Responsibilities:**
    *   Providing a secure API endpoint for the frontend.
    *   Securely managing the `GEMINI_API_KEY` using an `.env` file. The key is never exposed to the client.
    *   Interfacing with the Google Generative AI (Gemini) Python SDK.
    *   Orchestrating the multi-step AI generation process (generating text structure, then generating an image for each step).
*   **Key Libraries:** `Flask`, `google-generativeai`, `python-dotenv`, `Flask-Cors`.

## 3. Core Functionality

### a. Instruction Generation Flow

1.  The user enters a prompt into the textarea on the main page and clicks "Generate Instructions".
2.  The React frontend sends a `POST` request containing the prompt to the backend's `/api/generate` endpoint.
3.  The Flask server receives the request.
4.  The server first calls the `gemini-2.5-pro` model with a detailed prompt, asking it to return a structured JSON object containing the project overview, a summary of steps, and detailed steps (with text and an image prompt for each).
5.  The server then iterates through the detailed steps received from the AI. For each step, it makes another API call to the `gemini-2.5-flash-image-preview` model using the `imagePrompt` for that step.
6.  The image data is returned as a binary blob, which the server encodes into a Base64 string.
7.  The server adds this Base64 image data to the step object.
8.  After all images are generated, the server sends the complete JSON object (with text and image data) back to the frontend.
9.  The frontend receives the data and displays the full set of instructions.

### b. Publishing and Commenting

*   Once the instructions are generated, the user can click the "Publish" button.
*   This toggles the application into a "published" state, which hides the refinement controls and reveals a commenting section for each step.
*   Users can type comments and post them. This functionality is currently managed entirely on the frontend; the comments are added to the local state of the application.

### c. AI Knowledge Generation

*   The "Generate AI Knowledge" button allows the user to export the final, human-reviewed instructions.
*   Clicking this button creates a JSON file from the current application state and triggers a download in the user's browser named `ai-knowledge.json`.

### d. Refinement (Stubbed)

*   The UI for refining text and images exists but is currently disabled. The backend logic for refinement has not yet been implemented.

## 4. How to Run the Application

To run the full-stack application, you will need to run both the backend and frontend servers.

### a. Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Set up the API Key:**
    *   Ensure you have a `.env` file in the `/server` directory with your key:
      ```
      GEMINI_API_KEY="YOUR_API_KEY_HERE"
      ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run the server:**
    ```bash
    python server.py
    ```
    The backend will be running on `http://localhost:5000`.

### b. Frontend Setup

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`. You can now open this URL in your browser.

## 5. Security Note

Please refer to the `SECURITY.md` file in the root directory. The architecture has been designed to protect the API key on the backend, which is the standard secure practice for production applications.
