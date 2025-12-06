// Use the same host as the frontend, but port 8000 for the API
const API_BASE = `http://${window.location.hostname}:8000`

export interface DailyEntry {
  date: string
  weight?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  glucose?: number
  steps?: number
  sleep_hours?: number
  water_glasses?: number  // 0-6 glasses
  alcohol?: boolean
  alcohol_drinks?: number  // 1-8 drinks
  alcohol_when?: string  // "today" or "yesterday"
  exercise?: string  // Legacy single exercise
  exercises?: string[]  // New: multiple exercises per day
  supplements?: string[]
  stress_level?: number
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
