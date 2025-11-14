import React from 'react';
import { motion } from 'motion/react';
import { getButtonClass } from '../lib/Utils';

const Button = ({ className, text, id, onClick, disabled, audio, isLoading, intervalId }) => {

    const startButtonChange = () => {
        if (!intervalId) {
            return "bg-gradient-to-b from-green-400 to-blue-500 rounded-lg shadow-lg shadow-blue-900 active:from-green-600 active:to-blue-600 opacity-80 hover:shadow-2xl hover:shadow:slate-900 ";
        } else {
            return "bg-gradient-to-b from-slate-400 to-zinc-500 border-slate-500 rounded-lg active:from-slate-400 active:to-zinc-700 shadow-md hover:shadow-2xl hover:shadow:slate-900";
        }
    }

    const stopButtonChange = () => {
        if (intervalId) {
            return "bg-gradient-to-b from-rose-400 to-purple-700 rounded-lg shadow-lg shadow-purple-900 active:from-red-600 active:to-blue-600 hover:shadow-2xl hover:shadow:slate-900";
        } else {
            return "bg-gradient-to-b from-slate-400 to-zinc-500 border-slate-500 rounded-lg active:from-slate-400 active:to-zinc-700 shadow-md hover:shadow-2xl hover:shadow:slate-900";
        }
    }

    const drowsyButtonChange = () => {
        if (audio) {
            return "bg-gradient-to-b from-red-500 to-red-700 border-red-900 rounded-lg shadow-lg shadow-red-700 active:from-red-600 active:to-blue-600 transform scale-105 hover:shadow-2xl hover:shadow:slate-900";
        } else {
            return "bg-gradient-to-b from-slate-400 to-zinc-500 border-slate-500 rounded-lg active:from-slate-400 active:to-zinc-700 shadow-md hover:shadow-2xl hover:shadow:slate-900";
        }
    }

    return (
        <motion.button
            className={`px-4 py-2 font-extrabold z-20 ${disabled ? '' : 'hover:scale-105 hover:shadow-lg active:scale-95'} text-white text-[12px] sm:text-sm md:text-lg lg:text-xl ${getButtonClass(id, startButtonChange, stopButtonChange, drowsyButtonChange)} ${className}`}
            onClick={onClick}
            disabled={disabled}
            id={id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={disabled ? {} : {
                scale: 1.1,
            }}
            whileTap={disabled ? {} : {
                scale: 0.9,
            }}
            transition={{
                duration: 0.5,
                ease: "easeInOut",
                type: "spring",
                stiffness: 100
            }}
        >
            {text}
        </motion.button>
    );
};

export default Button;