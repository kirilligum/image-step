# Security Warning

## Exposed API Key

**Warning:** This application is configured for a hackathon environment and prioritizes rapid development and simplicity over security.

The Google Gemini API key is currently stored directly in the frontend source code. This means the key is publicly exposed and can be accessed by anyone inspecting the website's code.

**This is a significant security risk and is NOT suitable for a production environment.**

For a production application, the API key **must** be moved to a secure backend server. The frontend should make requests to the backend, and the backend should be the only component that communicates with the Google Gemini API.

This key has a rate limiter and will be revoked after the hackathon. Do not use this key for any other purpose.
