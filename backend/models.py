from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    category = Column(String, index=True)
    type = Column(String)  # "income" or "expense"
    date = Column(Date)