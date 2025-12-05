#!/bin/bash
# Start the F1 Predictor API server

echo "Starting F1 Predictor API Server..."
echo ""

# Activate venv if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Check if model exists
if [ -f "models/f1_model.cbm" ]; then
    echo "✓ Model file found: models/f1_model.cbm"
else
    echo "⚠ Warning: Model file not found. API will use CSV fallback."
fi

echo ""
echo "Starting server on http://localhost:8000"
echo "API docs available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py

