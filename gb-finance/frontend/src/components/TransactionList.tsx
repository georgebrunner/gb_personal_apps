import { useState, useEffect } from 'react'
import { Transaction, getTransactions, deleteTransaction } from '../api'

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const data = await getTransactions(50)
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return

    try {
      await deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete transaction', error)
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : ''
    return `${prefix}$${amount.toFixed(2)}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  if (loading) {
    return <div className="loading">Loading transactions...</div>
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet</p>
        <p>Add your first transaction to get started!</p>
      </div>
    )
  }

  return (
    <div>
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date} className="card">
          <h3>{formatDate(date)}</h3>
          {dayTransactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-category">{transaction.category}</div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
              <div className="transaction-actions">
                <button
                  className="icon-btn danger"
                  onClick={() => transaction.id && handleDelete(transaction.id)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
