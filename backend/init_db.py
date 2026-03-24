from database import engine
from models import Base

# Forcefully create tables
Base.metadata.create_all(bind=engine)
print("Database tables initialized successfully!")
