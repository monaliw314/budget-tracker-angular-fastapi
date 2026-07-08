from unittest import result

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Budget Tracker API is running"}

@app.get("/transactions", response_model=list[schemas.Transaction])
def read_transactions(db: Session = Depends(get_db)):
    return crud.get_transactions(db)

@app.post("/transactions")
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    result = crud.create_transaction(db, transaction)
    return {
        "message": "Record created successfully",
        "data": schemas.Transaction.model_validate(result)
    }

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    result = crud.delete_transaction(db, transaction_id)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Record Deleted successfully"}

@app.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    result = crud.update_transaction(db, transaction_id, transaction)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {
        "message": "Record updated successfully",
        "data": schemas.Transaction.model_validate(result)
    }