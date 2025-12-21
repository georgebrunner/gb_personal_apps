import { useState } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetView from './components/BudgetView'
import ReportView from './components/ReportView'

type Tab = 'add' | 'transactions' | 'budget' | 'report'

const APP_LINKS = [
  { name: 'Health', port: 5173, path: '/health/' },
  { name: 'Guitar', port: 5174, path: '/guitar/' },
  { name: 'Todo', port: 5175, path: '/todo/' },
  { name: 'Finance', port: 5176, path: '/finance/' },
  { name: 'Food', port: 5177, path: '/food/' },
  { name: 'Sales', port: 5178, path: '/sales/' },
]

const currentApp = 'Finance'

function getAppUrl(app: typeof APP_LINKS[0]): string {
  const isProduction = window.location.port === '' || window.location.port === '80' || window.location.port === '443'
  if (isProduction) {
    return `${window.location.protocol}//${window.location.hostname}${app.path}`
  }
  return `http://${window.location.hostname}:${app.port}`
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('add')

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
