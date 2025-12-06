from pydantic import BaseModel
from typing import Optional
from datetime import date


class TodoItem(BaseModel):
    id: Optional[str] = None
    text: str
    completed: bool = False
    due_date: Optional[date] = None
    priority: Optional[str] = None  # low, medium, high
    category: Optional[str] = None


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    category: Optional[str] = None
