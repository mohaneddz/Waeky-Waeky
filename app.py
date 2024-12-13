import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.spatial import distance
import face_recognition
import logging


# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5678"}})

# Define constants for drowsiness detection thresholds
EYE_AR_THRESH = 0.25  # Eye aspect ratio threshold for detecting drowsiness
MOUTH_AR_THRESH = 0  # Mouth aspect ratio threshold for detecting yawning

def eye_aspect_ratio(eye):
    """Calculate the eye aspect ratio to detect drowsiness."""
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

def mouth_aspect_ratio(mouth):
    """Calculate the mouth aspect ratio to detect yawning."""
    A = distance.euclidean(mouth[2], mouth[10])
    B = distance.euclidean(mouth[4], mouth[8])
    C = distance.euclidean(mouth[0], mouth[6])
    mar = (A + B) / (2.0 * C)
    return mar

def process_image(frame):
    """Process a single frame for drowsiness detection with improved scoring."""
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)

    total_ear = 0
    total_mar = 0
    count = 0

    for face_location in face_locations:
        landmarks_list = face_recognition.face_landmarks(rgb_frame, [face_location])
        if not landmarks_list:
            continue
        landmarks = landmarks_list[0]

        left_eye = np.array(landmarks['left_eye'])
        right_eye = np.array(landmarks['right_eye'])

        if 'mouth' in landmarks:
            mouth = np.array(landmarks['mouth'])
        else:
            # If 'mouth' key is not available, combine 'top_lip' and 'bottom_lip'
            mouth = np.array(landmarks.get('top_lip', []) + landmarks.get('bottom_lip', []))

        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)
        ear = (left_ear + right_ear) / 2.0

        if len(mouth) > 0:
            mar = mouth_aspect_ratio(mouth)
        else:
            mar = 0  # Default value if mouth landmarks are not detected

        total_ear += ear
        total_mar += mar
        count += 1

    if count == 0:
        return -1, frame, 0, 0

    avg_ear = total_ear / count
    avg_mar = total_mar / count

    # Normalize EAR and MAR to [0,1]
    normalized_ear = np.clip((EYE_AR_THRESH - avg_ear) / (EYE_AR_THRESH - 0.15), 0, 1)
    normalized_mar = np.clip((avg_mar - MOUTH_AR_THRESH) / (0.9 - MOUTH_AR_THRESH), 0, 1)

    # Combine normalized values
    drowsiness_score = (normalized_ear) + (0.2 * normalized_mar)
    drowsiness_score = max(0, drowsiness_score)  # Cap the score at 1
    drowsiness_score = min(1, drowsiness_score)

    return drowsiness_score, frame, normalized_ear, normalized_mar

# App Routes --------------------------

@app.route('/drowsiness_score', methods=['POST'])
def drowsiness_score():
    """Handle POST request for drowsiness detection."""
    data = request.get_json()
    image_data = data.get('image')
    if not image_data:
        return jsonify({"error": "No image data provided"}), 400

    try:
        # Decode the base64 image (without the prefix "data:image/jpeg;base64,")
        img_data = base64.b64decode(image_data)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process image for drowsiness detection
        score, _ , EAR, MAR,  = process_image(img)

        # Return the drowsiness score
        is_drowsy = bool(score > 0.7)  # Convert numpy.bool_ to standard bool

        return jsonify({"drowsinessScore": score, "isDrowsy": is_drowsy, "EAR": EAR, "MAR": MAR})

    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)