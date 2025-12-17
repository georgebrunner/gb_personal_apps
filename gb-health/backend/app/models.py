from pydantic import BaseModel
from typing import Optional
from datetime import date


class DailyEntry(BaseModel):
    date: date
    weight: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    glucose: Optional[int] = None
    steps: Optional[int] = None
    sleep_hours: Optional[float] = None
    water_glasses: Optional[int] = None  # 0-6 glasses
    alcohol: Optional[bool] = None
    alcohol_drinks: Optional[int] = None  # 1-8 drinks
    alcohol_when: Optional[str] = None  # "today" or "yesterday"
    exercise: Optional[str] = None  # Legacy single exercise
    exercises: Optional[list[str]] = None  # New: multiple exercises per day
    supplements: Optional[list[str]] = None
    notes: Optional[str] = None
    # Daily exercises checkboxes
    daily_exercises: Optional[list[str]] = None  # e.g., ["dumbbell_curls", "balance_left", "balance_right"]
    # Food tracking
    coffee: Optional[bool] = None
    oatmeal: Optional[bool] = None
    carrots: Optional[int] = None  # 0-6 carrots
    food_log: Optional[str] = None  # Free-form food journal
    # Hygiene tracking
    shower: Optional[bool] = None
    shave: Optional[bool] = None
    brush_teeth: Optional[bool] = None
    floss: Optional[bool] = None


class ExerciseEntry(BaseModel):
    date: date
    exercise_type: str  # Run, Walk, Weights, etc.
    distance_miles: Optional[float] = None
    duration_minutes: Optional[int] = None
    pace_per_mile: Optional[str] = None  # Calculated
    notes: Optional[str] = None


class WeeklySummary(BaseModel):
    week_start: date
    week_end: date
    avg_weight: Optional[float] = None
    total_steps: Optional[int] = None
    exercise_count: Optional[int] = None
    avg_sleep: Optional[float] = None
    avg_stress: Optional[float] = None
    goals: Optional[str] = None
    reflections: Optional[str] = None


class TodoItem(BaseModel):
    id: str
    text: str
    completed: bool = False
    created_at: str
    completed_at: Optional[str] = None


class TodoList(BaseModel):
    date: date
    items: list[TodoItem] = []
