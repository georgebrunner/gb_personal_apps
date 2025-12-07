import { useState, useEffect } from 'react'
import { logPractice, getStats, Stats, PracticeSession, DailyGuitarEntry, getDailyGuitarEntry, saveDailyGuitarEntry, getTuningStats, TuningStats } from '../api'

const FOCUS_AREAS = ['Chords', 'Scales', 'Songs', 'Techniques', 'Theory', 'Other']

const getDefaultDailyEntry = (date: string): DailyGuitarEntry => ({
  date,
  tuned_acoustic: false,
  tuned_electric: false,
  tuned_bass: false
})

export default function PracticeForm() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [dailyEntry, setDailyEntry] = useState<DailyGuitarEntry>(getDefaultDailyEntry(today))
  const [loading, setLoading] = useState(true)
  const [tuningStats, setTuningStats] = useState<TuningStats | null>(null)

  const [session, setSession] = useState<PracticeSession>({
    date: today,
    duration_minutes: 30,
    focus_area: 'Songs',
    what_worked_on: '',
    difficulty: 3,
    notes: ''
  })

  const [stats, setStats] = useState<Stats | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingDaily, setSavingDaily] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const loadTuningStats = () => {
    getTuningStats().then(setTuningStats).catch(() => {})
  }

  useEffect(() => {
    getStats().then(setStats).catch(() => {})
    loadTuningStats()
  }, [])

  useEffect(() => {
    setLoading(true)
    getDailyGuitarEntry(selectedDate).then(existing => {
      if (existing && existing.date) {
        setDailyEntry({ ...getDefaultDailyEntry(selectedDate), ...existing })
      } else {
        setDailyEntry(getDefaultDailyEntry(selectedDate))
      }
    }).finally(() => setLoading(false))
    // Also update session date when navigating
    setSession(prev => ({ ...prev, date: selectedDate }))
  }, [selectedDate])

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

  const handleDailyChange = async (field: keyof DailyGuitarEntry, value: boolean) => {
    const updated = { ...dailyEntry, [field]: value }
    setDailyEntry(updated)
    // Auto-save tuning checkboxes
    setSavingDaily(true)
    try {
      await saveDailyGuitarEntry(updated)
      // Refresh tuning stats after saving
      loadTuningStats()
    } catch (e) {
      console.error('Failed to save daily entry', e)
    } finally {
      setSavingDaily(false)
    }
  }

  const handleChange = (field: keyof PracticeSession, value: unknown) => {
    setSession(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session.what_worked_on.trim()) {
      setMessage({ type: 'error', text: 'Please describe what you worked on' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      await logPractice(session)
      setMessage({ type: 'success', text: 'Practice logged! Keep it up!' })
      // Reset form for next session
      setSession({
        date: today,
        duration_minutes: 30,
        focus_area: 'Songs',
        what_worked_on: '',
        difficulty: 3,
        notes: ''
      })
      // Refresh stats
      const newStats = await getStats()
      setStats(newStats)
    } catch {
      setMessage({ type: 'error', text: 'Failed to log practice' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
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

        {/* Tuning Checkboxes */}
        <div className="form-group">
          <label>Tuned Guitars {savingDaily && <span style={{fontSize: '12px', color: '#666'}}>(saving...)</span>}</label>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={dailyEntry.tuned_acoustic || false}
                onChange={e => handleDailyChange('tuned_acoustic', e.target.checked)}
              />
              Acoustic
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={dailyEntry.tuned_electric || false}
                onChange={e => handleDailyChange('tuned_electric', e.target.checked)}
              />
              Electric
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={dailyEntry.tuned_bass || false}
                onChange={e => handleDailyChange('tuned_bass', e.target.checked)}
              />
              Bass
            </label>
          </div>
        </div>

        {/* Days Since Last Tuning */}
        {tuningStats && (
          <div className="tuning-stats">
            <label>Days Since Last Tuning</label>
            <div className="tuning-stats-grid">
              <div className={`tuning-stat ${tuningStats.acoustic === 0 ? 'tuned-today' : tuningStats.acoustic && tuningStats.acoustic > 7 ? 'needs-tuning' : ''}`}>
                <span className="tuning-stat-days">{tuningStats.acoustic ?? '-'}</span>
                <span className="tuning-stat-label">Acoustic</span>
              </div>
              <div className={`tuning-stat ${tuningStats.electric === 0 ? 'tuned-today' : tuningStats.electric && tuningStats.electric > 7 ? 'needs-tuning' : ''}`}>
                <span className="tuning-stat-days">{tuningStats.electric ?? '-'}</span>
                <span className="tuning-stat-label">Electric</span>
              </div>
              <div className={`tuning-stat ${tuningStats.bass === 0 ? 'tuned-today' : tuningStats.bass && tuningStats.bass > 7 ? 'needs-tuning' : ''}`}>
                <span className="tuning-stat-days">{tuningStats.bass ?? '-'}</span>
                <span className="tuning-stat-label">Bass</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Streak Display */}
      <div className="streak-display">
        <div className="streak-fire">🔥</div>
        <div className="streak-number">{stats?.current_streak || 0}</div>
        <div className="streak-label">Day Streak</div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.practice_days_this_week || 0}</div>
          <div className="stat-label">Days This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.minutes_this_week || 0}</div>
          <div className="stat-label">Min This Week</div>
        </div>
      </div>

      {message && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>Log Practice Session</h2>

          <div className="row">
            <div className="form-group">
              <label>Duration (min)</label>
              <input
                type="number"
                min="1"
                value={session.duration_minutes}
                onChange={e => handleChange('duration_minutes', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Focus Area</label>
            <select
              value={session.focus_area}
              onChange={e => handleChange('focus_area', e.target.value)}
            >
              {FOCUS_AREAS.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>What did you work on?</label>
            <textarea
              rows={3}
              placeholder="e.g., Fire and Rain intro, chord transitions between G and C..."
              value={session.what_worked_on}
              onChange={e => handleChange('what_worked_on', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Difficulty (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={session.difficulty || 3}
              onChange={e => handleChange('difficulty', parseInt(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
              <span>Easy</span>
              <span>{session.difficulty}</span>
              <span>Hard</span>
            </div>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Any observations? What clicked? What's frustrating?"
              value={session.notes || ''}
              onChange={e => handleChange('notes', e.target.value)}
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Log Practice'}
          </button>
        </div>
      </form>
    </div>
  )
}
