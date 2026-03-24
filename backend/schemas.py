from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserConfig(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None

class UserOut(UserBase):
    id: int
    age: Optional[int]
    gender: Optional[str]
    simulation_mode: bool

    class Config:
        from_attributes = True

class EmergencyContactCreate(BaseModel):
    name: str
    phone_number: str
    relation: str

class EmergencyContactOut(EmergencyContactCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class HealthDataCreate(BaseModel):
    heart_rate: float
    spo2: float
    sleep_hours: float
    activity_steps: int

class HealthDataOut(HealthDataCreate):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    user_id: int
    timestamp: datetime
    risk_level: str
    predicted_condition: str
    message: str
    status: str

    class Config:
        from_attributes = True

class AlertAction(BaseModel):
    action: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
