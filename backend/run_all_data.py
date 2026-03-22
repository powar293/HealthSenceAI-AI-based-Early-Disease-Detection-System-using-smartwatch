import time
import random
from datetime import datetime
import models, database, ml_model

def simulate_for_all():
    print("--- Smartwatch Data Simulator for All Users ---")
    
    while True:
        try:
            db = database.SessionLocal()
            users = db.query(models.User).all()
            if not users:
                print("No users found. Waiting...")
            
            for user in users:
                if not getattr(user, 'simulation_mode', True):
                    continue

                if random.random() < 0.15: # 15% chance of anomaly
                    heart_rate = random.choice([random.randint(40, 49), random.randint(101, 130)])
                    spo2 = random.randint(85, 94)
                    sleep_hours = random.uniform(2.0, 4.5)
                    activity_steps = random.randint(500, 2000)
                else: # normal data
                    heart_rate = random.randint(60, 95)
                    spo2 = random.randint(95, 100)
                    sleep_hours = random.uniform(6.0, 9.0)
                    activity_steps = random.randint(4000, 12000)
                    
                new_data = models.HealthData(
                    user_id=user.id,
                    heart_rate=heart_rate,
                    spo2=spo2,
                    sleep_hours=round(sleep_hours, 1),
                    activity_steps=activity_steps
                )
                db.add(new_data)
                
                risk_level, condition = ml_model.predict_risk(heart_rate, spo2, sleep_hours, activity_steps)
                if risk_level in ["Medium", "High"]:
                    alert = models.Alert(
                        user_id=user.id,
                        risk_level=risk_level,
                        predicted_condition=condition,
                        message=f"Alert: {condition} requires your attention."
                    )
                    db.add(alert)
                    
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Data added for user {user.email}: HR={heart_rate}, Risk={risk_level}")
                
            db.commit()
            db.close()
        except Exception as e:
            print(f"Error: {e}")
            
        time.sleep(5)

if __name__ == "__main__":
    simulate_for_all()
