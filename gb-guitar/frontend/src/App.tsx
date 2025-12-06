import { useState } from 'react'
import PracticeForm from './components/PracticeForm'
import SongList from './components/SongList'
import History from './components/History'

type Tab = 'practice' | 'songs' | 'history'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('practice')

  return (
    <div className="container">
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
