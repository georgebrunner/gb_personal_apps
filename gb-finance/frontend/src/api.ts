const API_BASE = `http://${window.location.hostname}:8002`

// ============ TYPES ============

export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id?: string
  date: string
  amount: number
  type: TransactionType
  category: string
  description: string
  account?: string
  tags?: string[]
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Budget {
  month: string
  categories: Record<string, number>
  notes?: string
  updated_at?: string
}

export interface Account {
  id?: string
  name: string
  type: string
  balance: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface MonthlyReport {
  month: string
  total_income: number
  total_expenses: number
  net: number
  by_category: Record<string, number>
  budget_comparison?: Record<string, {
    budgeted: number
    spent: number
    remaining: number
    percent_used: number
  }>
}

// ============ TRANSACTIONS ============

export async function getTransactions(limit = 100): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/transactions?limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch transactions')
  return response.json()
}

export async function getTransactionsByDate(date: string): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/transactions/date/${date}`)
  if (!response.ok) throw new Error('Failed to fetch transactions')
  return response.json()
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  try {
    const response = await fetch(`${API_BASE}/transactions/${id}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch transaction')
    return response.json()
  } catch {
    return null
  }
}

export async function saveTransaction(transaction: Transaction): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  })
  if (!response.ok) throw new Error('Failed to save transaction')
  return response.json()
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update transaction')
  return response.json()
}

export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete transaction')
}

// ============ BUDGETS ============

export async function getBudgets(): Promise<Budget[]> {
  const response = await fetch(`${API_BASE}/budgets`)
  if (!response.ok) throw new Error('Failed to fetch budgets')
  return response.json()
}

export async function getBudget(month: string): Promise<Budget | null> {
  try {
    const response = await fetch(`${API_BASE}/budgets/${month}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error('Failed to fetch budget')
    return response.json()
  } catch {
    return null
  }
}

export async function saveBudget(budget: Budget): Promise<Budget> {
  const response = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  })
  if (!response.ok) throw new Error('Failed to save budget')
  return response.json()
}

// ============ ACCOUNTS ============

export async function getAccounts(): Promise<Account[]> {
  const response = await fetch(`${API_BASE}/accounts`)
  if (!response.ok) throw new Error('Failed to fetch accounts')
  return response.json()
}

export async function saveAccount(account: Account): Promise<Account> {
  const response = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  })
  if (!response.ok) throw new Error('Failed to save account')
  return response.json()
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
  const response = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) throw new Error('Failed to update account')
  return response.json()
}

export async function deleteAccount(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete account')
}

// ============ REPORTS ============

export async function getMonthlyReport(month: string): Promise<MonthlyReport> {
  const response = await fetch(`${API_BASE}/reports/${month}`)
  if (!response.ok) throw new Error('Failed to fetch report')
  return response.json()
}

// ============ CATEGORIES ============

export async function getExpenseCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/categories/expense`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}

export async function getIncomeCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/categories/income`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  return response.json()
}
