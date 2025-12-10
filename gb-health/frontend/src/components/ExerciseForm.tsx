import { useState, useEffect } from 'react'
import { saveExerciseEntry, ExerciseEntry, getDailyEntry, saveDailyEntry, getSettings, addCustomExercise, removeCustomExercise, CustomExercise } from '../api'

const DEFAULT_DAILY_EXERCISES = [
  { id: 'dumbbell_curls', label: 'Dumbbell curls (50 reps each arm)' },
  { id: 'balance', label: 'Stand on one foot (100 count each foot)' }
]

const DEFAULT_OTHER_EXERCISES = [
  'Walk',
  'Run',
  'Bike',
  'Swim',
  'Weights',
  'Yoga',
  'Gardening',
  'Yardwork',
  'Housework',
  'Other'
]

export default function ExerciseForm() {
  const today = new Date().toISOString().split('T')[0]

  const [entry, setEntry] = useState<ExerciseEntry>({
    date: today,
    exercise_type: 'Run',
    distance_miles: undefined,
    duration_minutes: undefined,
    notes: ''
  })

  const [dailyExercises, setDailyExercises] = useState<string[]>([])
  const [otherExercises, setOtherExercises] = useState<string[]>([])
  const [customDailyExercises, setCustomDailyExercises] = useState<CustomExercise[]>([])
  const [customOtherExercises, setCustomOtherExercises] = useState<CustomExercise[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showAddDaily, setShowAddDaily] = useState(false)
  const [showAddOther, setShowAddOther] = useState(false)
  const [newExerciseLabel, setNewExerciseLabel] = useState('')

  // Load settings and daily exercises
  useEffect(() => {
    getSettings().then(settings => {
      setCustomDailyExercises(settings.custom_daily_exercises || [])
      setCustomOtherExercises(settings.custom_other_exercises || [])
    }).catch(console.error)

    getDailyEntry(today).then(dailyEntry => {
      if (dailyEntry) {
        setDailyExercises(dailyEntry.daily_exercises || [])
        // Support both old single exercise string and new array format
        if (dailyEntry.exercises) {
          setOtherExercises(dailyEntry.exercises)
        } else if (dailyEntry.exercise) {
          setOtherExercises([dailyEntry.exercise])
        } else {
          setOtherExercises([])
        }
      }
    })
  }, [today])

  // Combined exercise lists
  const allDailyExercises = [...DEFAULT_DAILY_EXERCISES, ...customDailyExercises]
  const allOtherExercises = [...DEFAULT_OTHER_EXERCISES, ...customOtherExercises.map(e => e.label)]

  const handleChange = (field: keyof ExerciseEntry, value: unknown) => {
    setEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleDailyExerciseToggle = async (exerciseId: string) => {
    const newExercises = dailyExercises.includes(exerciseId)
      ? dailyExercises.filter(e => e !== exerciseId)
      : [...dailyExercises, exerciseId]

    setDailyExercises(newExercises)

    // Save to daily entry
    const dailyEntry = await getDailyEntry(today) || { date: today }
    await saveDailyEntry({ ...dailyEntry, daily_exercises: newExercises })
  }

  const handleOtherExerciseToggle = async (exercise: string) => {
    const newExercises = otherExercises.includes(exercise)
      ? otherExercises.filter(e => e !== exercise)
      : [...otherExercises, exercise]

    setOtherExercises(newExercises)

    // Save to daily entry
    const dailyEntry = await getDailyEntry(today) || { date: today }
    await saveDailyEntry({ ...dailyEntry, exercises: newExercises })
  }

  const handleAddCustomExercise = async (type: 'daily' | 'other') => {
    if (!newExerciseLabel.trim()) return

    const id = newExerciseLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')
    const exercise: CustomExercise = { id, label: newExerciseLabel.trim() }

    try {
      const settings = await addCustomExercise(type, exercise)
      if (type === 'daily') {
        setCustomDailyExercises(settings.custom_daily_exercises || [])
        setShowAddDaily(false)
      } else {
        setCustomOtherExercises(settings.custom_other_exercises || [])
        setShowAddOther(false)
      }
      setNewExerciseLabel('')
    } catch (err) {
      console.error('Failed to add exercise:', err)
    }
  }

  const handleRemoveCustomExercise = async (type: 'daily' | 'other', exerciseId: string) => {
    try {
      const settings = await removeCustomExercise(type, exerciseId)
      if (type === 'daily') {
        setCustomDailyExercises(settings.custom_daily_exercises || [])
      } else {
        setCustomOtherExercises(settings.custom_other_exercises || [])
      }
    } catch (err) {
      console.error('Failed to remove exercise:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const saved = await saveExerciseEntry(entry)
      setMessage({ type: 'success', text: `Saved! ${saved.pace_per_mile ? `Pace: ${saved.pace_per_mile}/mi` : ''}` })
      // Reset form for another entry
      setEntry({
        date: today,
        exercise_type: 'Run',
        distance_miles: undefined,
        duration_minutes: undefined,
        notes: ''
      })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save exercise' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <div className="card">
        <h2>Daily Exercises</h2>
        <div className="form-group">
          <div className="checkbox-group">
            {allDailyExercises.map((ex: { id: string; label: string }) => (
              <div key={ex.id} className="checkbox-item-with-delete">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={dailyExercises.includes(ex.id)}
                    onChange={() => handleDailyExerciseToggle(ex.id)}
                  />
                  {ex.label}
                </label>
                {customDailyExercises.some(c => c.id === ex.id) && (
                  <button
                    type="button"
                    className="delete-exercise-btn"
                    onClick={() => handleRemoveCustomExercise('daily', ex.id)}
                    aria-label={`Remove ${ex.label}`}
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
          {showAddDaily ? (
            <div className="add-exercise-form">
              <input
                type="text"
                placeholder="Exercise name (e.g., Squats - 20 reps)"
                value={newExerciseLabel}
                onChange={e => setNewExerciseLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomExercise('daily'))}
              />
              <div className="add-exercise-buttons">
                <button type="button" onClick={() => handleAddCustomExercise('daily')}>Add</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowAddDaily(false); setNewExerciseLabel('') }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button type="button" className="add-exercise-btn" onClick={() => setShowAddDaily(true)}>
              + Add Exercise
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Other Exercise Today (check all that apply)</label>
          <div className="checkbox-group">
            {allOtherExercises.map((exercise: string) => (
              <div key={exercise} className="checkbox-item-with-delete">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={otherExercises.includes(exercise)}
                    onChange={() => handleOtherExerciseToggle(exercise)}
                  />
                  {exercise}
                </label>
                {customOtherExercises.some(c => c.label === exercise) && (
                  <button
                    type="button"
                    className="delete-exercise-btn"
                    onClick={() => {
                      const custom = customOtherExercises.find(c => c.label === exercise)
                      if (custom) handleRemoveCustomExercise('other', custom.id)
                    }}
                    aria-label={`Remove ${exercise}`}
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
          {showAddOther ? (
            <div className="add-exercise-form">
              <input
                type="text"
                placeholder="Exercise name (e.g., Tennis)"
                value={newExerciseLabel}
                onChange={e => setNewExerciseLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomExercise('other'))}
              />
              <div className="add-exercise-buttons">
                <button type="button" onClick={() => handleAddCustomExercise('other')}>Add</button>
                <button type="button" className="cancel-btn" onClick={() => { setShowAddOther(false); setNewExerciseLabel('') }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button type="button" className="add-exercise-btn" onClick={() => setShowAddOther(true)}>
              + Add Exercise Type
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Log Workout</h2>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={entry.date}
            onChange={e => handleChange('date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Workout Type</label>
          <select
            value={entry.exercise_type}
            onChange={e => handleChange('exercise_type', e.target.value)}
          >
            <option value="Run">Run</option>
            <option value="Walk">Walk</option>
            <option value="Weights">Weights</option>
            <option value="Bike">Bike</option>
            <option value="Swim">Swim</option>
            <option value="Yoga">Yoga</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Distance (miles)</label>
            <input
              type="number"
              step="0.1"
              placeholder="3.1"
              value={entry.distance_miles || ''}
              onChange={e => handleChange('distance_miles', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              placeholder="30"
              value={entry.duration_minutes || ''}
              onChange={e => handleChange('duration_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows={3}
            placeholder="How did it feel? Weather conditions?"
            value={entry.notes || ''}
            onChange={e => handleChange('notes', e.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Log Exercise'}
        </button>
      </div>
    </form>
  )
}
