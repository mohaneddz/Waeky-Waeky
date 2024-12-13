export const getScoreColor = (score) => {
    if (score === -1) return "text-red-500 text-shadow"; // No face detected
    if (score < 0.4) return "text-cyan-700 text-shadow"; // Good score
    if (score < 0.8) return "text-lime-500 text-shadow"; // Average score
    return "text-red-500 text-shadow"; // Bad score
};

export const getButtonClass = (id, startButtonChange, stopButtonChange, drowsyButtonChange) => {
    switch (id) {
        case "start":
            return startButtonChange();
        case "end":
            return stopButtonChange();
        case "awake":
            return drowsyButtonChange();
        default:
            return "";
    }
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const importAllSounds = async () => {
    try {
      // Define the path to the folder containing your sound files
      const soundDir = await join('assets/sounds');  // Specify your directory path here
  
      // Read the files in the directory
      const files = await readDir(soundDir);
  
      // Filter out only the mp3 files
      const mp3Files = files.filter(file => file.name.endsWith('.mp3')).map(file => file.path);
  
      // Now you can work with the list of .mp3 files
      console.log('Loaded MP3 files:', mp3Files);
  
      // Example: Load each file (you can use this list to create audio elements or play sounds)
      mp3Files.forEach(filePath => {
        console.log(`Sound file path: ${filePath}`);
        // You can create audio elements or use the file paths as needed
      });
  
    } catch (error) {
      console.error('Error reading files:', error);
    }
  };
  