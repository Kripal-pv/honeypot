#!/bin/bash

echo "Updating HoneyShield..."

# Pull latest changes
git pull origin master

# Reinstall Frontend Dependencies (Clean Install)
echo "Reinstalling Frontend Dependencies..."
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..

# Reinstall Backend Dependencies
echo "Reinstalling Backend Dependencies..."
cd backend
pip3 install -r requirements.txt --break-system-packages
cd ..

echo "Update Complete! You can now run ./run_honeypot.sh"
