import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// MediaPipe landmarks indices
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
// Mouth points for Aspect Ratio (Inner lips)
const MOUTH_WIDTH = [78, 308];
const MOUTH_HEIGHT_1 = [82, 87];
const MOUTH_HEIGHT_2 = [13, 14];
const MOUTH_HEIGHT_3 = [312, 317];

const EYE_AR_THRESH = 0.25;
const MOUTH_AR_THRESH = 0;

let faceLandmarker: FaceLandmarker | null = null;

// Initialize the FaceLandmarker model
export const initializeDetector = async () => {
    if (faceLandmarker) return faceLandmarker;

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1
    });

    return faceLandmarker;
};

// Calculate euclidean distance between two landmarks, adjusted for aspect ratio
const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }, width: number, height: number) => {
    return Math.sqrt(Math.pow((p1.x - p2.x) * width, 2) + Math.pow((p1.y - p2.y) * height, 2));
};

// Calculate Eye Aspect Ratio
const eyeAspectRatio = (eyeIndices: number[], landmarks: Array<{ x: number; y: number }>, width: number, height: number) => {
    const A = distance(landmarks[eyeIndices[1]], landmarks[eyeIndices[5]], width, height); // Vertical right
    const B = distance(landmarks[eyeIndices[2]], landmarks[eyeIndices[4]], width, height); // Vertical left
    const C = distance(landmarks[eyeIndices[0]], landmarks[eyeIndices[3]], width, height); // Horizontal
    return (A + B) / (2.0 * C);
};

// Calculate Mouth Aspect Ratio
const mouthAspectRatio = (landmarks: Array<{ x: number; y: number }>, width: number, height: number) => {
    const A = distance(landmarks[MOUTH_HEIGHT_1[0]], landmarks[MOUTH_HEIGHT_1[1]], width, height);
    const B = distance(landmarks[MOUTH_HEIGHT_2[0]], landmarks[MOUTH_HEIGHT_2[1]], width, height);
    const C = distance(landmarks[MOUTH_HEIGHT_3[0]], landmarks[MOUTH_HEIGHT_3[1]], width, height);
    const D = distance(landmarks[MOUTH_WIDTH[0]], landmarks[MOUTH_WIDTH[1]], width, height);
    return (A + B + C) / (3.0 * D);
};

export const detectDrowsiness = (videoElement: HTMLVideoElement, timestamp: number) => {
    if (!faceLandmarker) return null;

    const results = faceLandmarker.detectForVideo(videoElement, timestamp);

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        const width = videoElement.videoWidth || 1280;
        const height = videoElement.videoHeight || 720;

        const leftEar = eyeAspectRatio(LEFT_EYE, landmarks, width, height);
        const rightEar = eyeAspectRatio(RIGHT_EYE, landmarks, width, height);
        const ear = (leftEar + rightEar) / 2.0;
        const mar = mouthAspectRatio(landmarks, width, height);

        // Normalize EAR and MAR to [0,1] based on thresholds
        const normalizedEar = Math.max(0, Math.min(1, (EYE_AR_THRESH - ear) / (EYE_AR_THRESH - 0.15)));
        const normalizedMar = Math.max(0, Math.min(1, (mar - MOUTH_AR_THRESH) / (0.9 - MOUTH_AR_THRESH)));

        // Combine normalized values
        let drowsinessScore = normalizedEar + (0.2 * normalizedMar);
        drowsinessScore = Math.max(0, Math.min(1, drowsinessScore));

        const isDrowsy = drowsinessScore > 0.7;

        return {
            drowsinessScore,
            isDrowsy,
            EAR: ear,
            MAR: mar
        };
    }

    return {
        drowsinessScore: -1,
        isDrowsy: false,
        EAR: 0,
        MAR: 0
    };
};
