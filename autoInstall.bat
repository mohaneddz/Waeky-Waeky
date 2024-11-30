@echo off
echo Setting up WAKEY-WAKEY...

:: Clone the repository
echo Cloning the repository...
git clone https://github.com/mohaneddz/Waeky-Waeky
cd Waeky-Waeky

:: Set up the backend
echo Setting up the backend...
cd flask-backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

:: Install frontend dependencies
echo Installing frontend dependencies...
npm install

echo Setup complete!
pause