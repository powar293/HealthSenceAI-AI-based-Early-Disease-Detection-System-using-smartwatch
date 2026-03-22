from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    simulation_mode = Column(Boolean, default=True)

    health_data = relationship("HealthData", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    emergency_contacts = relationship("EmergencyContact", back_populates="user")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    phone_number = Column(String)
    relation = Column(String)

    user = relationship("User", back_populates="emergency_contacts")


class HealthData(Base):
    __tablename__ = "health_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    heart_rate = Column(Float) # BPM
    spo2 = Column(Float)       # Percentage
    sleep_hours = Column(Float)# Hours of sleep last night
    activity_steps = Column(Integer) # Steps today
    
    user = relationship("User", back_populates="health_data")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    risk_level = Column(String) # Low, Medium, High
    predicted_condition = Column(String)
    message = Column(String)
    status = Column(String, default="pending")

    user = relationship("User", back_populates="alerts")
