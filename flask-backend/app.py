from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process-video', methods=['POST'])
def process_video():
    data = request.json
    use_webcam = data.get('useWebcam')
    
    if use_webcam:
        # Process the webcam stream here
        # For example, run your Python script and get the result
        result = subprocess.run(["python", "src-tauri/python/drowsiness.py"], capture_output=True)
        result = {"drowsinessScore": 0.5, "isDrowsy": False}  # Example result
        return jsonify(result)
    else:
        return jsonify({"error": "Invalid request"}), 400


@app.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server shutting down...'


if __name__ == '__main__':
    app.run(debug=True)