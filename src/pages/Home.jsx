import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import Video from "../components/Video";
import { LampContainer } from "../components/Lamp";

import { initializeDetector, detectDrowsiness } from "../lib/detector";

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

    const [isDetecting, setIsDetecting] = useState(false);

    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const rafRef = useRef(null);
    const lastCheckRef = useRef(0);
    const asleepStartRef = useRef(null); // Track when they started sleeping

    const AWAKE_THRESHOLD = 0.5; // Detection stringency
    const TOOLONG = 3000; // 3 seconds of continuous drowsiness to trigger alarm

    // Initialize detector on startup for instantaneous starting
    useEffect(() => {
        initializeDetector().catch(console.error);
    }, []);

    useEffect(() => {
        if (asleep) {
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

    const runDetector = async () => {
        setIsLoading(true);
        setError(null);
        setIsDetecting(true);

        try {
            await initializeDetector();
            
            const selectedCamera = localStorage.getItem("selectedCamera");
            const videoConstraints = { width: { ideal: 1280 }, height: { ideal: 720 } };
            if (selectedCamera) {
                videoConstraints.deviceId = { exact: selectedCamera };
            }

            const constraints = {
                video: videoConstraints,
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;

            const detect = (now) => {
                if (!videoRef.current || videoRef.current.readyState !== 4) {
                    rafRef.current = requestAnimationFrame(detect);
                    return;
                }

                // Throttle detection to save power (e.g. max 10 fps)
                if (now - lastCheckRef.current > 100) {
                    lastCheckRef.current = now;
                    
                    try {
                        const data = detectDrowsiness(videoRef.current, performance.now());
                        
                        if (data) {
                            setScore(data.drowsinessScore);
                            setIsDrowsy(data.isDrowsy);
                            setError(null);

                            if (data.drowsinessScore > AWAKE_THRESHOLD || data.drowsinessScore === -1) {
                                if (asleepStartRef.current === null) asleepStartRef.current = now;
                                
                                if (now - asleepStartRef.current > TOOLONG) {
                                    setAsleep(true);
                                }
                            } else {
                                asleepStartRef.current = null;
                            }
                        }
                    } catch (error) {
                        setError(error.message);
                    }
                }

                rafRef.current = requestAnimationFrame(detect);
            };

            // Wait until video starts playing before running detect
            videoRef.current.onloadeddata = () => {
                setIsLoading(false);
                rafRef.current = requestAnimationFrame(detect);
            };
            
        } catch (error) {
            setError(error.message);
            setIsDetecting(false);
            setIsLoading(false);
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
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setIsDetecting(false);
        setError(null);
        setIsLoading(false);
        setScore(0);
        asleepStartRef.current = null;
        iAmAwake();
    };

    // Auto-start detection on mount
    useEffect(() => {
        runDetector();
        return () => stopWebcam();
    }, []);

    return (
        <main className="container w-screen flex flex-col justify-center align-center items-center">

            <div className="absolute top-4 right-8 z-[200]">
                <Link to="/settings" className="text-gray-300 hover:text-white underline font-bold bg-[#141e30] px-4 py-2 rounded-lg border-2 border-gray-600 hover:border-cyan-500 transition">
                    ⚙️ Settings
                </Link>
            </div>

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
                    onClick={() => runDetector()}
                    disabled={isDetecting}
                    audio={audio}
                    intervalId={isDetecting ? 1 : null}
                    isLoading={isLoading}
                />

                <Button
                    text={"Go To Sleep"}
                    id="end"
                    onClick={() => stopWebcam()}
                    disabled={!isDetecting}
                    audio={audio}
                    intervalId={isDetecting ? 1 : null}
                    isLoading={isLoading}
                />

                <Button
                    text={"I'm Awake!"}
                    id="awake"
                    onClick={() => iAmAwake()}
                    disabled={isLoading || !audio}
                    audio={audio}
                    intervalId={isDetecting ? 1 : null}
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