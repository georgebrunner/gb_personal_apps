import json
import os
from datetime import date, datetime
from pathlib import Path
from typing import Optional
import uuid

# Data directories
DATA_DIR = Path(__file__).parent.parent.parent / "data"
TRANSACTIONS_DIR = DATA_DIR / "transactions"
BUDGETS_DIR = DATA_DIR / "budgets"
ACCOUNTS_DIR = DATA_DIR / "accounts"


def ensure_dirs():
    """Create data directories if they don't exist."""
    TRANSACTIONS_DIR.mkdir(parents=True, exist_ok=True)
    BUDGETS_DIR.mkdir(parents=True, exist_ok=True)
    ACCOUNTS_DIR.mkdir(parents=True, exist_ok=True)


def date_to_filename(d: date) -> str:
    """Convert date to filename format."""
    return d.strftime("%Y-%m-%d") + ".json"


def month_to_filename(month: str) -> str:
    """Convert month string to filename format."""
    return month + ".json"


# ============ TRANSACTIONS ============

def get_transactions_for_date(d: date) -> list[dict]:
    """Get all transactions for a specific date."""
    ensure_dirs()
    filepath = TRANSACTIONS_DIR / date_to_filename(d)
    if not filepath.exists():
        return []
    with open(filepath, "r") as f:
        return json.load(f)


def get_all_transactions(limit: int = 100) -> list[dict]:
    """Get recent transactions across all dates."""
    ensure_dirs()
    all_transactions = []
    files = sorted(TRANSACTIONS_DIR.glob("*.json"), reverse=True)

    for filepath in files:
        if len(all_transactions) >= limit:
            break
        with open(filepath, "r") as f:
            transactions = json.load(f)
            all_transactions.extend(transactions)

    # Sort by date descending, then by created_at descending
    all_transactions.sort(key=lambda x: (x.get("date", ""), x.get("created_at", "")), reverse=True)
    return all_transactions[:limit]


def save_transaction(transaction: dict) -> dict:
    """Save a new transaction."""
    ensure_dirs()

    # Generate ID if not present
    if not transaction.get("id"):
        transaction["id"] = str(uuid.uuid4())[:8]

    # Add timestamps
    now = datetime.now().isoformat()
    transaction["created_at"] = now
    transaction["updated_at"] = now

    # Get the date and load existing transactions
    trans_date = transaction["date"]
    if isinstance(trans_date, date):
        trans_date = trans_date.isoformat()
    transaction["date"] = trans_date

    filepath = TRANSACTIONS_DIR / (trans_date + ".json")

    existing = []
    if filepath.exists():
        with open(filepath, "r") as f:
            existing = json.load(f)

    existing.append(transaction)

    with open(filepath, "w") as f:
        json.dump(existing, f, indent=2)

    return transaction


def get_transaction(transaction_id: str) -> Optional[dict]:
    """Get a specific transaction by ID."""
    ensure_dirs()
    for filepath in TRANSACTIONS_DIR.glob("*.json"):
        with open(filepath, "r") as f:
            transactions = json.load(f)
            for t in transactions:
                if t.get("id") == transaction_id:
                    return t
    return None


def update_transaction(transaction_id: str, updates: dict) -> Optional[dict]:
    """Update an existing transaction."""
    ensure_dirs()

    for filepath in TRANSACTIONS_DIR.glob("*.json"):
        with open(filepath, "r") as f:
            transactions = json.load(f)

        for i, t in enumerate(transactions):
            if t.get("id") == transaction_id:
                # Apply updates
                for key, value in updates.items():
                    if value is not None:
                        if isinstance(value, date):
                            value = value.isoformat()
                        t[key] = value
                t["updated_at"] = datetime.now().isoformat()
                transactions[i] = t

                # Check if date changed - need to move to different file
                new_date = t.get("date")
                old_date = filepath.stem

                if new_date != old_date:
                    # Remove from old file
                    transactions.pop(i)
                    if transactions:
                        with open(filepath, "w") as f:
                            json.dump(transactions, f, indent=2)
                    else:
                        filepath.unlink()

                    # Add to new file
                    new_filepath = TRANSACTIONS_DIR / (new_date + ".json")
                    new_transactions = []
                    if new_filepath.exists():
                        with open(new_filepath, "r") as f:
                            new_transactions = json.load(f)
                    new_transactions.append(t)
                    with open(new_filepath, "w") as f:
                        json.dump(new_transactions, f, indent=2)
                else:
                    with open(filepath, "w") as f:
                        json.dump(transactions, f, indent=2)

                return t

    return None


def delete_transaction(transaction_id: str) -> bool:
    """Delete a transaction by ID."""
    ensure_dirs()

    for filepath in TRANSACTIONS_DIR.glob("*.json"):
        with open(filepath, "r") as f:
            transactions = json.load(f)

        for i, t in enumerate(transactions):
            if t.get("id") == transaction_id:
                transactions.pop(i)
                if transactions:
                    with open(filepath, "w") as f:
                        json.dump(transactions, f, indent=2)
                else:
                    filepath.unlink()
                return True

    return False


# ============ BUDGETS ============

def get_budget(month: str) -> Optional[dict]:
    """Get budget for a specific month."""
    ensure_dirs()
    filepath = BUDGETS_DIR / month_to_filename(month)
    if not filepath.exists():
        return None
    with open(filepath, "r") as f:
        return json.load(f)


def save_budget(budget: dict) -> dict:
    """Save or update a budget."""
    ensure_dirs()
    month = budget["month"]
    budget["updated_at"] = datetime.now().isoformat()

    filepath = BUDGETS_DIR / month_to_filename(month)
    with open(filepath, "w") as f:
        json.dump(budget, f, indent=2)

    return budget


def get_all_budgets() -> list[dict]:
    """Get all budgets."""
    ensure_dirs()
    budgets = []
    for filepath in sorted(BUDGETS_DIR.glob("*.json"), reverse=True):
        with open(filepath, "r") as f:
            budgets.append(json.load(f))
    return budgets


# ============ ACCOUNTS ============

def get_all_accounts() -> list[dict]:
    """Get all accounts."""
    ensure_dirs()
    filepath = ACCOUNTS_DIR / "accounts.json"
    if not filepath.exists():
        return []
    with open(filepath, "r") as f:
        return json.load(f)


def save_account(account: dict) -> dict:
    """Save a new account."""
    ensure_dirs()

    if not account.get("id"):
        account["id"] = str(uuid.uuid4())[:8]

    now = datetime.now().isoformat()
    account["created_at"] = now
    account["updated_at"] = now

    accounts = get_all_accounts()
    accounts.append(account)

    filepath = ACCOUNTS_DIR / "accounts.json"
    with open(filepath, "w") as f:
        json.dump(accounts, f, indent=2)

    return account


def update_account(account_id: str, updates: dict) -> Optional[dict]:
    """Update an account."""
    ensure_dirs()
    accounts = get_all_accounts()

    for i, a in enumerate(accounts):
        if a.get("id") == account_id:
            for key, value in updates.items():
                if value is not None:
                    a[key] = value
            a["updated_at"] = datetime.now().isoformat()
            accounts[i] = a

            filepath = ACCOUNTS_DIR / "accounts.json"
            with open(filepath, "w") as f:
                json.dump(accounts, f, indent=2)

            return a

    return None


def delete_account(account_id: str) -> bool:
    """Delete an account."""
    ensure_dirs()
    accounts = get_all_accounts()

    for i, a in enumerate(accounts):
        if a.get("id") == account_id:
            accounts.pop(i)
            filepath = ACCOUNTS_DIR / "accounts.json"
            with open(filepath, "w") as f:
                json.dump(accounts, f, indent=2)
            return True

    return False


# ============ REPORTS ============

def get_transactions_for_month(month: str) -> list[dict]:
    """Get all transactions for a specific month."""
    ensure_dirs()
    all_transactions = []

    # Month format: YYYY-MM
    for filepath in TRANSACTIONS_DIR.glob(f"{month}-*.json"):
        with open(filepath, "r") as f:
            all_transactions.extend(json.load(f))

    return all_transactions


def generate_monthly_report(month: str) -> dict:
    """Generate a monthly financial report."""
    transactions = get_transactions_for_month(month)
    budget = get_budget(month)

    total_income = 0.0
    total_expenses = 0.0
    by_category: dict[str, float] = {}

    for t in transactions:
        amount = t.get("amount", 0)
        category = t.get("category", "Uncategorized")
        trans_type = t.get("type", "expense")

        if trans_type == "income":
            total_income += amount
        elif trans_type == "expense":
            total_expenses += amount
            by_category[category] = by_category.get(category, 0) + amount

    report = {
        "month": month,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net": total_income - total_expenses,
        "by_category": by_category
    }

    # Add budget comparison if budget exists
    if budget:
        budget_comparison = {}
        for category, budgeted in budget.get("categories", {}).items():
            spent = by_category.get(category, 0)
            budget_comparison[category] = {
                "budgeted": budgeted,
                "spent": spent,
                "remaining": budgeted - spent,
                "percent_used": (spent / budgeted * 100) if budgeted > 0 else 0
            }
        report["budget_comparison"] = budget_comparison

    return report
