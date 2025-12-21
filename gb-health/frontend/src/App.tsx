import { useState } from 'react'
import DailyEntryForm from './components/DailyEntryForm'
import ExerciseForm from './components/ExerciseForm'
import EntryList from './components/EntryList'
import FoodLog from './components/FoodLog'

type Tab = 'daily' | 'food' | 'exercise' | 'goals'

const APP_LINKS = [
  { name: 'Health', port: 5173, path: '/health/' },
  { name: 'Guitar', port: 5174, path: '/guitar/' },
  { name: 'Todo', port: 5175, path: '/todo/' },
  { name: 'Finance', port: 5176, path: '/finance/' },
  { name: 'Food', port: 5177, path: '/food/' },
  { name: 'Sales', port: 5178, path: '/sales/' },
]

const currentApp = 'Health'

function getAppUrl(app: typeof APP_LINKS[0]): string {
  const isProduction = window.location.port === '' || window.location.port === '80' || window.location.port === '443'
  if (isProduction) {
    return `${window.location.protocol}//${window.location.hostname}${app.path}`
  }
  return `http://${window.location.hostname}:${app.port}`
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('daily')

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
      <h1>GB Health</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </button>
        <button
          className={`tab ${activeTab === 'food' ? 'active' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          Food
        </button>
        <button
          className={`tab ${activeTab === 'exercise' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercise')}
        >
          Exercise
        </button>
        <button
          className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
      </div>

      {activeTab === 'daily' && <DailyEntryForm />}
      {activeTab === 'food' && <FoodLog />}
      {activeTab === 'exercise' && <ExerciseForm />}
      {activeTab === 'goals' && <EntryList />}
    </div>
  )
}

export default App
