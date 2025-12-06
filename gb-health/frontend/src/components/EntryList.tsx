import { useState, useEffect } from 'react'
import { getDailyEntries, getExerciseEntries, DailyEntry, ExerciseEntry } from '../api'

export default function EntryList() {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([])
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'daily' | 'exercise'>('daily')

  useEffect(() => {
    Promise.all([
      getDailyEntries(14),
      getExerciseEntries(14)
    ]).then(([daily, exercise]) => {
      setDailyEntries(daily)
      setExerciseEntries(exercise)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Goal Progress</h2>
        <div className="goal-tracker">
          <div className="goal-item">
            <span>Weight Goal</span>
            <span className="goal-progress">
              {dailyEntries[0]?.weight || '---'} / 200 lbs
            </span>
          </div>
          <div className="goal-item">
            <span>Days without alcohol (last 7)</span>
            <span className="goal-progress">
              {7 - dailyEntries.slice(0, 7).filter(e => e.alcohol).length} / 7
            </span>
          </div>
          <div className="goal-item">
            <span>Avg Glucose (last 7)</span>
            <span className="goal-progress">
              {dailyEntries.slice(0, 7).filter(e => e.glucose).length > 0
                ? Math.round(
                    dailyEntries.slice(0, 7).filter(e => e.glucose).reduce((sum, e) => sum + (e.glucose || 0), 0) /
                    dailyEntries.slice(0, 7).filter(e => e.glucose).length
                  )
                : '---'
              } mg/dL
            </span>
          </div>
        </div>
      </div>

      <div className="tabs" style={{ marginTop: '16px' }}>
        <button
          className={`tab ${view === 'daily' ? 'active' : ''}`}
          onClick={() => setView('daily')}
        >
          Daily Entries
        </button>
        <button
          className={`tab ${view === 'exercise' ? 'active' : ''}`}
          onClick={() => setView('exercise')}
        >
          Exercises
        </button>
      </div>

      <div className="card">
        {view === 'daily' ? (
          <>
            <h2>Recent Daily Entries</h2>
            {dailyEntries.length === 0 ? (
              <p>No entries yet. Start tracking today!</p>
            ) : (
              <ul className="entry-list">
                {dailyEntries.map(entry => (
                  <li key={entry.date} className="entry-item">
                    <div className="entry-date">{entry.date}</div>
                    <div className="entry-stats">
                      {entry.weight && <span className="stat">⚖️ {entry.weight} lbs</span>}
                      {entry.glucose && <span className="stat">🩸 {entry.glucose}</span>}
                      {entry.blood_pressure_systolic && (
                        <span className="stat">💓 {entry.blood_pressure_systolic}/{entry.blood_pressure_diastolic}</span>
                      )}
                      {entry.steps && <span className="stat">👣 {entry.steps.toLocaleString()}</span>}
                      {entry.alcohol && <span className="stat">🍺</span>}
                    </div>
                    {entry.notes && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                        {entry.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <h2>Recent Exercises</h2>
            {exerciseEntries.length === 0 ? (
              <p>No exercises logged yet.</p>
            ) : (
              <ul className="entry-list">
                {exerciseEntries.map((entry, idx) => (
                  <li key={`${entry.date}-${idx}`} className="entry-item">
                    <div className="entry-date">{entry.date} - {entry.exercise_type}</div>
                    <div className="entry-stats">
                      {entry.distance_miles && <span className="stat">📏 {entry.distance_miles} mi</span>}
                      {entry.duration_minutes && <span className="stat">⏱️ {entry.duration_minutes} min</span>}
                      {entry.pace_per_mile && <span className="stat">🏃 {entry.pace_per_mile}/mi</span>}
                    </div>
                    {entry.notes && (
                      <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                        {entry.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
