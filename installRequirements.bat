#!/bin/bash

echo "Setting up the Python environment..."

# Create a virtual environment in the 'venv' directory
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the dependencies from requirements.txt
pip install -r requirements.txt

echo "Dependencies installed successfully."