import { useState } from 'react'
import DailyEntryForm from './components/DailyEntryForm'
import ExerciseForm from './components/ExerciseForm'
import EntryList from './components/EntryList'
import TodoListView from './components/TodoListView'

type Tab = 'daily' | 'todo' | 'exercise' | 'goals'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('daily')

  return (
    <div className="container">
      <h1>GB Health</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </button>
        <button
          className={`tab ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          To Do
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
      {activeTab === 'todo' && <TodoListView />}
      {activeTab === 'exercise' && <ExerciseForm />}
      {activeTab === 'goals' && <EntryList />}
    </div>
  )
}

export default App
