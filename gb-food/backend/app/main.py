from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime
from typing import Optional

from .models import (
    FoodEntry, DailyFoodLog, Recipe, RecipeUpdate,
    FavoriteFood, FavoriteFoodUpdate
)
from . import storage

app = FastAPI(
    title="GB Food API",
    description="Personal food tracking and recipes API",
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
    return {"message": "GB Food API", "status": "running"}


# Daily food log endpoints
@app.get("/daily/{date_str}")
def get_daily_log(date_str: str):
    """Get the food log for a specific date."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    log = storage.get_daily_log(d)
    if not log:
        return {"date": date_str, "entries": []}
    return log


@app.get("/daily")
def list_daily_logs(limit: int = 30):
    """List recent daily food logs."""
    return storage.get_all_daily_logs(limit)


@app.post("/daily/{date_str}")
def save_daily_log(date_str: str, log: DailyFoodLog):
    """Save or update a daily food log."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    log_dict = log.model_dump()
    log_dict["date"] = date_str
    saved = storage.save_daily_log(log_dict)
    return saved


@app.post("/daily/{date_str}/entry")
def add_food_entry(date_str: str, entry: FoodEntry):
    """Add a food entry to a date's log."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    # If using a favorite, increment its use count
    if entry.recipe_id:
        storage.increment_favorite_use(entry.recipe_id)

    entry_dict = entry.model_dump()
    saved = storage.add_food_entry(d, entry_dict)
    return saved


@app.put("/daily/{date_str}/entry/{entry_id}")
def update_food_entry(date_str: str, entry_id: str, entry: FoodEntry):
    """Update a food entry."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    entry_dict = entry.model_dump()
    updated = storage.update_food_entry(d, entry_id, entry_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Entry not found")
    return updated


@app.delete("/daily/{date_str}/entry/{entry_id}")
def delete_food_entry(date_str: str, entry_id: str):
    """Delete a food entry."""
    try:
        d = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    if not storage.delete_food_entry(d, entry_id):
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"deleted": True}


# Recipe endpoints
@app.get("/recipes")
def list_recipes(tag: Optional[str] = None):
    """List all recipes, optionally filtered by tag."""
    recipes = storage.load_recipes()
    if tag:
        recipes = [r for r in recipes if tag.lower() in [t.lower() for t in r.get("tags", [])]]
    return recipes


@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: str):
    """Get a recipe by ID."""
    recipe = storage.get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@app.post("/recipes")
def create_recipe(recipe: Recipe):
    """Create a new recipe."""
    recipe_dict = recipe.model_dump()
    saved = storage.add_recipe(recipe_dict)
    return saved


@app.put("/recipes/{recipe_id}")
def update_recipe(recipe_id: str, updates: RecipeUpdate):
    """Update a recipe."""
    updates_dict = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = storage.update_recipe(recipe_id, updates_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return updated


@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: str):
    """Delete a recipe."""
    if not storage.delete_recipe(recipe_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"deleted": True}


# Favorite foods endpoints
@app.get("/favorites")
def list_favorites(top: Optional[int] = None):
    """List favorites, optionally just the top N most used."""
    if top:
        return storage.get_top_favorites(top)
    return storage.load_favorites()


@app.get("/favorites/{favorite_id}")
def get_favorite(favorite_id: str):
    """Get a favorite by ID."""
    favorite = storage.get_favorite(favorite_id)
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return favorite


@app.post("/favorites")
def create_favorite(favorite: FavoriteFood):
    """Create a new favorite food."""
    favorite_dict = favorite.model_dump()
    saved = storage.add_favorite(favorite_dict)
    return saved


@app.put("/favorites/{favorite_id}")
def update_favorite(favorite_id: str, updates: FavoriteFoodUpdate):
    """Update a favorite food."""
    updates_dict = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = storage.update_favorite(favorite_id, updates_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return updated


@app.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: str):
    """Delete a favorite food."""
    if not storage.delete_favorite(favorite_id):
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"deleted": True}


@app.post("/favorites/{favorite_id}/use")
def use_favorite(favorite_id: str):
    """Increment the use count for a favorite (called when adding to log)."""
    updated = storage.increment_favorite_use(favorite_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return updated


# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
