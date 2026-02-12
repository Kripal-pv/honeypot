#!/bin/bash

echo "Installing HoneyShield Dependencies for Kali Linux..."

# Update package list
sudo apt update

# Install Python3 and pip if missing
sudo apt install -y python3 python3-pip nodejs npm

# Install Python dependencies
echo "Installing Python dependencies..."
cd backend
pip3 install -r requirements.txt --break-system-packages
cd ..

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "Installation Complete!"
echo "Run './run_honeypot.sh' to start."
chmod +x run_honeypot.sh
