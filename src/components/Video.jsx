import React from "react";
import { getScoreColor } from "../lib/Utils";

const Video = ({
    className,
    error,
    isLoading,
    Score,
    isDrowsy,
    canvasRef,
    videoRef
}) => {

    return (
        <div className="video-container flex flex-col items-center justify-center absolute top-[24rem]">

            <div className={className + ` w-[34rem] h-auto bg-[#2E2E2E] rounded-lg my-8 overflow-hidden border-4 border-black
                hover:scale-105 hover:border-cyan-500 hover:border-8 transition duration-50 active:scale-95 relative
                shadow-inner shadow-cyan-500/100`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    id="video"
                    width="1080"
                    height="720"
                    className="relative z-10"
                />
                <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-20"></div>
            </div>

            <div className="status flex flex-col w-full justify-center align-middle items-center gap-16">
                <div className="score text-[#B1B1B1] text-xl inline p-4 bg-[#2b140922] rounded-lg shadow-inner shadow-cyan-500/80">
                    Drowsiness Score:&nbsp;&nbsp;
                    <span className={`score text-xl inline ${getScoreColor(Score)}`}>
                        {Score !== -1 ? Score.toFixed(2) : "No Face Detected"}
                    </span>
                    {error && <div className="error">{error}</div>}
                    {isLoading && <div className="loading">Loading...</div>}
                </div>
                {(isDrowsy || Score === -1) && (
                    <div className="drowsy-alert p-4 sm:p-6 md:p-8 lg:p-10 animate-bounce max-w-full
                text-white bg-gradient-to-tr from-red-600 to-rose-500 border-red-500
                border-solid rounded-lg text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold shadow-xl">
                        Drowsiness Detected!
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default Video;