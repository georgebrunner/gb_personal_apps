from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .models import ProspectCreate, ChecklistUpdate
from . import storage

app = FastAPI(title="GB Sales Close Checklist API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GB Sales Close Checklist API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/prospects")
def get_prospects():
    """Get all prospects."""
    return storage.get_all_prospects()


@app.get("/prospects/{prospect_id}")
def get_prospect(prospect_id: str):
    """Get a single prospect."""
    prospect = storage.get_prospect(prospect_id)
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return prospect


@app.post("/prospects")
def create_prospect(prospect: ProspectCreate):
    """Create a new prospect."""
    vertical = prospect.vertical.value if prospect.vertical else None
    return storage.create_prospect(prospect.name, vertical, prospect.notes)


@app.patch("/prospects/{prospect_id}")
def update_prospect(prospect_id: str, updates: dict):
    """Update a prospect's basic info."""
    prospect = storage.update_prospect(prospect_id, updates)
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return prospect


@app.patch("/prospects/{prospect_id}/checklist")
def update_checklist(prospect_id: str, update: ChecklistUpdate):
    """Update a checklist item for a prospect."""
    prospect = storage.update_checklist_item(
        prospect_id,
        update.item.value,
        update.completed,
        update.notes
    )
    if not prospect:
        raise HTTPException(status_code=404, detail="Prospect not found")
    return prospect


@app.delete("/prospects/{prospect_id}")
def delete_prospect(prospect_id: str):
    """Delete a prospect."""
    if not storage.delete_prospect(prospect_id):
        raise HTTPException(status_code=404, detail="Prospect not found")
    return {"message": "Prospect deleted"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
