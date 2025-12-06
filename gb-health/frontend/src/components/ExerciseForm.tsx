import { useState, useEffect } from 'react'
import { saveExerciseEntry, ExerciseEntry, getDailyEntry, saveDailyEntry, DailyEntry } from '../api'

const DAILY_EXERCISES = [
  { id: 'dumbbell_curls', label: 'Dumbbell curls (50 reps each arm)' },
  { id: 'balance', label: 'Stand on one foot (100 count each foot)' }
]

const OTHER_EXERCISES = [
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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load daily exercises from daily entry
  useEffect(() => {
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
            {DAILY_EXERCISES.map(ex => (
              <label key={ex.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={dailyExercises.includes(ex.id)}
                  onChange={() => handleDailyExerciseToggle(ex.id)}
                />
                {ex.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Other Exercise Today (check all that apply)</label>
          <div className="checkbox-group">
            {OTHER_EXERCISES.map(exercise => (
              <label key={exercise} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={otherExercises.includes(exercise)}
                  onChange={() => handleOtherExerciseToggle(exercise)}
                />
                {exercise}
              </label>
            ))}
          </div>
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
