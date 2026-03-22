import numpy as np

def predict_risk(heart_rate: float, spo2: float, sleep_hours: float, activity_steps: int):
    # This is a robust rule-based simulation of an ML model for demonstration.
    # In a full production scenario, we would load a pickled scikit-learn Random Forest model.
    
    risk_score = 0
    issues = []
    
    if heart_rate < 50 or heart_rate > 100:
        risk_score += 2
        issues.append(f"Abnormal Heart Rate ({heart_rate} BPM)")
        
    if spo2 < 95:
        risk_score += 3
        issues.append(f"Low SpO2 ({spo2}%)")
        
    if sleep_hours < 5:
        risk_score += 1
        issues.append(f"Sleep Deprivation ({sleep_hours} hrs)")
        
    if activity_steps < 3000:
        risk_score += 1
        issues.append(f"Low Activity ({activity_steps} steps)")
        
    risk_level = "Low"
    condition = "Healthy"
    
    if risk_score >= 4:
        risk_level = "High"
        condition = "High Risk: " + ", ".join(issues)
    elif risk_score >= 2:
        risk_level = "Medium"
        condition = "Monitor: " + ", ".join(issues)
        
    return risk_level, condition
