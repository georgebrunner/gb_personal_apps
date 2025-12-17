// API base URL - uses /api/sales in production, port 8005 in development
const API_BASE = import.meta.env.PROD
  ? '/api/sales'
  : `http://${window.location.hostname}:8005`

export type ChecklistItemType =
  | 'budget'
  | 'authority'
  | 'need'
  | 'timeline'
  | 'initial_meeting'
  | 'nda'
  | 'data_intake'
  | 'proposal'
  | 'pitch_deck'
  | 'closing_meeting'
  | 'prove_roi'

export type VerticalType = 'life' | 'build' | 'legal'

export const VERTICAL_LABELS: Record<VerticalType, string> = {
  life: 'SocratIQ - Life',
  build: 'SocratIQ - Build',
  legal: 'SocratIQ - Legal'
}

export interface ChecklistItemStatus {
  item: ChecklistItemType
  completed: boolean
  completed_at: string | null
  notes: string | null
}

export interface Prospect {
  id: string
  name: string
  vertical: VerticalType | null
  checklist: ChecklistItemStatus[]
  status: 'active' | 'won' | 'lost'
  notes: string | null
  created_at: string
  updated_at: string
}

export const CHECKLIST_LABELS: Record<ChecklistItemType, string> = {
  budget: 'Budget (BANT)',
  authority: 'Authority (BANT)',
  need: 'Need (BANT)',
  timeline: 'Timeline (BANT)',
  initial_meeting: 'Initial Meeting',
  nda: 'NDA',
  data_intake: 'Data Intake',
  proposal: 'Proposal',
  pitch_deck: 'Pitch Deck',
  closing_meeting: 'Closing Meeting',
  prove_roi: 'Prove ROI'
}

export async function getProspects(): Promise<Prospect[]> {
  const response = await fetch(`${API_BASE}/prospects`)
  if (!response.ok) throw new Error('Failed to fetch prospects')
  return response.json()
}

export async function createProspect(name: string, vertical?: VerticalType, notes?: string): Promise<Prospect> {
  const response = await fetch(`${API_BASE}/prospects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, vertical, notes })
  })
  if (!response.ok) throw new Error('Failed to create prospect')
  return response.json()
}

export async function updateProspect(id: string, updates: Partial<Prospect>): Promise<Prospect> {
  const response = await fetch(`${API_BASE}/prospects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update prospect')
  return response.json()
}

export async function updateChecklistItem(
  prospectId: string,
  item: ChecklistItemType,
  completed: boolean,
  notes?: string
): Promise<Prospect> {
  const response = await fetch(`${API_BASE}/prospects/${prospectId}/checklist`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, completed, notes })
  })
  if (!response.ok) throw new Error('Failed to update checklist item')
  return response.json()
}

export async function deleteProspect(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/prospects/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete prospect')
}
