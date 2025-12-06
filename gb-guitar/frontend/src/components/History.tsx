import { useState, useEffect } from 'react'
import { getStats, getPracticeSessions, getSongs, Stats, PracticeSession, Song } from '../api'

export default function History() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getStats(),
      getPracticeSessions(20),
      getSongs()
    ]).then(([statsData, sessionsData, songsData]) => {
      setStats(statsData)
      setSessions(sessionsData)
      setSongs(songsData)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [])

  const formatMinutes = (min: number) => {
    if (min < 60) return `${min} min`
    const hours = Math.floor(min / 60)
    const mins = min % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const songsInProgress = songs.filter(s => s.status === 'Learning')

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
      {/* Streak Display */}
      <div className="streak-display">
        <div className="streak-fire">🔥</div>
        <div className="streak-number">{stats?.current_streak || 0}</div>
        <div className="streak-label">Day Streak (Best: {stats?.longest_streak || 0})</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.practice_days_this_week || 0}</div>
          <div className="stat-label">Days This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatMinutes(stats?.minutes_this_week || 0)}</div>
          <div className="stat-label">Time This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.practice_days_this_month || 0}</div>
          <div className="stat-label">Days This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatMinutes(stats?.minutes_this_month || 0)}</div>
          <div className="stat-label">Time This Month</div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="card">
        <h2>Lifetime Stats</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
              {stats?.total_practice_days || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Practice Days</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
              {formatMinutes(stats?.total_practice_minutes || 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Time</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
              {stats?.total_sessions || 0}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Sessions</div>
          </div>
        </div>
      </div>

      {/* Songs in Progress */}
      {songsInProgress.length > 0 && (
        <div className="card">
          <h2>Songs in Progress ({songsInProgress.length})</h2>
          {songsInProgress.map(song => (
            <div key={song.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '500' }}>{song.name}</span>
                <span style={{ color: '#666' }}>{song.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${song.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Practice Sessions */}
      <div className="card">
        <h2>Recent Practice</h2>
        {sessions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No practice sessions yet. Start practicing!
          </p>
        ) : (
          <div>
            {sessions.map((session, idx) => (
              <div key={`${session.date}-${idx}`} className="practice-item">
                <div className="practice-date">
                  {session.date} • {session.focus_area}
                </div>
                <div className="practice-meta">
                  <span>⏱️ {session.duration_minutes} min</span>
                  {session.difficulty && <span>💪 {session.difficulty}/5</span>}
                </div>
                <div className="practice-notes">
                  {session.what_worked_on}
                </div>
                {session.notes && (
                  <div style={{ marginTop: '4px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    {session.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
