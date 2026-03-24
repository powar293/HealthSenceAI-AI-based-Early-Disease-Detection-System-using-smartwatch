# AI-based Early Disease Detection System

A professional, full-stack Early Disease Detection System that simulates real-time health monitoring using smartwatch data (Heart Rate, SpO2, Sleep, Activity). It features a live dashboard, an interactive Control Panel with Auto/Manual simulation modes, and an advanced Emergency Alert system equipped with real-time location tracking and a 15-second cancellation countdown.

## Prerequisites
To run this project on any PC, ensure you have the following installed:
- **Python 3.8+** (for the backend)
- **Node.js 18+** & **npm** (for the frontend)
- **Git** (to clone the repository)

## Step-by-Step Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/powar293/HealthSenceAI-AI-based-Early-Disease-Detection-System-using-smartwatch.git
cd HealthSenceAI-AI-based-Early-Disease-Detection-System-using-smartwatch
```

*(If you are running it on the original PC, simply navigate to the `Early Disease Detection` folder).*

### 2. Start the Backend Server (FastAPI)
Open a terminal and navigate to the `backend` folder:
```bash
cd backend

# Create and activate a Virtual Environment (Recommended on a new PC)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Start the Backend API Server
python -m uvicorn main:app --reload --port 8000
```
*Note: The SQLite database (`disease_detection.db`) will automatically initialize on the first run.*

### 3. Start the Frontend Server (React + Vite)
Open a **new, separate terminal tab** and navigate to the `frontend` folder:
```bash
cd frontend

# Install the Node modules
npm install

# Start the frontend application
npm run dev
```

### 4. Open the Application
- Open your browser and navigate to exactly what Vite shows you (usually **http://localhost:5173**).
- Click **Sign Up** to create your medical profile and log in.

### 5. Running the Simulator
You can simulate live tracking using two methods:
1. **Control Panel (UI):** Navigate to the "Control Panel" in the web application's sidebar. You can toggle **Auto Mode** ON or use the manual sliders to instantly trigger a Critical Health Alert.
2. **Background Script:** Open a third terminal inside the `backend` folder and run `python simulator.py`. It will continuously stream real-time smartwatch data into your active dashboard!
