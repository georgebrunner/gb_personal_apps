from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from .models import Transaction, TransactionUpdate, Budget, Account
from . import storage

app = FastAPI(title="GB Finance API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ TRANSACTIONS ============

@app.post("/transactions")
def create_transaction(transaction: Transaction):
    """Create a new transaction."""
    return storage.save_transaction(transaction.model_dump())


@app.get("/transactions")
def list_transactions(limit: int = 100):
    """Get recent transactions."""
    return storage.get_all_transactions(limit)


@app.get("/transactions/date/{date_str}")
def get_transactions_by_date(date_str: str):
    """Get all transactions for a specific date."""
    try:
        d = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    return storage.get_transactions_for_date(d)


@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: str):
    """Get a specific transaction."""
    transaction = storage.get_transaction(transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@app.patch("/transactions/{transaction_id}")
def update_transaction(transaction_id: str, updates: TransactionUpdate):
    """Update a transaction."""
    # Filter out None values
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    result = storage.update_transaction(transaction_id, update_data)
    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result


@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: str):
    """Delete a transaction."""
    if not storage.delete_transaction(transaction_id):
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted"}


# ============ BUDGETS ============

@app.get("/budgets")
def list_budgets():
    """Get all budgets."""
    return storage.get_all_budgets()


@app.get("/budgets/{month}")
def get_budget(month: str):
    """Get budget for a specific month (YYYY-MM format)."""
    budget = storage.get_budget(month)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@app.post("/budgets")
def create_or_update_budget(budget: Budget):
    """Create or update a budget."""
    return storage.save_budget(budget.model_dump())


# ============ ACCOUNTS ============

@app.get("/accounts")
def list_accounts():
    """Get all accounts."""
    return storage.get_all_accounts()


@app.post("/accounts")
def create_account(account: Account):
    """Create a new account."""
    return storage.save_account(account.model_dump())


@app.patch("/accounts/{account_id}")
def update_account(account_id: str, updates: dict):
    """Update an account."""
    result = storage.update_account(account_id, updates)
    if not result:
        raise HTTPException(status_code=404, detail="Account not found")
    return result


@app.delete("/accounts/{account_id}")
def delete_account(account_id: str):
    """Delete an account."""
    if not storage.delete_account(account_id):
        raise HTTPException(status_code=404, detail="Account not found")
    return {"message": "Account deleted"}


# ============ REPORTS ============

@app.get("/reports/{month}")
def get_monthly_report(month: str):
    """Get monthly financial report (YYYY-MM format)."""
    return storage.generate_monthly_report(month)


# ============ CATEGORIES ============

# Default expense categories
EXPENSE_CATEGORIES = [
    "Food & Dining",
    "Groceries",
    "Transportation",
    "Gas",
    "Utilities",
    "Rent/Mortgage",
    "Insurance",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Personal Care",
    "Education",
    "Travel",
    "Subscriptions",
    "Gifts",
    "Charity",
    "Other"
]

INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Investments",
    "Dividends",
    "Interest",
    "Rental Income",
    "Refunds",
    "Gifts",
    "Other"
]


@app.get("/categories/expense")
def get_expense_categories():
    """Get list of expense categories."""
    return EXPENSE_CATEGORIES


@app.get("/categories/income")
def get_income_categories():
    """Get list of income categories."""
    return INCOME_CATEGORIES


# ============ HEALTH CHECK ============

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "gb-finance"}
