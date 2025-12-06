from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"


class Transaction(BaseModel):
    id: Optional[str] = None
    date: date
    amount: float
    type: TransactionType
    category: str
    description: str
    account: Optional[str] = None
    tags: Optional[list[str]] = None
    notes: Optional[str] = None


class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    amount: Optional[float] = None
    type: Optional[TransactionType] = None
    category: Optional[str] = None
    description: Optional[str] = None
    account: Optional[str] = None
    tags: Optional[list[str]] = None
    notes: Optional[str] = None


class Budget(BaseModel):
    month: str  # Format: YYYY-MM
    categories: dict[str, float]  # category -> budget amount
    notes: Optional[str] = None


class Account(BaseModel):
    id: Optional[str] = None
    name: str
    type: str  # checking, savings, credit, investment
    balance: float = 0.0
    notes: Optional[str] = None


class MonthlyReport(BaseModel):
    month: str
    total_income: float
    total_expenses: float
    net: float
    by_category: dict[str, float]
    budget_comparison: Optional[dict[str, dict[str, float]]] = None
