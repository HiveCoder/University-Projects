#!/bin/bash

# Exit on error
set -e

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Export Flask app environment variable
export FLASK_APP=your_flask_script.py  # Replace with your actual script filename
export FLASK_ENV=production  # or "development" if debugging

# Run the Flask server
echo "Starting Flask server on http://127.0.0.1:5000"
flask run --host=0.0.0.0 --port=5000
