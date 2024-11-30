Here’s an improved version of your documentation with better phrasing and organization. I’ve also added icons for the technologies where applicable:

---

# 🚨 **WAKEY-WAKEY** 🚨

## **Stay Alert, Stay Safe!** 👀

WAKEY-WAKEY is your **friendly desktop companion** designed to keep you **awake and alert**. By leveraging cutting-edge **computer vision technologies**, it monitors your alertness in real-time. Whether you’re burning the midnight oil, cramming for exams, or powering through long tasks, WAKEY-WAKEY helps you stay sharp and safe!

## **What Does It Do?** 🤔

- **Real-Time Drowsiness Detection**: Using your webcam and advanced facial recognition, WAKEY-WAKEY continuously monitors your eye movements and facial expressions *(don’t yawn too much!)*.
- **Smart Alert System**: When signs of drowsiness (like prolonged eye closure or frequent yawning) are detected, the app triggers customizable **audio alerts** to keep you on track.
- **Non-Intrusive Monitoring**: It works quietly in the background, allowing you to focus on your tasks without interruption.
- **Privacy-Focused**: All processing occurs locally on your machine, ensuring **no data is sent to external servers**.
- **Scientific Approach**: It uses proven computer vision techniques, such as:
  - **Eye Aspect Ratio (EAR)** tracking
  - **Mouth Aspect Ratio (MAR)** analysis
  - **Facial landmark detection** and advanced weight calculations

## **Perfect For** 🎯

- Students pulling all-nighters
- Professionals working long hours
- Anyone needing to stay alert during important tasks
- Night shift workers
- Remote workers maintaining focus during long sessions

WAKEY-WAKEY combines the power of a **Flask backend** with a sleek **React frontend**, all wrapped in a native desktop application using **Tauri**. This ensures high performance, low resource usage, and a smooth user experience!

## **📋 Features**

- **Flask** backend API
- **React** frontend with **Vite**
- **Tailwind CSS** styling
- **Python** virtual environment
- **PostCSS** processing
- **Rust** as the engine for the program
- Native app support with **Tauri**

## **🛠 Tech Stack**

### **Backend**  
- ![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white) **[Rust](https://www.rust-lang.org/learn)** – Safe & fast low-level language  
- ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white) **[Flask](https://flask.palletsprojects.com/)** – Python web framework  
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **[Python 3.x](https://www.python.org/)** – The "AI language"  

### **Frontend**  
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **[React](https://reactjs.org/)** – UI library  
- ![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework  
- ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) **[PostCSS](https://postcss.org/)** – CSS transformation tool  
- ![Vite](https://img.shields.io/badge/Vite-4FC08D?style=flat&logo=vite&logoColor=white) **[Vite](https://vitejs.dev/)** – Build tool and dev server  
- ![Motion](https://img.shields.io/badge/Motion-FF0080?style=flat&logo=motion&logoColor=white) **[Motion](https://motion.dev)** – UI library for smooth animations  

## **📁 Project Structure**

```
├── flask-backend/     # Flask server code
│   ├── venv/          # Python virtual environment
│   └── requirements.txt
├── src/               # Frontend source code
├── public/            # Static assets
├── src-tauri/         # Tauri native app config
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## **⚙️ Installation**

1. Clone the repository:
```sh
git clone <repository-url>
cd <project-name>
```

2. Set up the backend:
```sh
cd flask-backend
python -m venv venv
venv\Scripts\activate
# UNIX: source venv/bin/activate  
pip install -r requirements.txt
```

3. Install frontend dependencies:
```sh
npm install
```

## **🚀 Development**

1. Start the Flask backend:
```sh
cd flask-backend
flask run
```

2. Start the frontend development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## **🔧 Configuration**

### **Environment Variables**

use the `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
FLASK_APP=app.py
FLASK_ENV=development
```

## **📦 Building for Production**

1. Build the frontend:
```sh
npm run build
```

2. Build Tauri application (optional):
```sh
npm run tauri build
```

## **🧪 Testing**

Run backend tests:
```sh
cd flask-backend
python -m pytest
```

Run frontend tests:
```sh
npm test
```

## **🤝 Contributing**

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## **License** ⚖️

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.