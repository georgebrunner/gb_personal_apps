import { useState } from 'react'
import DailyEntryForm from './components/DailyEntryForm'
import ExerciseForm from './components/ExerciseForm'
import EntryList from './components/EntryList'
import FoodLog from './components/FoodLog'

type Tab = 'daily' | 'food' | 'exercise' | 'goals'

const APP_LINKS = [
  { name: 'Health', port: 5173 },
  { name: 'Guitar', port: 5174 },
  { name: 'Todo', port: 5175 },
  { name: 'Finance', port: 5176 },
  { name: 'Sales', port: 5178 },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('daily')
  const currentPort = 5173

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
