from flask import Flask, jsonify, request
from flask_cors import CORS
import honeypot
import database
import threading
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize DB on startup
try:
    database.init_db()
except Exception as e:
    logger.error(f"Database init failed: {e}")

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"running": honeypot.service.running})

@app.route('/api/start', methods=['POST'])
def start_honeypot():
    try:
        data = request.json
        # Handle both legacy 'ports' and new 'services' format for backward compatibility
        services = data.get('services', [])
        ports = data.get('ports', [])
        
        config_to_use = []
        if services:
            config_to_use = services
        elif ports:
            # Convert simple port list to service objects
            config_to_use = [{'port': p, 'type': 'generic'} for p in ports]
        
        if not config_to_use:
            return jsonify({"message": "No services/ports selected"}), 400

        logger.info(f"Starting honeypot with config: {config_to_use}")
        result = honeypot.service.start(config_to_use)
        return jsonify({"message": result})
    except Exception as e:
        logger.error(f"Start failed: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/api/stop', methods=['POST'])
def stop_honeypot():
    try:
        result = honeypot.service.stop()
        return jsonify({"message": result})
    except Exception as e:
        logger.error(f"Stop failed: {e}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 100)
    logs = database.get_logs(int(limit))
    return jsonify(logs)

@app.route('/api/logs/clear', methods=['POST'])
def clear_logs():
    database.clear_logs()
    return jsonify({"message": "Logs cleared"})

if __name__ == '__main__':
    # Use threaded=True to ensure multiple requests can be handled
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
