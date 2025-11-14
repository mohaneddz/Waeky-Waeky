import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import Button from "../components/Button";
import Video from "../components/Video";
import { LampContainer } from "../components/Lamp";

import sound1 from "../assets/sounds/sound1.mp3";
import sound2 from "../assets/sounds/sound2.mp3";
import sound3 from "../assets/sounds/sound3.mp3";
import sound4 from "../assets/sounds/sound4.mp3";
import sound5 from "../assets/sounds/sound5.mp3";

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
    const TOOLONG = 5; // About 10 seconds, kinda good for me

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
        iAmAwake();
    };

    return (
        <main className="container w-screen flex flex-col justify-center align-center items-center">


            <motion.h1
                className="z-[100] text-4xl font-bold text-center m-8 underline text-cyan-200 text-shadow-lg
                absolute top-[5rem]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Stay Awake, Keep Grinding!
            </motion.h1>

            < LampContainer />

            <div id="Buttons__Container" className="flex justify-center mb-8 gap-4 absolute top-[16rem]" >

                <Button
                    text={"Start Session"}
                    id="start"
                    onClick={() => runPython(canvasRef, videoRef)}
                    disabled={intervalId}
                    audio={audio}
                    intervalId={intervalId}
                    isLoading={isLoading}
                />

                <Button
                    text={"Go To Sleep"}
                    id="end"
                    onClick={() => stopWebcam()}
                    disabled={!intervalId}
                    audio={audio}
                    intervalId={intervalId}
                    isLoading={isLoading}
                />

                <Button
                    text={"I'm Awake!"}
                    id="awake"
                    onClick={() => iAmAwake()}
                    disabled={isLoading || !audio}
                    audio={audio}
                    intervalId={intervalId}
                    isLoading={isLoading}
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

export default Home;