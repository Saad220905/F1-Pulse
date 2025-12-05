#!/bin/bash
# Script to fix fastf1 and other dependencies

echo "Fixing F1 Predictor dependencies..."
echo ""

# Activate venv if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Uninstall fastf1 if partially installed
echo "Uninstalling fastf1 (if installed)..."
pip uninstall -y fastf1 2>/dev/null || true

# Install/upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install all requirements
echo "Installing all requirements..."
pip install -r requirements.txt

# Verify fastf1 installation
echo ""
echo "Verifying fastf1 installation..."
python3 -c "import fastf1; print(f'✓ fastf1 version: {fastf1.__version__}')" 2>&1 || {
    echo "✗ fastf1 import failed. Trying alternative installation..."
    pip install --upgrade --force-reinstall fastf1
}

echo ""
echo "✓ Dependencies installation complete!"
echo ""
echo "You can now run: python train_model.py --year 2025"

