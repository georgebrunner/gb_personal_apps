import json
import os
from datetime import date, datetime
from pathlib import Path
from typing import Optional

# Base data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DAILY_DIR = DATA_DIR / "daily"
EXERCISES_DIR = DATA_DIR / "exercises"
WEEKLY_DIR = DATA_DIR / "weekly"
TODOS_DIR = DATA_DIR / "todos"


def ensure_dirs():
    """Ensure all data directories exist."""
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    EXERCISES_DIR.mkdir(parents=True, exist_ok=True)
    WEEKLY_DIR.mkdir(parents=True, exist_ok=True)
    TODOS_DIR.mkdir(parents=True, exist_ok=True)


def date_to_filename(d: date) -> str:
    """Convert date to filename format."""
    return d.strftime("%Y-%m-%d") + ".json"


# Daily entries
def save_daily_entry(entry: dict) -> dict:
    """Save a daily entry to JSON file."""
    ensure_dirs()
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    filename = DAILY_DIR / date_to_filename(entry_date)

    # Convert date to string for JSON
    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(entry_copy, f, indent=2)

    return entry_copy


def get_daily_entry(d: date) -> Optional[dict]:
    """Get a daily entry by date."""
    filename = DAILY_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return None


def get_all_daily_entries(limit: int = 30) -> list[dict]:
    """Get all daily entries, sorted by date descending."""
    ensure_dirs()
    entries = []
    for file in sorted(DAILY_DIR.glob("*.json"), reverse=True)[:limit]:
        with open(file, "r") as f:
            entries.append(json.load(f))
    return entries


# Exercise entries
def save_exercise_entry(entry: dict) -> dict:
    """Save an exercise entry. Multiple exercises per day stored in array."""
    ensure_dirs()
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    filename = EXERCISES_DIR / date_to_filename(entry_date)

    # Load existing entries for this date
    existing = []
    if filename.exists():
        with open(filename, "r") as f:
            existing = json.load(f)

    # Add new entry with timestamp
    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["created_at"] = datetime.now().isoformat()
    existing.append(entry_copy)

    with open(filename, "w") as f:
        json.dump(existing, f, indent=2)

    return entry_copy


def get_exercise_entries(d: date) -> list[dict]:
    """Get all exercise entries for a date."""
    filename = EXERCISES_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return []


def get_all_exercise_entries(limit: int = 30) -> list[dict]:
    """Get all exercise entries, flattened and sorted by date descending."""
    ensure_dirs()
    entries = []
    for file in sorted(EXERCISES_DIR.glob("*.json"), reverse=True)[:limit]:
        with open(file, "r") as f:
            day_entries = json.load(f)
            entries.extend(day_entries)
    return entries


# Todo list functions
def get_todos(d: date) -> Optional[dict]:
    """Get todo list for a date."""
    ensure_dirs()
    filename = TODOS_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return None


def save_todos(d: date, todo_list: dict) -> dict:
    """Save a complete todo list for a date."""
    ensure_dirs()
    filename = TODOS_DIR / date_to_filename(d)

    todo_list["date"] = d.isoformat()
    todo_list["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(todo_list, f, indent=2)

    return todo_list


def add_todo_item(d: date, item: dict) -> dict:
    """Add a single todo item to a date's list."""
    ensure_dirs()
    filename = TODOS_DIR / date_to_filename(d)

    # Load existing or create new
    if filename.exists():
        with open(filename, "r") as f:
            todo_list = json.load(f)
    else:
        todo_list = {"date": d.isoformat(), "items": []}

    todo_list["items"].append(item)
    todo_list["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(todo_list, f, indent=2)

    return todo_list


def toggle_todo_item(d: date, item_id: str, completed: bool) -> Optional[dict]:
    """Toggle a todo item's completed status."""
    ensure_dirs()
    filename = TODOS_DIR / date_to_filename(d)

    if not filename.exists():
        return None

    with open(filename, "r") as f:
        todo_list = json.load(f)

    # Find and update the item
    for item in todo_list.get("items", []):
        if item.get("id") == item_id:
            item["completed"] = completed
            if completed:
                item["completed_at"] = datetime.now().isoformat()
            else:
                item["completed_at"] = None
            break
    else:
        return None

    todo_list["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(todo_list, f, indent=2)

    return todo_list


def delete_todo_item(d: date, item_id: str) -> Optional[dict]:
    """Delete a todo item."""
    ensure_dirs()
    filename = TODOS_DIR / date_to_filename(d)

    if not filename.exists():
        return None

    with open(filename, "r") as f:
        todo_list = json.load(f)

    # Find and remove the item
    original_len = len(todo_list.get("items", []))
    todo_list["items"] = [item for item in todo_list.get("items", []) if item.get("id") != item_id]

    if len(todo_list["items"]) == original_len:
        return None  # Item not found

    todo_list["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(todo_list, f, indent=2)

    return todo_list
