from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime
from typing import Optional

from .models import PracticeSession, Song, SongUpdate, Skills, DailyGuitarEntry
from . import storage, stats

app = FastAPI(
    title="GB Guitar API",
    description="Personal guitar practice tracking API",
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
    return {"message": "GB Guitar API", "status": "running"}


# Practice sessions
@app.post("/practice")
def log_practice(session: PracticeSession):
    """Log a practice session."""
    session_dict = session.model_dump()
    saved = storage.save_practice_session(session_dict)
    return saved


@app.get("/practice")
def list_practice_sessions(limit: int = 30):
    """List recent practice sessions."""
    return storage.get_all_practice_sessions(limit)


@app.get("/practice/{date_str}")
def get_practice_by_date(date_str: str):
    """Get practice sessions for a specific date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    return storage.get_practice_sessions(d)


# Stats
@app.get("/stats")
def get_stats():
    """Get practice statistics including streak."""
    return stats.get_stats()


# Songs
@app.get("/songs")
def list_songs(status: Optional[str] = None):
    """List all songs, optionally filtered by status."""
    songs = storage.load_songs()
    if status:
        songs = [s for s in songs if s.get("status") == status]
    return songs


@app.get("/songs/{song_id}")
def get_song(song_id: str):
    """Get a single song by ID."""
    song = storage.get_song(song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@app.post("/songs")
def add_song(song: Song):
    """Add a new song to the library."""
    song_dict = song.model_dump()
    saved = storage.add_song(song_dict)
    return saved


@app.put("/songs/{song_id}")
def update_song(song_id: str, updates: SongUpdate):
    """Update an existing song."""
    updates_dict = updates.model_dump(exclude_unset=True)
    updated = storage.update_song(song_id, updates_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Song not found")
    return updated


@app.delete("/songs/{song_id}")
def delete_song(song_id: str):
    """Delete a song."""
    success = storage.delete_song(song_id)
    if not success:
        raise HTTPException(status_code=404, detail="Song not found")
    return {"message": "Song deleted"}


# Skills
@app.get("/skills")
def get_skills():
    """Get skills checklist."""
    return storage.load_skills()


@app.put("/skills")
def update_skills(skills: Skills):
    """Update skills checklist."""
    skills_dict = skills.model_dump()
    saved = storage.save_skills(skills_dict)
    return saved


# Daily guitar entries (tuning, etc.)
@app.get("/daily/{date_str}")
def get_daily_entry(date_str: str):
    """Get daily guitar entry for a date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    entry = storage.get_daily_guitar_entry(d)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@app.post("/daily")
def save_daily_entry(entry: DailyGuitarEntry):
    """Save daily guitar entry."""
    entry_dict = entry.model_dump()
    saved = storage.save_daily_guitar_entry(entry_dict)
    return saved


@app.get("/tuning-stats")
def get_tuning_stats():
    """Get days since last tuning for each guitar."""
    return storage.get_days_since_last_tuning()


# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
