import { useState } from 'react'
import PracticeForm from './components/PracticeForm'
import SongList from './components/SongList'
import History from './components/History'

type Tab = 'practice' | 'songs' | 'history'

const APP_LINKS = [
  { name: 'Health', port: 5173, path: '/health/' },
  { name: 'Guitar', port: 5174, path: '/guitar/' },
  { name: 'Todo', port: 5175, path: '/todo/' },
  { name: 'Finance', port: 5176, path: '/finance/' },
  { name: 'Food', port: 5177, path: '/food/' },
  { name: 'Sales', port: 5178, path: '/sales/' },
]

const currentApp = 'Guitar'

function getAppUrl(app: typeof APP_LINKS[0]): string {
  const isProduction = window.location.port === '' || window.location.port === '80' || window.location.port === '443'
  if (isProduction) {
    return `${window.location.protocol}//${window.location.hostname}${app.path}`
  }
  return `http://${window.location.hostname}:${app.port}`
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('practice')

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
