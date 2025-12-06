import json
from datetime import date, datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

# Base data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"
PRACTICE_DIR = DATA_DIR / "practice-log"
DAILY_DIR = DATA_DIR / "daily"
SONGS_FILE = DATA_DIR / "songs.json"
SKILLS_FILE = DATA_DIR / "skills.json"


def ensure_dirs():
    """Ensure all data directories exist."""
    PRACTICE_DIR.mkdir(parents=True, exist_ok=True)
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def date_to_filename(d: date) -> str:
    """Convert date to filename format."""
    return d.strftime("%Y-%m-%d") + ".json"


# Practice sessions
def save_practice_session(session: dict) -> dict:
    """Save a practice session. Multiple sessions per day stored in array."""
    ensure_dirs()
    session_date = session.get("date")
    if isinstance(session_date, str):
        session_date = datetime.strptime(session_date, "%Y-%m-%d").date()

    filename = PRACTICE_DIR / date_to_filename(session_date)

    # Load existing sessions for this date
    existing = []
    if filename.exists():
        with open(filename, "r") as f:
            existing = json.load(f)

    # Add new session with timestamp
    session_copy = session.copy()
    session_copy["date"] = session_date.isoformat()
    session_copy["created_at"] = datetime.now().isoformat()
    existing.append(session_copy)

    with open(filename, "w") as f:
        json.dump(existing, f, indent=2)

    return session_copy


def get_practice_sessions(d: date) -> list[dict]:
    """Get all practice sessions for a date."""
    filename = PRACTICE_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return []


def get_all_practice_sessions(limit: int = 30) -> list[dict]:
    """Get all practice sessions, flattened and sorted by date descending."""
    ensure_dirs()
    sessions = []
    for file in sorted(PRACTICE_DIR.glob("*.json"), reverse=True)[:limit]:
        with open(file, "r") as f:
            day_sessions = json.load(f)
            sessions.extend(day_sessions)
    return sessions


def get_all_practice_dates() -> list[date]:
    """Get all dates that have practice sessions."""
    ensure_dirs()
    dates = []
    for file in PRACTICE_DIR.glob("*.json"):
        date_str = file.stem  # filename without extension
        dates.append(datetime.strptime(date_str, "%Y-%m-%d").date())
    return sorted(dates, reverse=True)


# Songs
def load_songs() -> list[dict]:
    """Load all songs from file."""
    ensure_dirs()
    if SONGS_FILE.exists():
        with open(SONGS_FILE, "r") as f:
            return json.load(f)
    return []


def save_songs(songs: list[dict]):
    """Save all songs to file."""
    ensure_dirs()
    with open(SONGS_FILE, "w") as f:
        json.dump(songs, f, indent=2)


def add_song(song: dict) -> dict:
    """Add a new song."""
    songs = load_songs()

    # Generate ID if not present
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
    ensure_dirs()
    if SKILLS_FILE.exists():
        with open(SKILLS_FILE, "r") as f:
            return json.load(f)
    # Return default skills structure
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
    ensure_dirs()
    skills["updated_at"] = datetime.now().isoformat()
    with open(SKILLS_FILE, "w") as f:
        json.dump(skills, f, indent=2)
    return skills


# Daily guitar entries (tuning, etc.)
def get_daily_guitar_entry(d: date) -> Optional[dict]:
    """Get daily guitar entry for a date."""
    ensure_dirs()
    filename = DAILY_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return None


def save_daily_guitar_entry(entry: dict) -> dict:
    """Save a daily guitar entry."""
    ensure_dirs()
    entry_date = entry.get("date")
    if isinstance(entry_date, str):
        entry_date = datetime.strptime(entry_date, "%Y-%m-%d").date()

    filename = DAILY_DIR / date_to_filename(entry_date)

    entry_copy = entry.copy()
    entry_copy["date"] = entry_date.isoformat()
    entry_copy["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(entry_copy, f, indent=2)

    return entry_copy
