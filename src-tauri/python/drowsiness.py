import cv2
import numpy as np
import face_recognition
from scipy.spatial import distance
import json
import sys
import base64
import argparse

print('Python script loaded...')

def eye_aspect_ratio(eye):
    """Calculate the eye aspect ratio to detect drowsiness."""
    A = distance.euclidean(eye[1], eye[5])
    B = distance.euclidean(eye[2], eye[4])
    C = distance.euclidean(eye[0], eye[3])
    ear = (A+B) / (2.0 * C)
    return ear

def mouth_aspect_ratio(mouth):
    """Calculate the mouth aspect ratio to detect yawning."""
    A = distance.euclidean(mouth[2], mouth[10])
    B = distance.euclidean(mouth[4], mouth[8])
    C = distance.euclidean(mouth[0], mouth[6])
    mar = (A+B) / (2.0 * C)
    return mar

def process_image(frame):
    """Process a single frame for drowsiness detection."""
    # Define thresholds
    EYE_AR_THRESH = 0.25
    MOUTH_AR_THRESH = 0.6

    if frame is None:
        raise ValueError('Image is not found or unable to open')

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # find all face locations
    face_locations = face_recognition.face_locations(rgb_frame)

    # initiate flags
    eye_flag = mouth_flag = False

    for face_location in face_locations:
        # extract facial landmarks
        landmarks = face_recognition.face_landmarks(rgb_frame, [face_location])[0]
        # extract eye and mouth coordinates
        left_eye = np.array(landmarks['left_eye'])
        right_eye = np.array(landmarks['right_eye'])
        mouth = np.array(landmarks['bottom_lip'])

        # calculate ear and mar
        left_ear = eye_aspect_ratio(left_eye)
        right_ear = eye_aspect_ratio(right_eye)
        ear = (left_ear+right_ear) / 2.0
        mar = mouth_aspect_ratio(mouth)

        # check if eyes are closed
        if ear < EYE_AR_THRESH:
            eye_flag = True
            # Draw red rectangles around eyes
            for (x, y) in left_eye:
                cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)
            for (x, y) in right_eye:
                cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)

        # check if yawning
        if mar > MOUTH_AR_THRESH:
            mouth_flag = True
            # Draw blue rectangles around mouth
            for (x, y) in mouth:
                cv2.circle(frame, (x, y), 3, (255, 0, 0), -1)

    return eye_flag, mouth_flag, frame

def process_video(is_webcam=False):
    """
    Process video from a webcam for drowsiness detection.
    
    Args:
        is_webcam (bool, optional): Whether to use webcam. Defaults to False.
    """
    # Open video capture
    video_cap = cv2.VideoCapture(0) if is_webcam else None

    count = score = 0

    while True:
        success, image = video_cap.read()
        if not success:
            break

        # Resize image
        image = cv2.resize(image, (800, 500))

        count += 1
        # process every nth frame
        n = 5
        if count % n == 0:
            eye_flag, mouth_flag, annotated_image = process_image(image)
            # if any flag is true, increment the score
            if eye_flag or mouth_flag:
                score += 1
            else:
                score -= 1
                if score < 0:
                    score = 0

        # write the score values at bottom left of the image
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_x = 10
        text_y = image.shape[0] - 10
        text = f"Score: {score}"
        cv2.putText(annotated_image, text, (text_x, text_y), font, 1, (0, 255, 0), 2, cv2.LINE_AA)

        if score >= 5:
            text_x = image.shape[1] - 130
            text_y = 40
            text = "Drowsy"
            cv2.putText(annotated_image, text, (text_x, text_y), font, 1, (0, 0, 255), 2, cv2.LINE_AA)

    video_cap.release()
    return score, score >= 5

def main():
    """Main function to handle command-line arguments."""
    parser = argparse.ArgumentParser(description='Drowsiness Detection')
    parser.add_argument('--webcam', action='store_true', help='Use webcam')
    print('Starting drowsiness detection...')
    
    args = parser.parse_args()
    
    if args.webcam:
        score, is_drowsy = process_video(is_webcam=True)
        print(json.dumps({'score': score, 'is_drowsy': is_drowsy}))
    else:
        print(json.dumps({'error': 'No video source specified'}))
        sys.exit(1)

if __name__ == '__main__':
    main()