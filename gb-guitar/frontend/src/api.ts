// Use the same host as the frontend, but port 8001 for the API
const API_BASE = `http://${window.location.hostname}:8001`

export interface PracticeSession {
  date: string
  duration_minutes: number
  focus_area: string
  what_worked_on: string
  difficulty?: number
  notes?: string
  created_at?: string
}

export interface DailyGuitarEntry {
  date: string
  tuned_acoustic?: boolean
  tuned_electric?: boolean
  tuned_bass?: boolean
}

export interface Song {
  id?: string
  name: string
  artist: string
  difficulty: string
  status: string
  progress: number
  notes?: string
  resource_path?: string
  added_at?: string
  updated_at?: string
}

export interface Stats {
  current_streak: number
  longest_streak: number
  total_practice_minutes: number
  practice_days_this_week: number
  practice_days_this_month: number
  minutes_this_week: number
  minutes_this_month: number
  total_sessions: number
  total_practice_days: number
}

export interface Skills {
  chords: Record<string, boolean>
  techniques: Record<string, boolean>
  theory: Record<string, boolean>
}

// Practice sessions
export async function logPractice(session: PracticeSession): Promise<PracticeSession> {
  const response = await fetch(`${API_BASE}/practice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session)
  })
  if (!response.ok) throw new Error('Failed to log practice')
  return response.json()
}

export async function getPracticeSessions(limit = 30): Promise<PracticeSession[]> {
  const response = await fetch(`${API_BASE}/practice?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch practice sessions')
  return response.json()
}

// Stats
export async function getStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE}/stats`)
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

// Songs
export async function getSongs(status?: string): Promise<Song[]> {
  const url = status ? `${API_BASE}/songs?status=${encodeURIComponent(status)}` : `${API_BASE}/songs`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch songs')
  return response.json()
}

export async function addSong(song: Song): Promise<Song> {
  const response = await fetch(`${API_BASE}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(song)
  })
  if (!response.ok) throw new Error('Failed to add song')
  return response.json()
}

export async function updateSong(id: string, updates: Partial<Song>): Promise<Song> {
  const response = await fetch(`${API_BASE}/songs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update song')
  return response.json()
}

export async function deleteSong(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/songs/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete song')
}

// Skills
export async function getSkills(): Promise<Skills> {
  const response = await fetch(`${API_BASE}/skills`)
  if (!response.ok) throw new Error('Failed to fetch skills')
  return response.json()
}

export async function updateSkills(skills: Skills): Promise<Skills> {
  const response = await fetch(`${API_BASE}/skills`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skills)
  })
  if (!response.ok) throw new Error('Failed to update skills')
  return response.json()
}

// Daily guitar entry (tuning, etc.)
export async function getDailyGuitarEntry(date: string): Promise<DailyGuitarEntry | null> {
  try {
    const response = await fetch(`${API_BASE}/daily/${date}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch entry')
    return response.json()
  } catch {
    return null
  }
}

export async function saveDailyGuitarEntry(entry: DailyGuitarEntry): Promise<DailyGuitarEntry> {
  const response = await fetch(`${API_BASE}/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
  if (!response.ok) throw new Error('Failed to save entry')
  return response.json()
}

export interface TuningStats {
  acoustic: number | null
  electric: number | null
  bass: number | null
}

export async function getTuningStats(): Promise<TuningStats> {
  const response = await fetch(`${API_BASE}/tuning-stats`)
  if (!response.ok) throw new Error('Failed to fetch tuning stats')
  return response.json()
}
