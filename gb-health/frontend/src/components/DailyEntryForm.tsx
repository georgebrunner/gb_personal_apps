import { useState, useEffect } from 'react'
import { saveDailyEntry, getDailyEntry, DailyEntry } from '../api'
import VoiceInput from './VoiceInput'

const getDefaultEntry = (date: string): DailyEntry => ({
  date,
  weight: undefined,
  blood_pressure_systolic: undefined,
  blood_pressure_diastolic: undefined,
  glucose: undefined,
  sleep_hours: undefined,
  water_glasses: 0,
  alcohol: false,
  alcohol_drinks: undefined,
  exercise: '',
  supplements: [],
  notes: '',
  daily_exercises: [],
  coffee: false,
  oatmeal: false,
  carrots: 0,
  food_log: '',
  shower: false,
  shave: false,
  brush_teeth: false,
  floss: false
})

export default function DailyEntryForm() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [entry, setEntry] = useState<DailyEntry>(getDefaultEntry(today))
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    // Load entry for selected date
    setLoading(true)
    getDailyEntry(selectedDate).then(existing => {
      if (existing && existing.date) {
        setEntry({ ...getDefaultEntry(selectedDate), ...existing })
      } else {
        setEntry(getDefaultEntry(selectedDate))
      }
    }).finally(() => setLoading(false))
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

  const handleChange = (field: keyof DailyEntry, value: unknown) => {
    setEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleWaterClick = (glasses: number) => {
    setEntry(prev => ({
      ...prev,
      water_glasses: prev.water_glasses === glasses ? glasses - 1 : glasses
    }))
  }

  const handleCarrotClick = (count: number) => {
    setEntry(prev => ({
      ...prev,
      carrots: prev.carrots === count ? count - 1 : count
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      await saveDailyEntry(entry)
      setMessage({ type: 'success', text: 'Entry saved!' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save entry' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

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

        <h2>Daily Metrics</h2>

        <div className="row">
          <div className="form-group">
            <label>Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              placeholder="219"
              value={entry.weight || ''}
              onChange={e => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
          <div className="form-group">
            <label>Glucose (mg/dL)</label>
            <input
              type="number"
              placeholder="115"
              value={entry.glucose || ''}
              onChange={e => handleChange('glucose', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>BP Systolic</label>
            <input
              type="number"
              placeholder="120"
              value={entry.blood_pressure_systolic || ''}
              onChange={e => handleChange('blood_pressure_systolic', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
          <div className="form-group">
            <label>BP Diastolic</label>
            <input
              type="number"
              placeholder="80"
              value={entry.blood_pressure_diastolic || ''}
              onChange={e => handleChange('blood_pressure_diastolic', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Sleep (hours)</label>
            <input
              type="number"
              step="0.5"
              placeholder="7"
              value={entry.sleep_hours || ''}
              onChange={e => handleChange('sleep_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Water (glasses) - tap to fill</label>
          <div className="icon-row">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                type="button"
                className={`icon-btn ${(entry.water_glasses || 0) >= num ? 'active' : ''}`}
                onClick={() => handleWaterClick(num)}
                aria-label={`${num} glass${num > 1 ? 'es' : ''} of water`}
              >
                <span className="icon-emoji">{(entry.water_glasses || 0) >= num ? '💧' : '○'}</span>
              </button>
            ))}
          </div>
        </div>


        <div className="form-group">
          <label>Alcohol?</label>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.alcohol || false}
                onChange={e => {
                  handleChange('alcohol', e.target.checked)
                  if (!e.target.checked) {
                    handleChange('alcohol_drinks', undefined)
                  }
                }}
              />
              Yes, I had alcohol
            </label>
          </div>
          {entry.alcohol && (
            <div className="alcohol-expansion">
              <div className="form-group alcohol-drinks-group">
                <label>How many drinks? ({entry.alcohol_drinks || 0})</label>
                <div className="icon-row">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      className={`icon-btn ${(entry.alcohol_drinks || 0) >= num ? 'active' : ''}`}
                      onClick={() => handleChange('alcohol_drinks', entry.alcohol_drinks === num ? num - 1 : num)}
                      aria-label={`${num} drink${num > 1 ? 's' : ''}`}
                    >
                      <span className="icon-emoji">{(entry.alcohol_drinks || 0) >= num ? '🍺' : '○'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Food Tracking</label>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.coffee || false}
                onChange={e => handleChange('coffee', e.target.checked)}
              />
              Coffee (1 cup)
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.oatmeal || false}
                onChange={e => handleChange('oatmeal', e.target.checked)}
              />
              Oatmeal (1 bowl)
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Carrots - tap to count</label>
          <div className="icon-row">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                type="button"
                className={`icon-btn ${(entry.carrots || 0) >= num ? 'active' : ''}`}
                onClick={() => handleCarrotClick(num)}
                aria-label={`${num} carrot${num > 1 ? 's' : ''}`}
              >
                <span className="icon-emoji">{(entry.carrots || 0) >= num ? '🥕' : '○'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Hygiene</label>
          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.shower || false}
                onChange={e => handleChange('shower', e.target.checked)}
              />
              Shower
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.shave || false}
                onChange={e => handleChange('shave', e.target.checked)}
              />
              Shave
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.brush_teeth || false}
                onChange={e => handleChange('brush_teeth', e.target.checked)}
              />
              Brush teeth
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={entry.floss || false}
                onChange={e => handleChange('floss', e.target.checked)}
              />
              Floss
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Notes / Journal</label>
          <VoiceInput
            placeholder="Tap mic to dictate notes"
            onResult={(text) => handleChange('notes', (entry.notes ? entry.notes + ' ' : '') + text)}
          />
          <textarea
            rows={4}
            placeholder="How are you feeling today? Any observations?"
            value={entry.notes || ''}
            onChange={e => handleChange('notes', e.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  )
}
