from pydantic import BaseModel
from typing import Optional
from datetime import date
from uuid import UUID, uuid4


class PracticeSession(BaseModel):
    date: date
    duration_minutes: int
    focus_area: str  # Chords, Scales, Songs, Techniques, Theory, Other
    what_worked_on: str
    difficulty: Optional[int] = None  # 1-5
    notes: Optional[str] = None


class DailyGuitarEntry(BaseModel):
    date: date
    tuned_acoustic: Optional[bool] = None
    tuned_electric: Optional[bool] = None
    tuned_bass: Optional[bool] = None


class Song(BaseModel):
    id: Optional[str] = None
    name: str
    artist: str
    difficulty: str  # Easy, Medium, Hard
    status: str  # Want to Learn, Learning, Can Play, Mastered
    progress: int = 0  # 0-100
    notes: Optional[str] = None
    resource_path: Optional[str] = None

    def generate_id(self):
        if not self.id:
            self.id = str(uuid4())
        return self


class SongUpdate(BaseModel):
    name: Optional[str] = None
    artist: Optional[str] = None
    difficulty: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    notes: Optional[str] = None
    resource_path: Optional[str] = None


class Skills(BaseModel):
    chords: dict = {
        "open_chords": False,
        "barre_chords": False,
        "power_chords": False,
        "seventh_chords": False,
        "advanced_shapes": False
    }
    techniques: dict = {
        "chord_transitions": False,
        "strumming_patterns": False,
        "fingerpicking_basics": False,
        "hammer_ons_pull_offs": False,
        "bends": False,
        "slides": False
    }
    theory: dict = {
        "fretboard_notes": False,
        "major_scale": False,
        "pentatonic_scale": False,
        "reading_chord_charts": False,
        "understanding_keys": False
    }


class Stats(BaseModel):
    current_streak: int = 0
    longest_streak: int = 0
    total_practice_minutes: int = 0
    practice_days_this_week: int = 0
    practice_days_this_month: int = 0
    minutes_this_week: int = 0
    minutes_this_month: int = 0
