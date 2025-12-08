import { useState } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetView from './components/BudgetView'
import ReportView from './components/ReportView'

type Tab = 'add' | 'transactions' | 'budget' | 'report'

const APP_LINKS = [
  { name: 'Health', port: 5173 },
  { name: 'Guitar', port: 5174 },
  { name: 'Todo', port: 5175 },
  { name: 'Finance', port: 5176 },
  { name: 'Sales', port: 5178 },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('add')
  const currentPort = 5176

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
      <h1>GB Finance</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          History
        </button>
        <button
          className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button
          className={`tab ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          Report
        </button>
      </div>

      {activeTab === 'add' && <TransactionForm />}
      {activeTab === 'transactions' && <TransactionList />}
      {activeTab === 'budget' && <BudgetView />}
      {activeTab === 'report' && <ReportView />}
    </div>
  )
}

export default App
