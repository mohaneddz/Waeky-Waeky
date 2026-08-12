import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const Settings = () => {
    const titleRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [devices, setDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(localStorage.getItem("selectedCamera") || "");

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

    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request stream temporarily to get device labels
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = allDevices.filter(device => device.kind === "videoinput");
                setDevices(videoDevices);
                
                // Stop the temporary stream tracks
                stream.getTracks().forEach(track => track.stop());

                if (!localStorage.getItem("selectedCamera") && videoDevices.length > 0) {
                    setSelectedCamera(videoDevices[0].deviceId);
                    localStorage.setItem("selectedCamera", videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error("Error fetching devices", err);
            }
        };
        getDevices();
    }, []);

    const handleCameraChange = (e) => {
        const deviceId = e.target.value;
        setSelectedCamera(deviceId);
        localStorage.setItem("selectedCamera", deviceId);
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-900">
        <div ref={titleRef} className="p-8 bg-[#243b55]/40 border-4 border-solid border-[#141e30] backdrop-blur-md rounded-lg grid grid-cols-2 gap-4 w-1/2 min-w-[400px]">

            <div className="col-span-2 flex justify-between items-center mb-4">
                <h2 className="text-3xl text-cyan-400 font-bold">Settings</h2>
                <Link to="/" className="text-gray-300 hover:text-white underline">
                    Back to Home
                </Link>
            </div>

            <label className="block text-sm font-medium text-gray-300 self-center">Camera Device</label>
            <select 
                value={selectedCamera} 
                onChange={handleCameraChange}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            >
                {devices.length === 0 && <option value="">Loading cameras...</option>}
                {devices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${devices.indexOf(device) + 1}`}
                    </option>
                ))}
            </select>

            <label className="block text-sm font-medium text-gray-300 self-center">Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            />

            <label className="block text-sm font-medium text-gray-300 self-center">Dark Mode</label>
            <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="mt-1 w-5 h-5 accent-cyan-500 cursor-pointer"
            />

            <label className="block text-sm font-medium text-gray-300 self-center">Notifications</label>
            <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="mt-1 w-5 h-5 accent-cyan-500 cursor-pointer"
            />

            <button
                onClick={() => console.log("Settings saved!")}
                className="col-span-2 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition"
            >
                Save Settings
            </button>
        </div>
        </div>
    );
};

export default Settings;