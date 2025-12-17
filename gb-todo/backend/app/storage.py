"""
Storage module for GB Todo - works with both local files and S3.
"""

import sys
from datetime import datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

# Add shared module to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "shared"))
from storage import get_storage

# Initialize storage
_storage = get_storage("todo", str(Path(__file__).parent.parent.parent / "data"))


def load_todos() -> list[dict]:
    """Load all todos from file."""
    return _storage.read_json("todos/todos.json") or []


def save_todos(todos: list[dict]):
    """Save all todos to file."""
    _storage.write_json("todos/todos.json", todos)


def add_todo(todo: dict) -> dict:
    """Add a new todo."""
    todos = load_todos()

    if not todo.get("id"):
        todo["id"] = str(uuid4())

    todo["created_at"] = datetime.now().isoformat()
    todo["updated_at"] = datetime.now().isoformat()

    if todo.get("due_date") and hasattr(todo["due_date"], "isoformat"):
        todo["due_date"] = todo["due_date"].isoformat()

    todos.append(todo)
    save_todos(todos)
    return todo


def update_todo(todo_id: str, updates: dict) -> Optional[dict]:
    """Update an existing todo."""
    todos = load_todos()
    for i, todo in enumerate(todos):
        if todo.get("id") == todo_id:
            for key, value in updates.items():
                if value is not None:
                    if key == "due_date" and hasattr(value, "isoformat"):
                        value = value.isoformat()
                    todo[key] = value
            todo["updated_at"] = datetime.now().isoformat()
            todos[i] = todo
            save_todos(todos)
            return todo
    return None


def delete_todo(todo_id: str) -> bool:
    """Delete a todo by ID."""
    todos = load_todos()
    initial_count = len(todos)
    todos = [t for t in todos if t.get("id") != todo_id]
    if len(todos) < initial_count:
        save_todos(todos)
        return True
    return False


def get_todo(todo_id: str) -> Optional[dict]:
    """Get a todo by ID."""
    todos = load_todos()
    for todo in todos:
        if todo.get("id") == todo_id:
            return todo
    return None


def toggle_todo(todo_id: str) -> Optional[dict]:
    """Toggle a todo's completed status."""
    todos = load_todos()
    for i, todo in enumerate(todos):
        if todo.get("id") == todo_id:
            todo["completed"] = not todo.get("completed", False)
            todo["updated_at"] = datetime.now().isoformat()
            todos[i] = todo
            save_todos(todos)
            return todo
    return None
