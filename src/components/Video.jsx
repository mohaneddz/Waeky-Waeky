import React, { useEffect, useRef, useState } from "react";
import { getScoreColor } from "../utils/lib";

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
        <div className="video-container flex flex-col items-center justify-center">

            <div className={className + `w-5/6 h-auto bg-[#141f31] rounded-lg my-8 overflow-hidden border-4 border-black
                hover:scale-105 hover:border-[#789dd9] hover:border-8 transition duration-200 active:scale-95`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    id="video"
                    width="800"
                    height="500"
                />
            </div>

            <div className="status flex flex-col w-full justify-center align-middle items-center gap-16">
                <div className="score text-[#789dd9] text-xl inline">
                    Drowsiness Score:&nbsp;&nbsp;
                    <span className={`score text-xl inline ${getScoreColor(Score)}`}>
                        {Score !== -1 ? Score.toFixed(2) : "No Face Detected Yet.."}
                    </span>
                    {error && <div className="error">{error}</div>}
                    {isLoading && <div className="loading">Loading...</div>}
                    {/* {<div className="loading">EAR: {EAR.toFixed(2)}</div>} */}
                    {/* {<div className="loading">MAR: {MAR.toFixed(2)}</div>} */}
                </div>
                {(isDrowsy || Score === -1) && (
                    <div className="drowsy-alert p-4 sm:p-6 md:p-8 lg:p-10 animate-bounce max-w-full
                text-white bg-gradient-to-r from-red-500 to-red-700 border-red-900
                border-solid rounded-lg text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold shadow-xl">
                        Drowsiness Detected!
                    </div>
                )}
            </div>

            {/* Canvas to capture video frames */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default Video;
