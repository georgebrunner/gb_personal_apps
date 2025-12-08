import { useState, useEffect } from 'react'
import {
  FoodEntry, DailyFoodLog, Recipe, FavoriteFood, MealType,
  getDailyFoodLog, addFoodEntry, deleteFoodEntry,
  getRecipes, createRecipe, deleteRecipe,
  getFavorites, createFavorite, deleteFavorite, useFavorite
} from '../api'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

type FoodTab = 'log' | 'recipes' | 'favorites'

function FoodLog() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [activeTab, setActiveTab] = useState<FoodTab>('log')
  const [dailyLog, setDailyLog] = useState<DailyFoodLog | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<FavoriteFood[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [newFoodName, setNewFoodName] = useState('')
  const [newFoodMealType, setNewFoodMealType] = useState<MealType>('snack')
  const [newFoodCalories, setNewFoodCalories] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Recipe form
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [newRecipeName, setNewRecipeName] = useState('')
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('')
  const [newRecipeInstructions, setNewRecipeInstructions] = useState('')
  const [newRecipeTags, setNewRecipeTags] = useState('')
  const [newRecipeImage, setNewRecipeImage] = useState<string | null>(null)

  // Favorite form
  const [showFavoriteForm, setShowFavoriteForm] = useState(false)
  const [newFavoriteName, setNewFavoriteName] = useState('')
  const [newFavoriteMealType, setNewFavoriteMealType] = useState<MealType>('snack')
  const [newFavoriteCalories, setNewFavoriteCalories] = useState('')

  useEffect(() => {
    loadData()
  }, [selectedDate, activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'log') {
        const log = await getDailyFoodLog(selectedDate)
        setDailyLog(log)
      } else if (activeTab === 'recipes') {
        const r = await getRecipes()
        setRecipes(r)
      } else if (activeTab === 'favorites') {
        const f = await getFavorites()
        setFavorites(f)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load favorites for quick-pick dropdown
  useEffect(() => {
    getFavorites().then(setFavorites).catch(() => {})
  }, [])

  const goToPreviousDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToToday = () => {
    setSelectedDate(today)
  }

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFoodName.trim()) return

    try {
      const entry = await addFoodEntry(selectedDate, {
        name: newFoodName.trim(),
        meal_type: newFoodMealType,
        calories: newFoodCalories ? parseInt(newFoodCalories) : undefined
      })
      setDailyLog(prev => prev ? {
        ...prev,
        entries: [...prev.entries, entry]
      } : { date: selectedDate, entries: [entry] })
      setNewFoodName('')
      setNewFoodCalories('')
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add food:', error)
    }
  }

  const handleQuickAdd = async (favorite: FavoriteFood) => {
    try {
      await useFavorite(favorite.id!)
      const entry = await addFoodEntry(selectedDate, {
        name: favorite.name,
        meal_type: favorite.default_meal_type,
        calories: favorite.calories
      })
      setDailyLog(prev => prev ? {
        ...prev,
        entries: [...prev.entries, entry]
      } : { date: selectedDate, entries: [entry] })
    } catch (error) {
      console.error('Failed to quick add:', error)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteFoodEntry(selectedDate, entryId)
      setDailyLog(prev => prev ? {
        ...prev,
        entries: prev.entries.filter(e => e.id !== entryId)
      } : null)
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setNewRecipeImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecipeName.trim()) return

    try {
      const recipe = await createRecipe({
        name: newRecipeName.trim(),
        ingredients: newRecipeIngredients.split('\n').filter(i => i.trim()),
        instructions: newRecipeInstructions.trim() || undefined,
        tags: newRecipeTags.split(',').map(t => t.trim()).filter(t => t),
        image: newRecipeImage || undefined
      })
      setRecipes([...recipes, recipe])
      setNewRecipeName('')
      setNewRecipeIngredients('')
      setNewRecipeInstructions('')
      setNewRecipeTags('')
      setNewRecipeImage(null)
      setShowRecipeForm(false)
    } catch (error) {
      console.error('Failed to add recipe:', error)
    }
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipe(recipeId)
      setRecipes(recipes.filter(r => r.id !== recipeId))
    } catch (error) {
      console.error('Failed to delete recipe:', error)
    }
  }

  const handleAddFavorite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFavoriteName.trim()) return

    try {
      const favorite = await createFavorite({
        name: newFavoriteName.trim(),
        default_meal_type: newFavoriteMealType,
        calories: newFavoriteCalories ? parseInt(newFavoriteCalories) : undefined
      })
      setFavorites([...favorites, favorite])
      setNewFavoriteName('')
      setNewFavoriteCalories('')
      setShowFavoriteForm(false)
    } catch (error) {
      console.error('Failed to add favorite:', error)
    }
  }

  const handleDeleteFavorite = async (favoriteId: string) => {
    try {
      await deleteFavorite(favoriteId)
      setFavorites(favorites.filter(f => f.id !== favoriteId))
    } catch (error) {
      console.error('Failed to delete favorite:', error)
    }
  }

  const totalCalories = dailyLog?.entries.reduce((sum, e) => sum + (e.calories || 0), 0) || 0

  const entriesByMeal = MEAL_TYPES.reduce((acc, meal) => {
    acc[meal] = dailyLog?.entries.filter(e => e.meal_type === meal) || []
    return acc
  }, {} as Record<MealType, FoodEntry[]>)

  return (
    <>
      {/* Sub-tabs for Food */}
      <div className="tabs" style={{ marginBottom: '16px' }}>
        <button
          type="button"
          className={`tab ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          Log
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes
        </button>
        <button
          type="button"
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Quick Pick
        </button>
      </div>

      {/* Food Log Tab */}
      {activeTab === 'log' && (
        <>
          {/* Date Navigation */}
          <div className="card">
            <div className="date-nav">
              <button type="button" className="date-nav-btn" onClick={goToPreviousDay}>&lt;</button>
              <div className="date-nav-center">
                <span className="date-nav-display">{formatDateDisplay(selectedDate)}</span>
                {selectedDate !== today && (
                  <button type="button" className="today-btn" onClick={goToToday}>Today</button>
                )}
                {selectedDate === today && <span className="today-badge">Today</span>}
              </div>
              <button type="button" className="date-nav-btn" onClick={goToNextDay}>&gt;</button>
            </div>
          </div>

          {/* Daily Summary */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{totalCalories}</div>
              <div className="stat-label">Calories</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dailyLog?.entries.length || 0}</div>
              <div className="stat-label">Items</div>
            </div>
          </div>

          {/* Quick Pick Section */}
          {favorites.length > 0 && (
            <div className="card">
              <h3>Quick Add</h3>
              <div className="quick-picks">
                {favorites.slice(0, 6).map(fav => (
                  <button
                    key={fav.id}
                    type="button"
                    className="quick-pick-btn"
                    onClick={() => handleQuickAdd(fav)}
                  >
                    {fav.name}
                    {fav.calories && <span className="quick-pick-cal">{fav.calories}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Food Button */}
          {!showAddForm && (
            <button type="button" onClick={() => setShowAddForm(true)} style={{ marginBottom: '16px' }}>
              + Add Food
            </button>
          )}

          {/* Add Food Form */}
          {showAddForm && (
            <div className="card">
              <form onSubmit={handleAddFood}>
                <div className="form-group">
                  <label>Food Name</label>
                  <input
                    type="text"
                    placeholder="What did you eat?"
                    value={newFoodName}
                    onChange={e => setNewFoodName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Meal</label>
                    <select
                      value={newFoodMealType}
                      onChange={e => setNewFoodMealType(e.target.value as MealType)}
                    >
                      {MEAL_TYPES.map(m => (
                        <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={newFoodCalories}
                      onChange={e => setNewFoodCalories(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <button type="submit" disabled={!newFoodName.trim()}>Add</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Food Entries by Meal */}
          {MEAL_TYPES.map(meal => {
            const entries = entriesByMeal[meal]
            if (entries.length === 0) return null
            return (
              <div key={meal} className="card">
                <h3 className="meal-header">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                <ul className="food-list">
                  {entries.map(entry => (
                    <li key={entry.id} className="food-item">
                      <span className="food-name">{entry.name}</span>
                      <span className="food-meta">
                        {entry.calories && <span className="food-calories">{entry.calories} cal</span>}
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteEntry(entry.id!)}
                          aria-label="Delete"
                        >
                          &times;
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {(!dailyLog || dailyLog.entries.length === 0) && !showAddForm && (
            <div className="card">
              <p className="empty-message">No food logged yet today. Add something!</p>
            </div>
          )}
        </>
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <>
          {!showRecipeForm && (
            <button type="button" onClick={() => setShowRecipeForm(true)} style={{ marginBottom: '16px' }}>
              + Add Recipe
            </button>
          )}

          {showRecipeForm && (
            <div className="card">
              <form onSubmit={handleAddRecipe}>
                <div className="form-group">
                  <label>Recipe Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chicken Stir Fry"
                    value={newRecipeName}
                    onChange={e => setNewRecipeName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Photo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="file-input"
                  />
                  {newRecipeImage && (
                    <div className="image-preview">
                      <img src={newRecipeImage} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setNewRecipeImage(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Ingredients (one per line)</label>
                  <textarea
                    rows={4}
                    placeholder="1 lb chicken&#10;2 cups vegetables&#10;..."
                    value={newRecipeIngredients}
                    onChange={e => setNewRecipeIngredients(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Instructions (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="How to make it..."
                    value={newRecipeInstructions}
                    onChange={e => setNewRecipeInstructions(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="quick, healthy, dinner"
                    value={newRecipeTags}
                    onChange={e => setNewRecipeTags(e.target.value)}
                  />
                </div>
                <div className="row">
                  <button type="submit" disabled={!newRecipeName.trim()}>Save Recipe</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowRecipeForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading recipes...</p>
          ) : recipes.length === 0 ? (
            <div className="card">
              <p className="empty-message">No recipes yet. Add your first recipe!</p>
            </div>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} className="card recipe-card">
                <div className="recipe-header">
                  <h3>{recipe.name}</h3>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteRecipe(recipe.id!)}
                    aria-label="Delete"
                  >
                    &times;
                  </button>
                </div>
                {recipe.image && (
                  <div className="recipe-image">
                    <img src={recipe.image} alt={recipe.name} />
                  </div>
                )}
                {recipe.tags.length > 0 && (
                  <div className="recipe-tags">
                    {recipe.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
                {recipe.ingredients.length > 0 && (
                  <div className="recipe-ingredients">
                    <strong>Ingredients:</strong>
                    <ul>
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.instructions && (
                  <div className="recipe-instructions">
                    <strong>Instructions:</strong>
                    <p>{recipe.instructions}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <>
          {!showFavoriteForm && (
            <button type="button" onClick={() => setShowFavoriteForm(true)} style={{ marginBottom: '16px' }}>
              + Add Quick Pick Item
            </button>
          )}

          {showFavoriteForm && (
            <div className="card">
              <form onSubmit={handleAddFavorite}>
                <div className="form-group">
                  <label>Food Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Coffee, Oatmeal"
                    value={newFavoriteName}
                    onChange={e => setNewFavoriteName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Default Meal</label>
                    <select
                      value={newFavoriteMealType}
                      onChange={e => setNewFavoriteMealType(e.target.value as MealType)}
                    >
                      {MEAL_TYPES.map(m => (
                        <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={newFavoriteCalories}
                      onChange={e => setNewFavoriteCalories(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <button type="submit" disabled={!newFavoriteName.trim()}>Save</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowFavoriteForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p>Loading favorites...</p>
          ) : favorites.length === 0 ? (
            <div className="card">
              <p className="empty-message">No quick picks yet. Add foods you eat often!</p>
            </div>
          ) : (
            <div className="card">
              <ul className="favorites-list">
                {favorites.map(fav => (
                  <li key={fav.id} className="favorite-item">
                    <div className="favorite-info">
                      <span className="favorite-name">{fav.name}</span>
                      <span className="favorite-meta">
                        {fav.default_meal_type}
                        {fav.calories && ` - ${fav.calories} cal`}
                        {fav.use_count > 0 && ` (used ${fav.use_count}x)`}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDeleteFavorite(fav.id!)}
                      aria-label="Delete"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default FoodLog
