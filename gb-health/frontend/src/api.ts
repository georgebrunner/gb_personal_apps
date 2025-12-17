// API base URL - uses /api/health in production, port 8000 in development
const API_BASE = import.meta.env.PROD
  ? '/api/health'
  : `http://${window.location.hostname}:8000`

export interface DailyEntry {
  date: string
  weight?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  glucose?: number
  sleep_hours?: number
  water_glasses?: number  // 0-6 glasses
  steps?: number  // daily step count
  alcohol?: boolean
  alcohol_drinks?: number  // 1-8 drinks
  alcohol_when?: string  // "today" or "yesterday"
  exercise?: string  // Legacy single exercise
  exercises?: string[]  // New: multiple exercises per day
  supplements?: string[]
  notes?: string
  // Daily exercises
  daily_exercises?: string[]  // e.g., ["dumbbell_curls", "balance_left", "balance_right"]
  // Food tracking
  coffee?: boolean
  oatmeal?: boolean
  carrots?: number  // 0-6 carrots
  food_log?: string
  // Hygiene tracking
  shower?: boolean
  shave?: boolean
  brush_teeth?: boolean
  floss?: boolean
}

export interface ExerciseEntry {
  date: string
  exercise_type: string
  distance_miles?: number
  duration_minutes?: number
  pace_per_mile?: string
  notes?: string
}

export async function saveDailyEntry(entry: DailyEntry): Promise<DailyEntry> {
  const response = await fetch(`${API_BASE}/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
  if (!response.ok) throw new Error('Failed to save entry')
  return response.json()
}

export async function getDailyEntries(limit = 30): Promise<DailyEntry[]> {
  const response = await fetch(`${API_BASE}/daily?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch entries')
  return response.json()
}

export async function getTodayEntry(): Promise<DailyEntry | null> {
  const today = new Date().toISOString().split('T')[0]
  return getDailyEntry(today)
}

export async function getDailyEntry(date: string): Promise<DailyEntry | null> {
  try {
    const response = await fetch(`${API_BASE}/daily/${date}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch entry')
    return response.json()
  } catch {
    return null
  }
}

export async function saveExerciseEntry(entry: ExerciseEntry): Promise<ExerciseEntry> {
  const response = await fetch(`${API_BASE}/exercise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
  if (!response.ok) throw new Error('Failed to save exercise')
  return response.json()
}

export async function getExerciseEntries(limit = 30): Promise<ExerciseEntry[]> {
  const response = await fetch(`${API_BASE}/exercise?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch exercises')
  return response.json()
}

// Todo types and functions
export interface TodoItem {
  id: string
  text: string
  completed: boolean
  created_at: string
  completed_at?: string
}

export interface TodoList {
  date: string
  items: TodoItem[]
}

export async function getTodos(date: string): Promise<TodoList> {
  const response = await fetch(`${API_BASE}/todos/${date}`)
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export async function addTodoItem(date: string, item: TodoItem): Promise<TodoList> {
  const response = await fetch(`${API_BASE}/todos/${date}/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  if (!response.ok) throw new Error('Failed to add todo')
  return response.json()
}

export async function toggleTodoItem(date: string, itemId: string, completed: boolean): Promise<TodoList> {
  const response = await fetch(`${API_BASE}/todos/${date}/item/${itemId}?completed=${completed}`, {
    method: 'PATCH'
  })
  if (!response.ok) throw new Error('Failed to toggle todo')
  return response.json()
}

export async function deleteTodoItem(date: string, itemId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/todos/${date}/item/${itemId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete todo')
}

// Food tracking API - uses /api/food in production, port 8004 in development
const FOOD_API_BASE = import.meta.env.PROD
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
  image?: string
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

export async function getDailyFoodLog(date: string): Promise<DailyFoodLog> {
  const response = await fetch(`${FOOD_API_BASE}/daily/${date}`)
  if (!response.ok) throw new Error('Failed to fetch daily log')
  return response.json()
}

export async function addFoodEntry(date: string, entry: Partial<FoodEntry>): Promise<FoodEntry> {
  const response = await fetch(`${FOOD_API_BASE}/daily/${date}/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
  if (!response.ok) throw new Error('Failed to add food entry')
  return response.json()
}

export async function deleteFoodEntry(date: string, entryId: string): Promise<void> {
  const response = await fetch(`${FOOD_API_BASE}/daily/${date}/entry/${entryId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete food entry')
}

export async function getRecipes(tag?: string): Promise<Recipe[]> {
  const url = tag ? `${FOOD_API_BASE}/recipes?tag=${encodeURIComponent(tag)}` : `${FOOD_API_BASE}/recipes`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch recipes')
  return response.json()
}

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const response = await fetch(`${FOOD_API_BASE}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  })
  if (!response.ok) throw new Error('Failed to create recipe')
  return response.json()
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${FOOD_API_BASE}/recipes/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete recipe')
}

export async function getFavorites(top?: number): Promise<FavoriteFood[]> {
  const url = top ? `${FOOD_API_BASE}/favorites?top=${top}` : `${FOOD_API_BASE}/favorites`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch favorites')
  return response.json()
}

export async function createFavorite(favorite: Partial<FavoriteFood>): Promise<FavoriteFood> {
  const response = await fetch(`${FOOD_API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite)
  })
  if (!response.ok) throw new Error('Failed to create favorite')
  return response.json()
}

export async function deleteFavorite(id: string): Promise<void> {
  const response = await fetch(`${FOOD_API_BASE}/favorites/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete favorite')
}

export async function updateFavorite(id: string, updates: Partial<FavoriteFood>): Promise<FavoriteFood> {
  const response = await fetch(`${FOOD_API_BASE}/favorites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update favorite')
  return response.json()
}

export async function useFavorite(id: string): Promise<FavoriteFood> {
  const response = await fetch(`${FOOD_API_BASE}/favorites/${id}/use`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to use favorite')
  return response.json()
}

// Settings / Custom exercises
export interface CustomExercise {
  id: string
  label: string
}

export interface Settings {
  custom_daily_exercises: CustomExercise[]
  custom_other_exercises: CustomExercise[]
}

export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${API_BASE}/settings`)
  if (!response.ok) throw new Error('Failed to fetch settings')
  return response.json()
}

export async function addCustomExercise(exerciseType: 'daily' | 'other', exercise: CustomExercise): Promise<Settings> {
  const response = await fetch(`${API_BASE}/settings/exercises/${exerciseType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  })
  if (!response.ok) throw new Error('Failed to add custom exercise')
  return response.json()
}

export async function removeCustomExercise(exerciseType: 'daily' | 'other', exerciseId: string): Promise<Settings> {
  const response = await fetch(`${API_BASE}/settings/exercises/${exerciseType}/${exerciseId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to remove custom exercise')
  return response.json()
}
