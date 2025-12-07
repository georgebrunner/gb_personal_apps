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
    list_type: str = "todo"  # todo, shopping, notes
    store: Optional[str] = None  # For shopping lists: sams_club, lowes, walmart, wegmans, trader_joes, etc.


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    list_type: Optional[str] = None
    store: Optional[str] = None


# Predefined stores for shopping lists
STORES = [
    {"id": "sams_club", "name": "Sam's Club"},
    {"id": "lowes", "name": "Lowe's"},
    {"id": "walmart", "name": "Walmart"},
    {"id": "wegmans", "name": "Wegman's"},
    {"id": "trader_joes", "name": "Trader Joe's"},
]
