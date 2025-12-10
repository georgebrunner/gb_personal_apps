from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime
from typing import Optional

from .models import DailyEntry, ExerciseEntry, TodoItem, TodoList
from . import storage

app = FastAPI(
    title="GB Health API",
    description="Personal health tracking API",
    version="1.0.0"
)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GB Health API", "status": "running"}


# Daily entries
@app.post("/daily")
def create_daily_entry(entry: DailyEntry):
    """Create or update a daily entry."""
    entry_dict = entry.model_dump()
    saved = storage.save_daily_entry(entry_dict)
    return saved


@app.get("/daily/{date_str}")
def get_daily_entry(date_str: str):
    """Get a daily entry by date (YYYY-MM-DD)."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    entry = storage.get_daily_entry(d)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@app.get("/daily")
def list_daily_entries(limit: int = 30):
    """List recent daily entries."""
    return storage.get_all_daily_entries(limit)


@app.get("/daily/today")
def get_today():
    """Get today's entry or empty template."""
    today = date.today()
    entry = storage.get_daily_entry(today)
    if entry:
        return entry
    return {"date": today.isoformat(), "message": "No entry yet for today"}


# Exercise entries
@app.post("/exercise")
def create_exercise_entry(entry: ExerciseEntry):
    """Log an exercise session."""
    entry_dict = entry.model_dump()

    # Calculate pace if distance and duration provided
    if entry.distance_miles and entry.duration_minutes and entry.distance_miles > 0:
        pace_minutes = entry.duration_minutes / entry.distance_miles
        pace_min = int(pace_minutes)
        pace_sec = int((pace_minutes - pace_min) * 60)
        entry_dict["pace_per_mile"] = f"{pace_min}:{pace_sec:02d}"

    saved = storage.save_exercise_entry(entry_dict)
    return saved


@app.get("/exercise/{date_str}")
def get_exercise_entries(date_str: str):
    """Get exercise entries for a date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    return storage.get_exercise_entries(d)


@app.get("/exercise")
def list_exercise_entries(limit: int = 30):
    """List recent exercise entries."""
    return storage.get_all_exercise_entries(limit)


# Todo list endpoints
@app.get("/todos/{date_str}")
def get_todos(date_str: str):
    """Get todo list for a specific date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    todos = storage.get_todos(d)
    if not todos:
        return {"date": date_str, "items": []}
    return todos


@app.post("/todos/{date_str}")
def save_todos(date_str: str, todo_list: TodoList):
    """Save todo list for a specific date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    todo_dict = todo_list.model_dump()
    saved = storage.save_todos(d, todo_dict)
    return saved


@app.post("/todos/{date_str}/item")
def add_todo_item(date_str: str, item: TodoItem):
    """Add a single todo item to a date's list."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    item_dict = item.model_dump()
    saved = storage.add_todo_item(d, item_dict)
    return saved


@app.patch("/todos/{date_str}/item/{item_id}")
def toggle_todo_item(date_str: str, item_id: str, completed: bool):
    """Toggle a todo item's completed status."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    result = storage.toggle_todo_item(d, item_id, completed)
    if not result:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return result


@app.delete("/todos/{date_str}/item/{item_id}")
def delete_todo_item(date_str: str, item_id: str):
    """Delete a todo item."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    result = storage.delete_todo_item(d, item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return {"deleted": True}


# Settings / Custom exercises
@app.get("/settings")
def get_settings():
    """Get app settings including custom exercises."""
    return storage.get_settings()


@app.post("/settings/exercises/{exercise_type}")
def add_custom_exercise(exercise_type: str, exercise: dict):
    """Add a custom exercise. exercise_type is 'daily' or 'other'."""
    if exercise_type not in ["daily", "other"]:
        raise HTTPException(status_code=400, detail="exercise_type must be 'daily' or 'other'")
    return storage.add_custom_exercise(exercise_type, exercise)


@app.delete("/settings/exercises/{exercise_type}/{exercise_id}")
def remove_custom_exercise(exercise_type: str, exercise_id: str):
    """Remove a custom exercise."""
    if exercise_type not in ["daily", "other"]:
        raise HTTPException(status_code=400, detail="exercise_type must be 'daily' or 'other'")
    return storage.remove_custom_exercise(exercise_type, exercise_id)


# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
