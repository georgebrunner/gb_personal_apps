import { useState } from 'react'
import PracticeForm from './components/PracticeForm'
import SongList from './components/SongList'
import History from './components/History'

type Tab = 'practice' | 'songs' | 'history'

const APP_LINKS = [
  { name: 'Health', port: 5173 },
  { name: 'Guitar', port: 5174 },
  { name: 'Todo', port: 5175 },
  { name: 'Finance', port: 5176 },
  { name: 'Food', port: 5177 },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('practice')
  const currentPort = 5174

  return (
    <div className="container">
      <nav className="app-nav">
        {APP_LINKS.map(app => (
          <a
            key={app.port}
            href={`http://${window.location.hostname}:${app.port}`}
            className={`app-link ${app.port === currentPort ? 'active' : ''}`}
          >
            {app.name}
          </a>
        ))}
      </nav>
      <h1>GB Guitar</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          Practice
        </button>
        <button
          className={`tab ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          Songs
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {activeTab === 'practice' && <PracticeForm />}
      {activeTab === 'songs' && <SongList />}
      {activeTab === 'history' && <History />}
    </div>
  )
}

export default App
