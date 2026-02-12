#!/bin/bash

echo "Starting HoneyShield for Linux..."

# Check for root if using privileged ports
if [ "$EUID" -ne 0 ]; then
  echo "WARNING: Not running as root. You won't be able to bind to ports < 1024 (e.g., 21, 22, 80)."
  echo "Please run with sudo if you need these ports."
  # asking for confirmation or sleeping slightly
  sleep 2
fi

# Start Backend
echo "Starting Backend..."
cd backend
# Check if venv exists, if not create it (optional, but good practice)
# For simplicity, we assume python3 is available. 
# Using nohup to run in background or just standard backgrounding
python3 app.py &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "HoneyShield is now running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the Dashboard at: http://localhost:5174"
echo "Press Ctrl+C to stop servers."

# Trap Ctrl+C to kill background processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait for processes
wait
