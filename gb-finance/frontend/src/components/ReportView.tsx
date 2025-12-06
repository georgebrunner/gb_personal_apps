import { useState, useEffect } from 'react'
import { getMonthlyReport, MonthlyReport } from '../api'

export default function ReportView() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReport()
  }, [selectedMonth])

  const loadReport = async () => {
    setLoading(true)
    try {
      const data = await getMonthlyReport(selectedMonth)
      setReport(data)
    } catch (error) {
      console.error('Failed to load report', error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return <div className="loading">Loading report...</div>
  }

  if (!report) {
    return <div className="empty-state">No data available</div>
  }

  const sortedCategories = Object.entries(report.by_category)
    .sort((a, b) => b[1] - a[1])

  const totalExpenses = report.total_expenses || 1 // Avoid division by zero

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

      <h2 style={{ marginBottom: 16 }}>{formatMonth(selectedMonth)}</h2>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-label">Income</div>
          <div className="summary-value income">
            ${report.total_income.toFixed(0)}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Expenses</div>
          <div className="summary-value expense">
            ${report.total_expenses.toFixed(0)}
          </div>
        </div>
        <div className="summary-card full-width">
          <div className="summary-label">Net</div>
          <div className={`summary-value ${report.net >= 0 ? 'positive' : 'negative'}`}>
            {report.net >= 0 ? '+' : ''}${report.net.toFixed(0)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Expenses by Category</h3>

        {sortedCategories.length > 0 ? (
          sortedCategories.map(([category, amount]) => {
            const percent = (amount / totalExpenses) * 100

            return (
              <div key={category} className="budget-item">
                <div className="budget-header">
                  <span className="budget-category">{category}</span>
                  <span className="budget-amounts">
                    ${amount.toFixed(0)} ({percent.toFixed(0)}%)
                  </span>
                </div>
                <div className="budget-bar">
                  <div
                    className="budget-fill under"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })
        ) : (
          <div className="empty-state">
            <p>No expenses this month</p>
          </div>
        )}
      </div>

      {report.budget_comparison && Object.keys(report.budget_comparison).length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Budget vs Actual</h3>

          {Object.entries(report.budget_comparison).map(([category, data]) => (
            <div key={category} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>{category}</span>
                <span style={{ color: data.remaining >= 0 ? '#10B981' : '#EF4444' }}>
                  {data.remaining >= 0 ? '+' : ''}${data.remaining.toFixed(0)} remaining
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>
                Spent ${data.spent.toFixed(0)} of ${data.budgeted.toFixed(0)} ({data.percent_used.toFixed(0)}%)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
