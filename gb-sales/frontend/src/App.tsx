import { useState, useEffect } from 'react'
import {
  Prospect,
  getProspects,
  createProspect,
  updateChecklistItem,
  updateProspect,
  deleteProspect,
  CHECKLIST_LABELS,
  ChecklistItemType,
  VerticalType
} from './api'

const APP_LINKS = [
  { name: 'Health', port: 5173, path: '/health/' },
  { name: 'Guitar', port: 5174, path: '/guitar/' },
  { name: 'Todo', port: 5175, path: '/todo/' },
  { name: 'Finance', port: 5176, path: '/finance/' },
  { name: 'Food', port: 5177, path: '/food/' },
  { name: 'Sales', port: 5178, path: '/sales/' },
]

const currentApp = 'Sales'

function getAppUrl(app: typeof APP_LINKS[0]): string {
  const isProduction = window.location.port === '' || window.location.port === '80' || window.location.port === '443'
  if (isProduction) {
    return `${window.location.protocol}//${window.location.hostname}${app.path}`
  }
  return `http://${window.location.hostname}:${app.port}`
}

function App() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [newProspectName, setNewProspectName] = useState('')
  const [newProspectVertical, setNewProspectVertical] = useState<VerticalType | ''>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProspects()
  }, [])

  const loadProspects = async () => {
    try {
      const data = await getProspects()
      setProspects(data)
    } catch (error) {
      console.error('Failed to load prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProspect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProspectName.trim()) return

    try {
      const newProspect = await createProspect(
        newProspectName.trim(),
        newProspectVertical || undefined
      )
      setProspects([...prospects, newProspect])
      setNewProspectName('')
      setNewProspectVertical('')
    } catch (error) {
      console.error('Failed to create prospect:', error)
    }
  }

  const handleVerticalChange = async (prospectId: string, vertical: VerticalType | null) => {
    try {
      const updated = await updateProspect(prospectId, { vertical })
      setProspects(prospects.map(p => p.id === prospectId ? updated : p))
    } catch (error) {
      console.error('Failed to update vertical:', error)
    }
  }

  const handleChecklistChange = async (prospectId: string, item: ChecklistItemType, completed: boolean) => {
    try {
      const updated = await updateChecklistItem(prospectId, item, completed)
      setProspects(prospects.map(p => p.id === prospectId ? updated : p))
    } catch (error) {
      console.error('Failed to update checklist:', error)
    }
  }

  const handleStatusChange = async (prospectId: string, status: 'active' | 'won' | 'lost') => {
    try {
      const updated = await updateProspect(prospectId, { status })
      setProspects(prospects.map(p => p.id === prospectId ? updated : p))
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDelete = async (prospectId: string) => {
    if (!confirm('Are you sure you want to delete this prospect?')) return

    try {
      await deleteProspect(prospectId)
      setProspects(prospects.filter(p => p.id !== prospectId))
    } catch (error) {
      console.error('Failed to delete prospect:', error)
    }
  }

  const getProgress = (prospect: Prospect) => {
    const completed = prospect.checklist.filter(c => c.completed).length
    return { completed, total: prospect.checklist.length }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
  }

  // Sort: active first, then won, then lost
  const sortedProspects = [...prospects].sort((a, b) => {
    const order = { active: 0, won: 1, lost: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <div className="container">
      <nav className="app-nav">
        {APP_LINKS.map(app => (
          <a
            key={app.name}
            href={getAppUrl(app)}
            className={`app-link ${app.name === currentApp ? 'active' : ''}`}
          >
            {app.name}
          </a>
        ))}
      </nav>

      <h1>Sales Close Checklist</h1>

      <form className="add-prospect-form" onSubmit={handleAddProspect}>
        <input
          type="text"
          value={newProspectName}
          onChange={(e) => setNewProspectName(e.target.value)}
          placeholder="Enter prospect name..."
        />
        <select
          value={newProspectVertical}
          onChange={(e) => setNewProspectVertical(e.target.value as VerticalType | '')}
          className="vertical-select"
          title="Select vertical"
        >
          <option value="">Select Vertical...</option>
          <option value="life">SocratIQ - Life</option>
          <option value="build">SocratIQ - Build</option>
          <option value="legal">SocratIQ - Legal</option>
        </select>
        <button type="submit">Add Prospect</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="prospects-grid">
          {sortedProspects.map(prospect => {
            const progress = getProgress(prospect)
            return (
              <div key={prospect.id} className={`prospect-card ${prospect.status}`}>
                <div className="prospect-header">
                  <span className="prospect-name">{prospect.name}</span>
                  <select
                    value={prospect.vertical || ''}
                    onChange={(e) => handleVerticalChange(prospect.id, e.target.value as VerticalType || null)}
                    className="vertical-select-card"
                    title="Select vertical"
                  >
                    <option value="">No Vertical</option>
                    <option value="life">SocratIQ - Life</option>
                    <option value="build">SocratIQ - Build</option>
                    <option value="legal">SocratIQ - Legal</option>
                  </select>
                </div>
                <div className="prospect-status">
                    <button
                      className={`status-btn ${prospect.status === 'active' ? 'active-status' : ''}`}
                      onClick={() => handleStatusChange(prospect.id, 'active')}
                    >
                      Active
                    </button>
                    <button
                      className={`status-btn ${prospect.status === 'won' ? 'won-status' : ''}`}
                      onClick={() => handleStatusChange(prospect.id, 'won')}
                    >
                      Won
                    </button>
                    <button
                      className={`status-btn ${prospect.status === 'lost' ? 'lost-status' : ''}`}
                      onClick={() => handleStatusChange(prospect.id, 'lost')}
                    >
                      Lost
                    </button>
                  </div>

                <div className="progress-text">{progress.completed} of {progress.total} complete</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>

                <ul className="checklist">
                  {prospect.checklist.map(item => (
                    <li key={item.item} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        id={`${prospect.id}-${item.item}`}
                        checked={item.completed}
                        onChange={(e) => handleChecklistChange(prospect.id, item.item, e.target.checked)}
                      />
                      <label htmlFor={`${prospect.id}-${item.item}`}>
                        {CHECKLIST_LABELS[item.item]}
                      </label>
                      {item.completed_at && (
                        <span className="completed-date">{formatDate(item.completed_at)}</span>
                      )}
                    </li>
                  ))}
                </ul>

                <button className="delete-btn" onClick={() => handleDelete(prospect.id)}>
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default App
