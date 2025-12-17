"""
Storage module for GB Health - works with both local files and S3.
"""

import sys
from datetime import date, datetime
from pathlib import Path
from typing import Optional

# Add shared module to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "shared"))
from storage import get_storage

# Initialize storage - automatically uses S3 in Lambda, local files otherwise
_storage = get_storage("health", str(Path(__file__).parent.parent.parent / "data"))


def date_to_key(d: date, folder: str) -> str:
    """Convert date to storage key."""
    return f"{folder}/{d.strftime('%Y-%m-%d')}.json"


# Daily entries
def save_daily_entry(entry: dict) -> dict:
    """Save a daily entry."""
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["updated_at"] = datetime.now().isoformat()

    key = date_to_key(entry_date, "daily")
    _storage.write_json(key, entry_copy)
    return entry_copy


def get_daily_entry(d: date) -> Optional[dict]:
    """Get a daily entry by date."""
    key = date_to_key(d, "daily")
    return _storage.read_json(key)


def get_all_daily_entries(limit: int = 30) -> list[dict]:
    """Get all daily entries, sorted by date descending."""
    keys = _storage.list_keys("daily/", ".json")
    keys = sorted(keys, reverse=True)[:limit]

    entries = []
    for key in keys:
        data = _storage.read_json(key)
        if data:
            entries.append(data)
    return entries


# Exercise entries
def save_exercise_entry(entry: dict) -> dict:
    """Save an exercise entry. Multiple exercises per day stored in array."""
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    key = date_to_key(entry_date, "exercises")
    existing = _storage.read_json(key) or []

    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["created_at"] = datetime.now().isoformat()
    existing.append(entry_copy)

    _storage.write_json(key, existing)
    return entry_copy


def get_exercise_entries(d: date) -> list[dict]:
    """Get all exercise entries for a date."""
    key = date_to_key(d, "exercises")
    return _storage.read_json(key) or []


def get_all_exercise_entries(limit: int = 30) -> list[dict]:
    """Get all exercise entries, flattened and sorted by date descending."""
    keys = _storage.list_keys("exercises/", ".json")
    keys = sorted(keys, reverse=True)[:limit]

    entries = []
    for key in keys:
        day_entries = _storage.read_json(key) or []
        entries.extend(day_entries)
    return entries


# Todo list functions
def get_todos(d: date) -> Optional[dict]:
    """Get todo list for a date."""
    key = date_to_key(d, "todos")
    return _storage.read_json(key)


def save_todos(d: date, todo_list: dict) -> dict:
    """Save a complete todo list for a date."""
    key = date_to_key(d, "todos")
    todo_list["date"] = d.isoformat()
    todo_list["updated_at"] = datetime.now().isoformat()
    _storage.write_json(key, todo_list)
    return todo_list


def add_todo_item(d: date, item: dict) -> dict:
    """Add a single todo item to a date's list."""
    key = date_to_key(d, "todos")
    todo_list = _storage.read_json(key) or {"date": d.isoformat(), "items": []}
    todo_list["items"].append(item)
    todo_list["updated_at"] = datetime.now().isoformat()
    _storage.write_json(key, todo_list)
    return todo_list


def toggle_todo_item(d: date, item_id: str, completed: bool) -> Optional[dict]:
    """Toggle a todo item's completed status."""
    key = date_to_key(d, "todos")
    todo_list = _storage.read_json(key)
    if not todo_list:
        return None

    for item in todo_list.get("items", []):
        if item.get("id") == item_id:
            item["completed"] = completed
            item["completed_at"] = datetime.now().isoformat() if completed else None
            break
    else:
        return None

    todo_list["updated_at"] = datetime.now().isoformat()
    _storage.write_json(key, todo_list)
    return todo_list


def delete_todo_item(d: date, item_id: str) -> Optional[dict]:
    """Delete a todo item."""
    key = date_to_key(d, "todos")
    todo_list = _storage.read_json(key)
    if not todo_list:
        return None

    original_len = len(todo_list.get("items", []))
    todo_list["items"] = [item for item in todo_list.get("items", []) if item.get("id") != item_id]

    if len(todo_list["items"]) == original_len:
        return None

    todo_list["updated_at"] = datetime.now().isoformat()
    _storage.write_json(key, todo_list)
    return todo_list


# Settings functions
def get_settings() -> dict:
    """Get settings including custom exercises."""
    settings = _storage.read_json("settings.json")
    return settings or {"custom_daily_exercises": [], "custom_other_exercises": []}


def save_settings(settings: dict) -> dict:
    """Save settings."""
    settings["updated_at"] = datetime.now().isoformat()
    _storage.write_json("settings.json", settings)
    return settings


def add_custom_exercise(exercise_type: str, exercise: dict) -> dict:
    """Add a custom exercise. exercise_type is 'daily' or 'other'."""
    settings = get_settings()
    key = f"custom_{exercise_type}_exercises"
    if key not in settings:
        settings[key] = []
    settings[key].append(exercise)
    return save_settings(settings)


def remove_custom_exercise(exercise_type: str, exercise_id: str) -> dict:
    """Remove a custom exercise by id."""
    settings = get_settings()
    key = f"custom_{exercise_type}_exercises"
    if key in settings:
        settings[key] = [e for e in settings[key] if e.get("id") != exercise_id]
    return save_settings(settings)
