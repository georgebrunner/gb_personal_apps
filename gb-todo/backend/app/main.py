from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

from .models import TodoItem, TodoUpdate, STORES
from . import storage

app = FastAPI(
    title="GB Todo API",
    description="Personal todo tracking API",
    version="1.0.0"
)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GB Todo API", "status": "running"}


# Stores
@app.get("/stores")
def list_stores():
    """List all available stores for shopping lists."""
    return STORES


# Todos
@app.get("/todos")
def list_todos(completed: Optional[bool] = None, category: Optional[str] = None, list_type: Optional[str] = None, store: Optional[str] = None):
    """List all todos, optionally filtered."""
    todos = storage.load_todos()
    if completed is not None:
        todos = [t for t in todos if t.get("completed") == completed]
    if category:
        todos = [t for t in todos if t.get("category") == category]
    if list_type:
        todos = [t for t in todos if t.get("list_type", "todo") == list_type]
    if store:
        todos = [t for t in todos if t.get("store") == store]
    return todos


@app.get("/todos/{todo_id}")
def get_todo(todo_id: str):
    """Get a single todo by ID."""
    todo = storage.get_todo(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.post("/todos")
def add_todo(todo: TodoItem):
    """Add a new todo."""
    todo_dict = todo.model_dump()
    saved = storage.add_todo(todo_dict)
    return saved


@app.put("/todos/{todo_id}")
def update_todo(todo_id: str, updates: TodoUpdate):
    """Update an existing todo."""
    updates_dict = updates.model_dump(exclude_unset=True)
    updated = storage.update_todo(todo_id, updates_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated


@app.patch("/todos/{todo_id}/toggle")
def toggle_todo(todo_id: str):
    """Toggle a todo's completed status."""
    toggled = storage.toggle_todo(todo_id)
    if not toggled:
        raise HTTPException(status_code=404, detail="Todo not found")
    return toggled


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    """Delete a todo."""
    success = storage.delete_todo(todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted"}


# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
