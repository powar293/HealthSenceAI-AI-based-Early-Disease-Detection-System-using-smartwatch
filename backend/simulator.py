import time
import random
import requests
from datetime import datetime

BASE_URL = "http://localhost:8000"

def simulate_data(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Generate some semi-realistic smartwatch health data
    # Random spikes to trigger "Medium" or "High" risk periodically
    
    if random.random() < 0.15:
        # Generate an anomaly
        heart_rate = random.choice([random.randint(40, 49), random.randint(101, 130)])
        spo2 = random.randint(85, 94)
        sleep_hours = random.uniform(2.0, 4.5)
        activity_steps = random.randint(500, 2000)
    else:
        # Generate normal data
        heart_rate = random.randint(60, 95)
        spo2 = random.randint(95, 100)
        sleep_hours = random.uniform(6.0, 9.0)
        activity_steps = random.randint(4000, 12000)
    
    data = {
        "heart_rate": heart_rate,
        "spo2": spo2,
        "sleep_hours": round(sleep_hours, 1),
        "activity_steps": activity_steps
    }
    
    try:
        response = requests.post(f"{BASE_URL}/health-data", json=data, headers=headers)
        if response.status_code == 200:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Sent data: HR={heart_rate}, SpO2={spo2}%.")
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Error sending data: {response.text}")
    except requests.exceptions.ConnectionError:
        print("Backend not reachable. Waiting...")

def main():
    print("--- Smartwatch Data Simulator ---")
    
    # Wait for server to be ready
    time.sleep(2)
    
    login_data = {"username": "simulator@example.com", "password": "password123"}
    
    # Try logging in
    token = None
    while not token:
        try:
            resp = requests.post(f"{BASE_URL}/login", data=login_data)
            if resp.status_code == 401:
                # User doesn't exist, create it
                print("Registering simulator account...")
                user_data = {
                    "name": "Smartwatch Simulator User",
                    "email": "simulator@example.com",
                    "password": "password123"
                }
                requests.post(f"{BASE_URL}/signup", json=user_data)
                resp = requests.post(f"{BASE_URL}/login", data=login_data)
                
            if resp.status_code == 200:
                token = resp.json().get("access_token")
                print("Authentication successful.")
            else:
                print(f"Failed to authenticate: {resp.status_code}. Retrying in 5 seconds...")
                time.sleep(5)
        except requests.exceptions.ConnectionError:
            print("Cannot connect to API. Is the server running? Retrying in 5 seconds...")
            time.sleep(5)
            
    print("Starting data simulation every 5 seconds...")
    
    try:
        while True:
            simulate_data(token)
            time.sleep(5)
    except KeyboardInterrupt:
        print("Simulation stopped.")

if __name__ == "__main__":
    main()
