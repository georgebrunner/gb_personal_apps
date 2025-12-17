// API base URL - uses /api/food in production, port 8004 in development
const API_BASE = import.meta.env.PROD
  ? '/api/food'
  : `http://${window.location.hostname}:8004`

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodEntry {
  id?: string
  name: string
  meal_type: MealType
  calories?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  notes?: string
  recipe_id?: string
  created_at?: string
}

export interface DailyFoodLog {
  date: string
  entries: FoodEntry[]
  notes?: string
  updated_at?: string
}

export interface Recipe {
  id?: string
  name: string
  description?: string
  ingredients: string[]
  instructions?: string
  servings?: number
  prep_time_minutes?: number
  cook_time_minutes?: number
  calories_per_serving?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  tags: string[]
  image?: string  // Base64 encoded image
  created_at?: string
  updated_at?: string
}

export interface FavoriteFood {
  id?: string
  name: string
  default_meal_type: MealType
  calories?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  use_count: number
  created_at?: string
  updated_at?: string
}

// Daily food log
export async function getDailyLog(date: string): Promise<DailyFoodLog> {
  const response = await fetch(`${API_BASE}/daily/${date}`)
  if (!response.ok) throw new Error('Failed to fetch daily log')
  return response.json()
}

export async function addFoodEntry(date: string, entry: Partial<FoodEntry>): Promise<FoodEntry> {
  const response = await fetch(`${API_BASE}/daily/${date}/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
  if (!response.ok) throw new Error('Failed to add food entry')
  return response.json()
}

export async function deleteFoodEntry(date: string, entryId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/daily/${date}/entry/${entryId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete food entry')
}

// Recipes
export async function getRecipes(tag?: string): Promise<Recipe[]> {
  const url = tag ? `${API_BASE}/recipes?tag=${encodeURIComponent(tag)}` : `${API_BASE}/recipes`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch recipes')
  return response.json()
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE}/recipes/${id}`)
  if (!response.ok) throw new Error('Failed to fetch recipe')
  return response.json()
}

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  })
  if (!response.ok) throw new Error('Failed to create recipe')
  return response.json()
}

export async function updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update recipe')
  return response.json()
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete recipe')
}

// Favorites
export async function getFavorites(top?: number): Promise<FavoriteFood[]> {
  const url = top ? `${API_BASE}/favorites?top=${top}` : `${API_BASE}/favorites`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch favorites')
  return response.json()
}

export async function createFavorite(favorite: Partial<FavoriteFood>): Promise<FavoriteFood> {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite)
  })
  if (!response.ok) throw new Error('Failed to create favorite')
  return response.json()
}

export async function deleteFavorite(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/favorites/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete favorite')
}

export async function useFavorite(id: string): Promise<FavoriteFood> {
  const response = await fetch(`${API_BASE}/favorites/${id}/use`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to use favorite')
  return response.json()
}
