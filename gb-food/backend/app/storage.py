import json
from datetime import date, datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

# Base data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"
DAILY_DIR = DATA_DIR / "daily"
RECIPES_FILE = DATA_DIR / "recipes.json"
FAVORITES_FILE = DATA_DIR / "favorites.json"


def ensure_dirs():
    """Ensure all data directories exist."""
    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def date_to_filename(d: date) -> str:
    """Convert date to filename format."""
    return d.strftime("%Y-%m-%d") + ".json"


# Daily food log
def get_daily_log(d: date) -> Optional[dict]:
    """Get the daily food log for a date."""
    ensure_dirs()
    filename = DAILY_DIR / date_to_filename(d)
    if filename.exists():
        with open(filename, "r") as f:
            return json.load(f)
    return None


def save_daily_log(log: dict) -> dict:
    """Save a daily food log."""
    ensure_dirs()
    log_date = log.get("date")
    if isinstance(log_date, str):
        log_date = datetime.strptime(log_date, "%Y-%m-%d").date()

    filename = DAILY_DIR / date_to_filename(log_date)

    log_copy = log.copy()
    log_copy["date"] = log_date.isoformat()
    log_copy["updated_at"] = datetime.now().isoformat()

    with open(filename, "w") as f:
        json.dump(log_copy, f, indent=2)

    return log_copy


def add_food_entry(d: date, entry: dict) -> dict:
    """Add a food entry to a day's log."""
    ensure_dirs()
    log = get_daily_log(d) or {"date": d.isoformat(), "entries": []}

    # Generate ID if not present
    if not entry.get("id"):
        entry["id"] = str(uuid4())

    entry["created_at"] = datetime.now().isoformat()
    log["entries"].append(entry)
    save_daily_log(log)
    return entry


def update_food_entry(d: date, entry_id: str, updates: dict) -> Optional[dict]:
    """Update a food entry."""
    log = get_daily_log(d)
    if not log:
        return None

    for i, entry in enumerate(log.get("entries", [])):
        if entry.get("id") == entry_id:
            for key, value in updates.items():
                if value is not None:
                    entry[key] = value
            entry["updated_at"] = datetime.now().isoformat()
            log["entries"][i] = entry
            save_daily_log(log)
            return entry
    return None


def delete_food_entry(d: date, entry_id: str) -> bool:
    """Delete a food entry."""
    log = get_daily_log(d)
    if not log:
        return False

    entries = log.get("entries", [])
    initial_count = len(entries)
    entries = [e for e in entries if e.get("id") != entry_id]

    if len(entries) < initial_count:
        log["entries"] = entries
        save_daily_log(log)
        return True
    return False


def get_all_daily_logs(limit: int = 30) -> list[dict]:
    """Get all daily logs, sorted by date descending."""
    ensure_dirs()
    logs = []
    for file in sorted(DAILY_DIR.glob("*.json"), reverse=True)[:limit]:
        with open(file, "r") as f:
            logs.append(json.load(f))
    return logs


# Recipes
def load_recipes() -> list[dict]:
    """Load all recipes."""
    ensure_dirs()
    if RECIPES_FILE.exists():
        with open(RECIPES_FILE, "r") as f:
            return json.load(f)
    return []


def save_recipes(recipes: list[dict]):
    """Save all recipes."""
    ensure_dirs()
    with open(RECIPES_FILE, "w") as f:
        json.dump(recipes, f, indent=2)


def add_recipe(recipe: dict) -> dict:
    """Add a new recipe."""
    recipes = load_recipes()

    if not recipe.get("id"):
        recipe["id"] = str(uuid4())

    recipe["created_at"] = datetime.now().isoformat()
    recipe["updated_at"] = datetime.now().isoformat()
    recipes.append(recipe)
    save_recipes(recipes)
    return recipe


def get_recipe(recipe_id: str) -> Optional[dict]:
    """Get a recipe by ID."""
    recipes = load_recipes()
    for recipe in recipes:
        if recipe.get("id") == recipe_id:
            return recipe
    return None


def update_recipe(recipe_id: str, updates: dict) -> Optional[dict]:
    """Update a recipe."""
    recipes = load_recipes()
    for i, recipe in enumerate(recipes):
        if recipe.get("id") == recipe_id:
            for key, value in updates.items():
                if value is not None:
                    recipe[key] = value
            recipe["updated_at"] = datetime.now().isoformat()
            recipes[i] = recipe
            save_recipes(recipes)
            return recipe
    return None


def delete_recipe(recipe_id: str) -> bool:
    """Delete a recipe."""
    recipes = load_recipes()
    initial_count = len(recipes)
    recipes = [r for r in recipes if r.get("id") != recipe_id]
    if len(recipes) < initial_count:
        save_recipes(recipes)
        return True
    return False


# Favorites
def load_favorites() -> list[dict]:
    """Load all favorite foods."""
    ensure_dirs()
    if FAVORITES_FILE.exists():
        with open(FAVORITES_FILE, "r") as f:
            return json.load(f)
    return []


def save_favorites(favorites: list[dict]):
    """Save all favorites."""
    ensure_dirs()
    with open(FAVORITES_FILE, "w") as f:
        json.dump(favorites, f, indent=2)


def add_favorite(favorite: dict) -> dict:
    """Add a new favorite food."""
    favorites = load_favorites()

    if not favorite.get("id"):
        favorite["id"] = str(uuid4())

    favorite["use_count"] = 0
    favorite["created_at"] = datetime.now().isoformat()
    favorite["updated_at"] = datetime.now().isoformat()
    favorites.append(favorite)
    save_favorites(favorites)
    return favorite


def get_favorite(favorite_id: str) -> Optional[dict]:
    """Get a favorite by ID."""
    favorites = load_favorites()
    for favorite in favorites:
        if favorite.get("id") == favorite_id:
            return favorite
    return None


def update_favorite(favorite_id: str, updates: dict) -> Optional[dict]:
    """Update a favorite food."""
    favorites = load_favorites()
    for i, favorite in enumerate(favorites):
        if favorite.get("id") == favorite_id:
            for key, value in updates.items():
                if value is not None:
                    favorite[key] = value
            favorite["updated_at"] = datetime.now().isoformat()
            favorites[i] = favorite
            save_favorites(favorites)
            return favorite
    return None


def delete_favorite(favorite_id: str) -> bool:
    """Delete a favorite food."""
    favorites = load_favorites()
    initial_count = len(favorites)
    favorites = [f for f in favorites if f.get("id") != favorite_id]
    if len(favorites) < initial_count:
        save_favorites(favorites)
        return True
    return False


def increment_favorite_use(favorite_id: str) -> Optional[dict]:
    """Increment the use count for a favorite."""
    favorites = load_favorites()
    for i, favorite in enumerate(favorites):
        if favorite.get("id") == favorite_id:
            favorite["use_count"] = favorite.get("use_count", 0) + 1
            favorite["updated_at"] = datetime.now().isoformat()
            favorites[i] = favorite
            save_favorites(favorites)
            return favorite
    return None


def get_top_favorites(limit: int = 10) -> list[dict]:
    """Get the most used favorites."""
    favorites = load_favorites()
    return sorted(favorites, key=lambda f: f.get("use_count", 0), reverse=True)[:limit]
