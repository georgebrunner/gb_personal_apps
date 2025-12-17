// API base URL - uses /api/todo in production, port 8003 in development
const API_BASE = import.meta.env.PROD
  ? '/api/todo'
  : `http://${window.location.hostname}:8003`

export type ListType = 'todo' | 'shopping' | 'notes'

export interface Store {
  id: string
  name: string
}

export interface TodoItem {
  id?: string
  text: string
  completed: boolean
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
  list_type?: ListType
  store?: string
  created_at?: string
  updated_at?: string
}

export async function fetchStores(): Promise<Store[]> {
  const response = await fetch(`${API_BASE}/stores`)
  if (!response.ok) throw new Error('Failed to fetch stores')
  return response.json()
}

export async function fetchTodos(listType?: ListType, store?: string): Promise<TodoItem[]> {
  const params = new URLSearchParams()
  if (listType) params.append('list_type', listType)
  if (store) params.append('store', store)
  const url = params.toString() ? `${API_BASE}/todos?${params}` : `${API_BASE}/todos`
  const response = await fetch(url)
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
