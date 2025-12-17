"""
Storage module for GB Guitar - works with both local files and S3.
"""

import sys
from datetime import date, datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

# Add shared module to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "shared"))
from storage import get_storage

# Initialize storage
_storage = get_storage("guitar", str(Path(__file__).parent.parent.parent / "data"))


def date_to_key(d: date, folder: str) -> str:
    """Convert date to storage key."""
    return f"{folder}/{d.strftime('%Y-%m-%d')}.json"


# Practice sessions
def save_practice_session(session: dict) -> dict:
    """Save a practice session. Multiple sessions per day stored in array."""
    session_date = session.get("date")
    if isinstance(session_date, str):
        session_date = datetime.strptime(session_date, "%Y-%m-%d").date()

    key = date_to_key(session_date, "practice-log")
    existing = _storage.read_json(key) or []

    session_copy = session.copy()
    session_copy["date"] = session_date.isoformat()
    session_copy["created_at"] = datetime.now().isoformat()
    existing.append(session_copy)

    _storage.write_json(key, existing)
    return session_copy


def get_practice_sessions(d: date) -> list[dict]:
    """Get all practice sessions for a date."""
    key = date_to_key(d, "practice-log")
    return _storage.read_json(key) or []


def get_all_practice_sessions(limit: int = 30) -> list[dict]:
    """Get all practice sessions, flattened and sorted by date descending."""
    keys = _storage.list_keys("practice-log/", ".json")
    keys = sorted(keys, reverse=True)[:limit]

    sessions = []
    for key in keys:
        day_sessions = _storage.read_json(key) or []
        sessions.extend(day_sessions)
    return sessions


def get_all_practice_dates() -> list[date]:
    """Get all dates that have practice sessions."""
    keys = _storage.list_keys("practice-log/", ".json")
    dates = []
    for key in keys:
        filename = key.split("/")[-1]
        date_str = filename.replace(".json", "")
        try:
            dates.append(datetime.strptime(date_str, "%Y-%m-%d").date())
        except ValueError:
            continue
    return sorted(dates, reverse=True)


# Songs
def load_songs() -> list[dict]:
    """Load all songs from file."""
    return _storage.read_json("songs.json") or []


def save_songs(songs: list[dict]):
    """Save all songs to file."""
    _storage.write_json("songs.json", songs)


def add_song(song: dict) -> dict:
    """Add a new song."""
    songs = load_songs()

    if not song.get("id"):
        song["id"] = str(uuid4())

    song["added_at"] = datetime.now().isoformat()
    song["updated_at"] = datetime.now().isoformat()
    songs.append(song)
    save_songs(songs)
    return song


def update_song(song_id: str, updates: dict) -> Optional[dict]:
    """Update an existing song."""
    songs = load_songs()
    for i, song in enumerate(songs):
        if song.get("id") == song_id:
            for key, value in updates.items():
                if value is not None:
                    song[key] = value
            song["updated_at"] = datetime.now().isoformat()
            songs[i] = song
            save_songs(songs)
            return song
    return None


def delete_song(song_id: str) -> bool:
    """Delete a song by ID."""
    songs = load_songs()
    initial_count = len(songs)
    songs = [s for s in songs if s.get("id") != song_id]
    if len(songs) < initial_count:
        save_songs(songs)
        return True
    return False


def get_song(song_id: str) -> Optional[dict]:
    """Get a song by ID."""
    songs = load_songs()
    for song in songs:
        if song.get("id") == song_id:
            return song
    return None


# Skills
def load_skills() -> dict:
    """Load skills checklist."""
    skills = _storage.read_json("skills.json")
    if skills:
        return skills
    return {
        "chords": {
            "open_chords": False,
            "barre_chords": False,
            "power_chords": False,
            "seventh_chords": False,
            "advanced_shapes": False
        },
        "techniques": {
            "chord_transitions": False,
            "strumming_patterns": False,
            "fingerpicking_basics": False,
            "hammer_ons_pull_offs": False,
            "bends": False,
            "slides": False
        },
        "theory": {
            "fretboard_notes": False,
            "major_scale": False,
            "pentatonic_scale": False,
            "reading_chord_charts": False,
            "understanding_keys": False
        }
    }


def save_skills(skills: dict) -> dict:
    """Save skills checklist."""
    skills["updated_at"] = datetime.now().isoformat()
    _storage.write_json("skills.json", skills)
    return skills


# Daily guitar entries (tuning, etc.)
def get_daily_guitar_entry(d: date) -> Optional[dict]:
    """Get daily guitar entry for a date."""
    key = date_to_key(d, "daily")
    return _storage.read_json(key)


def save_daily_guitar_entry(entry: dict) -> dict:
    """Save a daily guitar entry."""
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["updated_at"] = datetime.now().isoformat()

    key = date_to_key(entry_date, "daily")
    _storage.write_json(key, entry_copy)
    return entry_copy


def get_days_since_last_tuning() -> dict:
    """Get days since last tuning for each guitar."""
    today = date.today()

    result = {
        "acoustic": None,
        "electric": None,
        "bass": None
    }

    keys = _storage.list_keys("daily/", ".json")
    keys = sorted(keys, reverse=True)

    for key in keys:
        filename = key.split("/")[-1]
        date_str = filename.replace(".json", "")
        try:
            file_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            continue

        entry = _storage.read_json(key)
        if not entry:
            continue

        if result["acoustic"] is None and entry.get("tuned_acoustic"):
            result["acoustic"] = (today - file_date).days
        if result["electric"] is None and entry.get("tuned_electric"):
            result["electric"] = (today - file_date).days
        if result["bass"] is None and entry.get("tuned_bass"):
            result["bass"] = (today - file_date).days

        if all(v is not None for v in result.values()):
            break

    return result
