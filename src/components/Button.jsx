import React from 'react';
import { motion } from 'framer-motion';


const Button = ({ className, text, id, onClick, disabled }) => {
    return (
        <motion.button
            className={`${className} px-4 py-2 text-bold hover:scale-105 hover:shadow-lg active:scale-95 text-white text-[12px] sm:text-sm md:text-lg lg:text-xl`}
            onClick={onClick}
            disabled={disabled}
            id={id}
            initial={{ opacity: 0, y: -50, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)"
            }}
            whileTap={{
                scale: 0.9,
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"
            }}
            transition={{
                duration: 0.5,
                ease: "easeInOut",
                type: "spring",
                stiffness: 300
            }}
        >
            {text}
        </motion.button>
    );
};

export default Button;