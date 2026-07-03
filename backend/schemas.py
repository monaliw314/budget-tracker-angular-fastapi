from typing import Literal

from pydantic import BaseModel
from datetime import date

class TransactionBase(BaseModel):
    title: str
    amount: float
    category: str
    type: Literal["income", "expense"]
    date: date

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int

    class Config:
        from_attributes = True