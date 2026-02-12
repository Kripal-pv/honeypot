import requests
import time

BASE_URL = "http://localhost:5000/api"

def test_api():
    print("Testing API...")
    
    # Check Status
    try:
        r = requests.get(f"{BASE_URL}/status")
        print(f"Status: {r.json()}")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    # Start Honeypot
    print("Starting honeypot on port 8081...")
    r = requests.post(f"{BASE_URL}/start", json={"ports": [8081]})
    print(f"Start Response: {r.json()}")
    
    # Check Status Again
    r = requests.get(f"{BASE_URL}/status")
    print(f"Status: {r.json()}")

    # Simulate an attack
    print("Simulating attack on port 8081...")
    try:
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(('localhost', 8081))
        s.send(b"GET /admin HTTP/1.1\r\nHost: localhost\r\n\r\n")
        s.close()
    except Exception as e:
        print(f"Attack failed: {e}")

    # Check Logs
    time.sleep(1)
    r = requests.get(f"{BASE_URL}/logs")
    logs = r.json()
    print(f"Logs: {len(logs)} found.")
    if logs:
        print(f"Last Log: {logs[0]}")

    # Stop Honeypot
    print("Stopping honeypot...")
    r = requests.post(f"{BASE_URL}/stop")
    print(f"Stop Response: {r.json()}")

    # Final Status
    r = requests.get(f"{BASE_URL}/status")
    print(f"Final Status: {r.json()}")

if __name__ == "__main__":
    test_api()
