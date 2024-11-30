import { useEffect, useRef, useState } from "react";

export const Settings = () => {
    const titleRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [notifications, setNotifications] = useState(true);

    function ping() {
        console.log("Pong!");
    }

    useEffect(() => {
        const e = titleRef.current;
        if (e) {
            e.addEventListener("click", ping);
            return () => {
                e.removeEventListener("click", ping);
            };
        }
    }, []);

    return (
        <div ref={titleRef} className="p-8 bg-[#243b55]/40 border-4 border-solid border-[#141e30] backdrop-blur-md rounded-lg grid grid-cols-2 grid-rows-4 gap-4">

            <h2 className="text-3xl text-slate-400 font-bold mb-4 col-span-2">Settings</h2>

            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            <label className="block text-sm font-medium text-gray-700">Dark Mode</label>
            <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="mt-1"
            />

            <label className="block text-sm font-medium text-gray-700">Notifications</label>
            <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="mt-1"
            />

            <button
                onClick={() => console.log("Settings saved!")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Save Settings
            </button>
            <div className=""></div>
        </div>
    );
};

export default Settings;