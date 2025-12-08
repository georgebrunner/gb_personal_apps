from pathlib import Path
import json
from datetime import datetime
import uuid
from typing import List, Optional
from .models import ChecklistItem

DATA_DIR = Path(__file__).parent.parent.parent / "data"
PROSPECTS_FILE = DATA_DIR / "prospects.json"


def ensure_dirs():
    """Create directories if they don't exist."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _create_default_checklist() -> List[dict]:
    """Create a default checklist with all items unchecked."""
    return [
        {"item": item.value, "completed": False, "completed_at": None, "notes": None}
        for item in ChecklistItem
    ]


def _load_prospects() -> List[dict]:
    """Load all prospects from file."""
    ensure_dirs()
    if PROSPECTS_FILE.exists():
        with open(PROSPECTS_FILE, "r") as f:
            return json.load(f)
    return []


def _save_prospects(prospects: List[dict]):
    """Save all prospects to file."""
    ensure_dirs()
    with open(PROSPECTS_FILE, "w") as f:
        json.dump(prospects, f, indent=2)


def get_all_prospects() -> List[dict]:
    """Get all prospects."""
    return _load_prospects()


def get_prospect(prospect_id: str) -> Optional[dict]:
    """Get a single prospect by ID."""
    prospects = _load_prospects()
    for p in prospects:
        if p["id"] == prospect_id:
            return p
    return None


def create_prospect(name: str, vertical: Optional[str] = None, notes: Optional[str] = None) -> dict:
    """Create a new prospect with default checklist."""
    prospects = _load_prospects()

    new_prospect = {
        "id": str(uuid.uuid4()),
        "name": name,
        "vertical": vertical,
        "checklist": _create_default_checklist(),
        "status": "active",
        "notes": notes,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    prospects.append(new_prospect)
    _save_prospects(prospects)
    return new_prospect


def update_prospect(prospect_id: str, updates: dict) -> Optional[dict]:
    """Update a prospect's basic info."""
    prospects = _load_prospects()

    for i, p in enumerate(prospects):
        if p["id"] == prospect_id:
            prospects[i].update(updates)
            prospects[i]["updated_at"] = datetime.now().isoformat()
            _save_prospects(prospects)
            return prospects[i]
    return None


def update_checklist_item(prospect_id: str, item: str, completed: bool, notes: Optional[str] = None) -> Optional[dict]:
    """Update a specific checklist item for a prospect."""
    prospects = _load_prospects()

    for i, p in enumerate(prospects):
        if p["id"] == prospect_id:
            for j, checklist_item in enumerate(p["checklist"]):
                if checklist_item["item"] == item:
                    prospects[i]["checklist"][j]["completed"] = completed
                    prospects[i]["checklist"][j]["completed_at"] = datetime.now().isoformat() if completed else None
                    if notes is not None:
                        prospects[i]["checklist"][j]["notes"] = notes
                    prospects[i]["updated_at"] = datetime.now().isoformat()
                    _save_prospects(prospects)
                    return prospects[i]
    return None


def delete_prospect(prospect_id: str) -> bool:
    """Delete a prospect."""
    prospects = _load_prospects()
    original_length = len(prospects)
    prospects = [p for p in prospects if p["id"] != prospect_id]

    if len(prospects) < original_length:
        _save_prospects(prospects)
        return True
    return False
