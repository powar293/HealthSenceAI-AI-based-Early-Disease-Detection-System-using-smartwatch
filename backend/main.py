from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import models, schemas, auth, database, ml_model

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Early Disease Detection API")

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"id": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/health-data", response_model=schemas.HealthDataOut)
def add_health_data(health_data: schemas.HealthDataCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_data = models.HealthData(**health_data.model_dump(), user_id=current_user.id)
    db.add(new_data)
    
    # Run ML prediction based on incoming vital signs
    risk_level, condition = ml_model.predict_risk(
        heart_rate=health_data.heart_rate,
        spo2=health_data.spo2,
        sleep_hours=health_data.sleep_hours,
        activity_steps=health_data.activity_steps
    )
    
    # Generate an alert if risk is Medium or High
    if risk_level in ["Medium", "High"]:
        alert = models.Alert(
            user_id=current_user.id,
            risk_level=risk_level,
            predicted_condition=condition,
            message=f"Alert: {condition} requires your attention."
        )
        db.add(alert)
        
    db.commit()
    db.refresh(new_data)
    return new_data

@app.get("/health-data", response_model=list[schemas.HealthDataOut])
def get_health_data(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Returns latest 100 entries for the dashboard
    return db.query(models.HealthData).filter(models.HealthData.user_id == current_user.id).order_by(models.HealthData.timestamp.desc()).limit(100).all()

@app.get("/alerts", response_model=list[schemas.AlertOut])
def get_alerts(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Alert).filter(models.Alert.user_id == current_user.id).order_by(models.Alert.timestamp.desc()).all()

@app.patch("/users/me/simulation-mode")
def update_simulation_mode(mode: bool, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    current_user.simulation_mode = mode
    db.commit()
    return {"message": "Simulation mode updated", "simulation_mode": mode}

@app.post("/emergency-contacts", response_model=schemas.EmergencyContactOut)
def add_emergency_contact(contact: schemas.EmergencyContactCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_contact = models.EmergencyContact(**contact.model_dump(), user_id=current_user.id)
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@app.get("/emergency-contacts", response_model=list[schemas.EmergencyContactOut])
def get_emergency_contacts(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()

@app.delete("/emergency-contacts/{contact_id}")
def delete_emergency_contact(contact_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    contact = db.query(models.EmergencyContact).filter(models.EmergencyContact.id == contact_id, models.EmergencyContact.user_id == current_user.id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}

@app.post("/alerts/{alert_id}/action")
def perform_alert_action(alert_id: int, action_data: schemas.AlertAction, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id, models.Alert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if action_data.action == "cancel":
        alert.status = "cancelled"
    elif action_data.action == "trigger":
        alert.status = "triggered"
        contacts = db.query(models.EmergencyContact).filter(models.EmergencyContact.user_id == current_user.id).all()
        print(f"--- EMERGENCY TRIGGERED FOR {current_user.name} ---")
        if action_data.latitude and action_data.longitude:
            print(f"Location: https://www.google.com/maps?q={action_data.latitude},{action_data.longitude}")
        for c in contacts:
            print(f"Calling/Texting {c.name} ({c.relation}) at {c.phone_number}...")
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    db.commit()
    return {"message": f"Alert status updated to {alert.status}", "status": alert.status}
