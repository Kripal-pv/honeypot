#!/bin/bash

# Function to kill process on a port
kill_port() {
    local PORT=$1
    local PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        echo "Killing existing process on port $PORT (PID: $PID)..."
        kill -9 $PID
    fi
}

echo "Starting HoneyShield for Linux..."

# Check for root if using privileged ports
if [ "$EUID" -ne 0 ]; then
  echo "WARNING: Not running as root. You won't be able to bind to ports < 1024 (e.g., 21, 22, 80)."
  echo "Please run with sudo if you need these ports."
  sleep 2
fi

# Cleanup existing processes
echo "Cleaning up localized ports..."
kill_port 5001
kill_port 5176

# Start Backend
echo "Starting Backend..."
cd backend
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
echo "Access the Dashboard at: http://localhost:5176"
echo "Press Ctrl+C to stop servers."

# Trap Ctrl+C to kill background processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Wait for processes
wait
