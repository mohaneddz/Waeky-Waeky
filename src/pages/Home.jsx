import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Video from "../components/Video";
import { motion } from "framer-motion";

import sound1 from "../assets/sound1.mp3";
import sound2 from "../assets/sound2.mp3";
import sound3 from "../assets/sound3.mp3";
import sound4 from "../assets/sound4.mp3";
import sound5 from "../assets/sound5.mp3";

const sounds = [sound1, sound2, sound3, sound4, sound5];

export const Home = () => {

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [Score, setScore] = useState(0);
    const [isDrowsy, setIsDrowsy] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [asleep, setAsleep] = useState(false);
    const [audio, setAudio] = useState(null);

    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const TOOLONG = 5;

    useEffect(() => {
        if (asleep >= TOOLONG) {
            wakeUP();
        }
    }, [asleep]);

    const wakeUP = () => {
        if (!audio) {
            const sound = sounds[Math.floor(Math.random() * sounds.length)];
            const newAudio = new Audio(sound);
            newAudio.volume = 1.0;
            newAudio.loop = true;
            newAudio.play().catch((error) => console.error("Audio play error:", error));
            setAudio(newAudio);
        }
    };

    const iAmAwake = () => {
        setAsleep(0);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setAudio(null);
        }
    };

    const runPython = async (canvasRef, videoRef) => {
        setIsLoading(true);
        setError(null);

        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            const captureFrame = () => {
                if (!videoRef.current) return;

                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL("image/jpeg");

                fetch("http://localhost:5000/drowsiness_score", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ image: imageData.split(",")[1] }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setScore(data.drowsinessScore);
                        setIsDrowsy(data.isDrowsy);
                        // setEAR(data.EAR);
                        // setMAR(data.MAR);
                        setError(null);

                        data.drowsinessScore > 0.7 || data.drowsinessScore === -1
                            ? setAsleep((sleep) => sleep + 1)
                            : setAsleep(0);
                    })
                    .catch((error) => {
                        setError(error.message);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            };

            const id = setInterval(captureFrame, 2000);
            setIntervalId(id);

            return () => clearInterval(intervalId);
        } catch (error) {
            setError(error.message);
        }
    };

    const stopWebcam = async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setError(null);
        setIsLoading(false);
        setScore(0);
    };

    const drowsyButtonChange = () => {
        if (audio) {
            return "bg-gradient-to-bl from-red-500 to-red-700 border-red-900 rounded-lg active:from-red-600 active:to-blue-600 animation animate-pulse";
        } else {
            return "bg-gradient-to-bl from-slate-400 to-zinc-700 rounded-lg active:from-slate-400 active:to-zinc-700";
        }
    }

    const startButtonChange = () => {
        if (isLoading || !intervalId) {
            return "bg-gradient-to-bl from-green-400 to-blue-500 rounded-lg active:from-green-600 active:to-blue-600 animation opacity-0.8";
        } else {
            return "bg-gradient-to-bl from-green-700 to-blue-900 rounded-lg active:from-green-600 active:to-blue-600";
        }
    }

    const stopButtonChange = () => {
        if (isLoading || !intervalId) {
            return "bg-gradient-to-bl from-red-700 to-blue-900 rounded-lg active:from-red-600 active:to-blue-600";
        } else {
            return "bg-gradient-to-bl from-red-400 to-blue-500 rounded-lg active:from-red-600 active:to-blue-600 animation opacity-0.8";
        }
    }


    return (
        <main className="container">

            <motion.h1
                className="text-4xl font-bold text-center m-8 underline text-slate-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                WAKE UP
            </motion.h1>

            <div id="Buttons__Container" className="flex justify-center mb-8 gap-4">

                <Button
                    text={"Start Session"}
                    id="start"
                    className={startButtonChange()}
                    onClick={() => runPython(canvasRef, videoRef)}
                    disabled={isLoading}
                />

                <Button
                    text={"Go To Sleep"}
                    id="end"
                    className={stopButtonChange()}
                    onClick={() => stopWebcam()}
                    disabled={isLoading}
                />

                <Button
                    text={"I'm Awake!"}
                    id="end"
                    className={drowsyButtonChange()}
                    onClick={() => iAmAwake()}
                    disabled={isLoading}
                />
            </div>

            <Video
                error={error}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                Score={Score}
                setScore={setScore}
                isDrowsy={isDrowsy}
                canvasRef={canvasRef}
                videoRef={videoRef}
                key="video"
            />
        </main>
    );
};

export default Home