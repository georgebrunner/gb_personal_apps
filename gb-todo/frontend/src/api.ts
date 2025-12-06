// Use dynamic API base for accessing from different devices
const API_BASE = `http://${window.location.hostname}:8003`

export interface TodoItem {
  id?: string
  text: string
  completed: boolean
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  created_at?: string
  updated_at?: string
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch(`${API_BASE}/todos`)
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json()
}

export async function addTodo(todo: Partial<TodoItem>): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  })
  if (!response.ok) throw new Error('Failed to add todo')
  return response.json()
}

export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update todo')
  return response.json()
}

export async function toggleTodo(id: string): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/todos/${id}/toggle`, {
    method: 'PATCH'
  })
  if (!response.ok) throw new Error('Failed to toggle todo')
  return response.json()
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete todo')
}
