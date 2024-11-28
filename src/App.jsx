import { useState } from "react";
import { motion } from "motion/react";

import Video from "./components/Video";

import './css/index.css';
import Button from "./components/Button";

function App() {
  const [pingMsg, setPingMsg] = useState("");

  return (
    <main className="container">
      <motion.h1
        className="text-4xl font-bold text-center m-8 underline"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        WAKE UP
      </motion.h1>
      <Video className="w-full h-auto bg-[#141f31] rounded-lg my-8 overflow-hidden
      hover:scale-105 hover:border-black hover:border-4 transition duration-200
      active:scale-95" />
    </main>
  );
}

export default App;