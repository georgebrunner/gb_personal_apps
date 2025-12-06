import { useState, useEffect } from 'react'
import { getSongs, addSong, updateSong, deleteSong, Song } from '../api'

const STATUSES = ['All', 'Want to Learn', 'Learning', 'Can Play', 'Mastered']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSongs = async () => {
    try {
      const data = await getSongs()
      setSongs(data)
    } catch (e) {
      console.error('Failed to load songs', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSongs()
  }, [])

  const filteredSongs = filter === 'All'
    ? songs
    : songs.filter(s => s.status === filter)

  const handleAddNew = () => {
    setEditingSong({
      name: '',
      artist: '',
      difficulty: 'Medium',
      status: 'Want to Learn',
      progress: 0,
      notes: ''
    })
    setShowModal(true)
  }

  const handleEdit = (song: Song) => {
    setEditingSong(song)
    setShowModal(true)
  }

  const handleSave = async (song: Song) => {
    try {
      if (song.id) {
        await updateSong(song.id, song)
      } else {
        await addSong(song)
      }
      await loadSongs()
      setShowModal(false)
      setEditingSong(null)
    } catch (e) {
      console.error('Failed to save song', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this song?')) {
      try {
        await deleteSong(id)
        await loadSongs()
      } catch (e) {
        console.error('Failed to delete song', e)
      }
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Learning': return 'learning'
      case 'Can Play': return 'can-play'
      case 'Mastered': return 'mastered'
      default: return ''
    }
  }

  if (loading) {
    return <div className="card">Loading songs...</div>
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Song Library ({songs.length})</h2>
          <button className="btn-small" onClick={handleAddNew}>+ Add Song</button>
        </div>

        <div className="filter-buttons">
          {STATUSES.map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredSongs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            {filter === 'All' ? 'No songs yet. Add your first song!' : `No songs with status "${filter}"`}
          </p>
        ) : (
          <div>
            {filteredSongs.map(song => (
              <div key={song.id} className="song-item" onClick={() => handleEdit(song)}>
                <div className="song-info">
                  <div className="song-name">{song.name}</div>
                  <div className="song-artist">{song.artist}</div>
                  {song.progress > 0 && (
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${song.progress}%` }} />
                    </div>
                  )}
                </div>
                <span className={`song-status ${getStatusClass(song.status)}`}>
                  {song.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Song Edit Modal */}
      {showModal && editingSong && (
        <SongModal
          song={editingSong}
          onSave={handleSave}
          onDelete={editingSong.id ? () => handleDelete(editingSong.id!) : undefined}
          onClose={() => { setShowModal(false); setEditingSong(null) }}
        />
      )}
    </div>
  )
}

interface SongModalProps {
  song: Song
  onSave: (song: Song) => void
  onDelete?: () => void
  onClose: () => void
}

function SongModal({ song: initialSong, onSave, onDelete, onClose }: SongModalProps) {
  const [song, setSong] = useState<Song>(initialSong)

  const handleChange = (field: keyof Song, value: unknown) => {
    setSong(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!song.name.trim() || !song.artist.trim()) {
      alert('Please enter song name and artist')
      return
    }
    onSave(song)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{song.id ? 'Edit Song' : 'Add Song'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Song Name</label>
            <input
              type="text"
              placeholder="Fire and Rain"
              value={song.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Artist</label>
            <input
              type="text"
              placeholder="James Taylor"
              value={song.artist}
              onChange={e => handleChange('artist', e.target.value)}
            />
          </div>

          <div className="row">
            <div className="form-group">
              <label>Difficulty</label>
              <select
                value={song.difficulty}
                onChange={e => handleChange('difficulty', e.target.value)}
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={song.status}
                onChange={e => handleChange('status', e.target.value)}
              >
                {STATUSES.slice(1).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Progress: {song.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={song.progress}
              onChange={e => handleChange('progress', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={3}
              placeholder="Tricky parts, links to tabs, what to practice..."
              value={song.notes || ''}
              onChange={e => handleChange('notes', e.target.value)}
            />
          </div>

          <button type="submit">Save Song</button>

          {onDelete && (
            <button
              type="button"
              className="btn-danger"
              style={{ marginTop: '12px' }}
              onClick={onDelete}
            >
              Delete Song
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
