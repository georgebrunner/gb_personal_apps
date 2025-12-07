from pydantic import BaseModel
from typing import Optional
from datetime import date


class FoodEntry(BaseModel):
    """A single food entry in the daily log."""
    id: Optional[str] = None
    name: str
    meal_type: str = "snack"  # breakfast, lunch, dinner, snack
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    notes: Optional[str] = None
    recipe_id: Optional[str] = None  # Link to a recipe if used
    created_at: Optional[str] = None


class DailyFoodLog(BaseModel):
    """Daily food log containing all entries for a day."""
    date: str
    entries: list[FoodEntry] = []
    notes: Optional[str] = None


class Recipe(BaseModel):
    """A saved recipe."""
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    ingredients: list[str] = []
    instructions: Optional[str] = None
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    calories_per_serving: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    tags: list[str] = []  # e.g., "quick", "healthy", "comfort food"
    image: Optional[str] = None  # Base64 encoded image or URL
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class FavoriteFood(BaseModel):
    """A frequently eaten food for quick selection."""
    id: Optional[str] = None
    name: str
    default_meal_type: str = "snack"
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    use_count: int = 0  # Track how often it's used
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class RecipeUpdate(BaseModel):
    """Partial update for a recipe."""
    name: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[list[str]] = None
    instructions: Optional[str] = None
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    calories_per_serving: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
    tags: Optional[list[str]] = None
    image: Optional[str] = None


class FavoriteFoodUpdate(BaseModel):
    """Partial update for a favorite food."""
    name: Optional[str] = None
    default_meal_type: Optional[str] = None
    calories: Optional[int] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None
