from flask import Flask, jsonify, request
from flask_cors import CORS
import honeypot
import database
import threading

app = Flask(__name__)
CORS(app)

# Initialize DB on startup
database.init_db()

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"running": honeypot.service.running})

@app.route('/api/start', methods=['POST'])
def start_honeypot():
    data = request.json
    ports = data.get('ports', [])
    result = honeypot.service.start(ports)
    return jsonify({"message": result})

@app.route('/api/stop', methods=['POST'])
def stop_honeypot():
    result = honeypot.service.stop()
    return jsonify({"message": result})

@app.route('/api/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 50)
    logs = database.get_logs(int(limit))
    return jsonify(logs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
