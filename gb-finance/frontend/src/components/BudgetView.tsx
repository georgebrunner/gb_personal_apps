import { useState, useEffect } from 'react'
import {
  Budget,
  getBudget,
  saveBudget,
  getExpenseCategories,
  getMonthlyReport,
  MonthlyReport
} from '../api'

export default function BudgetView() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editBudget, setEditBudget] = useState<Record<string, number>>({})

  useEffect(() => {
    getExpenseCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    loadData()
  }, [selectedMonth])

  const loadData = async () => {
    setLoading(true)
    try {
      const [budgetData, reportData] = await Promise.all([
        getBudget(selectedMonth),
        getMonthlyReport(selectedMonth)
      ])
      setBudget(budgetData)
      setReport(reportData)

      if (budgetData) {
        setEditBudget(budgetData.categories)
      } else {
        // Initialize empty budget with all categories
        const emptyBudget: Record<string, number> = {}
        categories.forEach(cat => {
          emptyBudget[cat] = 0
        })
        setEditBudget(emptyBudget)
      }
    } catch (error) {
      console.error('Failed to load budget data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBudget = async () => {
    setSaving(true)
    try {
      // Filter out zero values
      const nonZeroBudget = Object.fromEntries(
        Object.entries(editBudget).filter(([, value]) => value > 0)
      )
      const newBudget = await saveBudget({
        month: selectedMonth,
        categories: nonZeroBudget
      })
      setBudget(newBudget)
      setEditing(false)
    } catch (error) {
      console.error('Failed to save budget', error)
    } finally {
      setSaving(false)
    }
  }

  const handleBudgetChange = (category: string, value: number) => {
    setEditBudget(prev => ({ ...prev, [category]: value }))
  }

  const navigateMonth = (direction: number) => {
    const date = new Date(selectedMonth + '-01')
    date.setMonth(date.getMonth() + direction)
    setSelectedMonth(date.toISOString().slice(0, 7))
  }

  const formatMonth = (month: string) => {
    const date = new Date(month + '-01')
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getProgressClass = (percent: number) => {
    if (percent >= 100) return 'over'
    if (percent >= 80) return 'warning'
    return 'under'
  }

  if (loading) {
    return <div className="loading">Loading budget...</div>
  }

  return (
    <div>
      <div className="date-nav">
        <button onClick={() => navigateMonth(-1)}>&lt;</button>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
        <button onClick={() => navigateMonth(1)}>&gt;</button>
      </div>

      {editing ? (
        <div className="card">
          <h2>Set Budget for {formatMonth(selectedMonth)}</h2>
          <div className="category-grid">
            {categories.map(category => (
              <div key={category} className="category-input">
                <label>{category}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={editBudget[category] || ''}
                  onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={handleSaveBudget}
              disabled={saving}
              style={{ flex: 1 }}
            >
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2>{formatMonth(selectedMonth)}</h2>
              <button className="btn btn-secondary btn-small" onClick={() => setEditing(true)}>
                {budget ? 'Edit Budget' : 'Set Budget'}
              </button>
            </div>

            {budget && report && Object.keys(budget.categories).length > 0 ? (
              <>
                {Object.entries(budget.categories).map(([category, budgeted]) => {
                  const spent = report.by_category[category] || 0
                  const percent = budgeted > 0 ? (spent / budgeted) * 100 : 0

                  return (
                    <div key={category} className="budget-item">
                      <div className="budget-header">
                        <span className="budget-category">{category}</span>
                        <span className="budget-amounts">
                          ${spent.toFixed(0)} / ${budgeted.toFixed(0)}
                        </span>
                      </div>
                      <div className="budget-bar">
                        <div
                          className={`budget-fill ${getProgressClass(percent)}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}

                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Budgeted:</span>
                    <strong>${Object.values(budget.categories).reduce((a, b) => a + b, 0).toFixed(0)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Spent:</span>
                    <strong className={report.total_expenses > Object.values(budget.categories).reduce((a, b) => a + b, 0) ? 'expense' : ''}>
                      ${report.total_expenses.toFixed(0)}
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No budget set for this month</p>
                <p>Set a budget to track your spending</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
