import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Button from "./Button";
const Video = ({ className }) => {

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [drowsinessScore, setDrowsinessScore] = useState(0);
    const [isDrowsy, setIsDrowsy] = useState(false);

    const runPython = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const response = await fetch('http://localhost:5000/process-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ useWebcam: true })
            });

            const result = await response.json();
            setDrowsinessScore(result.drowsinessScore);
            setIsDrowsy(result.isDrowsy);

            if (videoRef.current) {
                await videoRef.current.play();
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);

        }
    };

    // Currently Obsolete ----------------

    const startWebcam = async () => {
        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user' // Front camera
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                await runPython(null, true);
            }
        } catch (err) {
            setError("Failed to access webcam. Please ensure permissions are granted.");
            console.error("Webcam error:", err);
        }
    };

    const stopWebcam = async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        try {
            await fetch('http://localhost:5000/shutdown', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error shutting down Flask server:', error);
        }
    };

    // -----------------------------------

    return (
        <div className="video-container">

            <div id="Buttons__Container"
                className="flex gap-8 justify-center mb-8">

                <Button text={"Start Session"}
                    id="start"
                    className="bg-gradient-to-bl from-green-400 to-blue-500 rounded-lg 
                    active:from-green-600 active:to-blue-600"
                    onClick={() => runPython()}
                    disabled={isLoading}
                />

                <Button text={"Go To Sleep"}
                    id="end"
                    className="bg-gradient-to-bl from-red-400 to-blue-500 rounded-lg 
                    active:from-red-600 active:to-blue-600"
                    onClick={stopWebcam}
                    disabled={isLoading || !streamRef.current}
                />

            </div>

            <div className={className}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                />
            </div>

            <div className="status">
                {isDrowsy && (
                    <div className="drowsy-alert">
                        ⚠️ Drowsiness Detected!
                    </div>
                )}

                <div className="score text-[#789dd9]">
                    Drowsiness Score: {drowsinessScore}
                </div>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="loading">
                        Loading...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Video;