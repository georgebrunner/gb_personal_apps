import { useState, useEffect } from 'react'
import {
  Transaction,
  TransactionType,
  saveTransaction,
  getExpenseCategories,
  getIncomeCategories
} from '../api'

const getDefaultTransaction = (date: string): Transaction => ({
  date,
  amount: 0,
  type: 'expense',
  category: '',
  description: ''
})

export default function TransactionForm() {
  const today = new Date().toISOString().split('T')[0]
  const [transaction, setTransaction] = useState<Transaction>(getDefaultTransaction(today))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expenseCategories, setExpenseCategories] = useState<string[]>([])
  const [incomeCategories, setIncomeCategories] = useState<string[]>([])

  useEffect(() => {
    // Load categories
    getExpenseCategories().then(setExpenseCategories).catch(console.error)
    getIncomeCategories().then(setIncomeCategories).catch(console.error)
  }, [])

  const categories = transaction.type === 'income' ? incomeCategories : expenseCategories

  const handleTypeChange = (type: TransactionType) => {
    setTransaction(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }))
  }

  const handleChange = (field: keyof Transaction, value: unknown) => {
    setTransaction(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!transaction.amount || !transaction.category || !transaction.description) {
      setMessage({ type: 'error', text: 'Please fill in amount, category, and description' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      await saveTransaction(transaction)
      setMessage({ type: 'success', text: 'Transaction saved!' })
      // Reset form but keep date and type
      setTransaction({
        ...getDefaultTransaction(transaction.date),
        type: transaction.type
      })
    } catch (error) {
      console.error('Failed to save transaction', error)
      setMessage({ type: 'error', text: 'Failed to save transaction' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={transaction.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div className="type-selector">
          <button
            className={`type-btn ${transaction.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            className={`type-btn ${transaction.type === 'income' ? 'active income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
          <button
            className={`type-btn ${transaction.type === 'transfer' ? 'active transfer' : ''}`}
            onClick={() => handleTypeChange('transfer')}
          >
            Transfer
          </button>
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={transaction.amount || ''}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={transaction.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Select category...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={transaction.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            placeholder="Any additional details..."
            value={transaction.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </div>
  )
}
