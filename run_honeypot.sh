#!/bin/bash

echo "=========================================="
echo "   HoneyShield - Starting Up..."
echo "=========================================="

# Check for root if using privileged ports
if [ "$EUID" -ne 0 ]; then
  echo "WARNING: Not running as root. You won't be able to bind to ports < 1024."
  echo "Run with: sudo ./run_honeypot.sh"
  sleep 2
fi

# Kill ANY existing process on our ports (multiple methods for reliability)
echo "[*] Cleaning up old processes..."

# Method 1: fuser (most reliable on Kali)
fuser -k 5001/tcp 2>/dev/null
fuser -k 5176/tcp 2>/dev/null

# Method 2: kill by name as fallback
pkill -f "python3 app.py" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Wait for ports to be released
sleep 2

# Verify ports are free
if ss -tlnp | grep -q ':5001 '; then
  echo "[ERROR] Port 5001 is STILL in use. Please manually kill the process:"
  echo "  sudo fuser -k 5001/tcp"
  exit 1
fi

if ss -tlnp | grep -q ':5176 '; then
  echo "[ERROR] Port 5176 is STILL in use. Please manually kill the process:"
  echo "  sudo fuser -k 5176/tcp"
  exit 1
fi

echo "[OK] Ports 5001 and 5176 are free."

# Start Backend
echo "[*] Starting Backend on port 5001..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Give backend a moment to start
sleep 2

# Start Frontend
echo "[*] Starting Frontend on port 5176..."
cd frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "=========================================="
echo "   HoneyShield is RUNNING!"
echo "=========================================="
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "   Dashboard: http://localhost:5176"
echo "=========================================="
echo "   Press Ctrl+C to stop all servers."
echo "=========================================="

# Trap Ctrl+C to kill background processes
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# Wait for processes
wait
