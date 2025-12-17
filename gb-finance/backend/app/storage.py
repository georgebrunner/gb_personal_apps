"""
Storage module for GB Finance - works with both local files and S3.
"""

import sys
from datetime import date, datetime
from pathlib import Path
from typing import Optional
import uuid

# Add shared module to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "shared"))
from storage import get_storage

# Initialize storage
_storage = get_storage("finance", str(Path(__file__).parent.parent.parent / "data"))


# ============ TRANSACTIONS ============

def get_transactions_for_date(d: date) -> list[dict]:
    """Get all transactions for a specific date."""
    key = f"transactions/{d.isoformat()}.json"
    return _storage.read_json(key) or []


def get_all_transactions(limit: int = 100) -> list[dict]:
    """Get recent transactions across all dates."""
    keys = _storage.list_keys("transactions/", ".json")
    keys = sorted(keys, reverse=True)

    all_transactions = []
    for key in keys:
        if len(all_transactions) >= limit:
            break
        transactions = _storage.read_json(key) or []
        all_transactions.extend(transactions)

    # Sort by date descending, then by created_at descending
    all_transactions.sort(key=lambda x: (x.get("date", ""), x.get("created_at", "")), reverse=True)
    return all_transactions[:limit]


def save_transaction(transaction: dict) -> dict:
    """Save a new transaction."""
    if not transaction.get("id"):
        transaction["id"] = str(uuid.uuid4())[:8]

    now = datetime.now().isoformat()
    transaction["created_at"] = now
    transaction["updated_at"] = now

    trans_date = transaction["date"]
    if isinstance(trans_date, date):
        trans_date = trans_date.isoformat()
    transaction["date"] = trans_date

    key = f"transactions/{trans_date}.json"
    existing = _storage.read_json(key) or []
    existing.append(transaction)
    _storage.write_json(key, existing)

    return transaction


def get_transaction(transaction_id: str) -> Optional[dict]:
    """Get a specific transaction by ID."""
    keys = _storage.list_keys("transactions/", ".json")
    for key in keys:
        transactions = _storage.read_json(key) or []
        for t in transactions:
            if t.get("id") == transaction_id:
                return t
    return None


def update_transaction(transaction_id: str, updates: dict) -> Optional[dict]:
    """Update an existing transaction."""
    keys = _storage.list_keys("transactions/", ".json")

    for key in keys:
        transactions = _storage.read_json(key) or []

        for i, t in enumerate(transactions):
            if t.get("id") == transaction_id:
                # Apply updates
                for k, value in updates.items():
                    if value is not None:
                        if isinstance(value, date):
                            value = value.isoformat()
                        t[k] = value
                t["updated_at"] = datetime.now().isoformat()
                transactions[i] = t

                # Check if date changed - need to move to different file
                new_date = t.get("date")
                old_date = key.split("/")[-1].replace(".json", "")

                if new_date != old_date:
                    # Remove from old file
                    transactions.pop(i)
                    if transactions:
                        _storage.write_json(key, transactions)
                    else:
                        _storage.delete(key)

                    # Add to new file
                    new_key = f"transactions/{new_date}.json"
                    new_transactions = _storage.read_json(new_key) or []
                    new_transactions.append(t)
                    _storage.write_json(new_key, new_transactions)
                else:
                    _storage.write_json(key, transactions)

                return t

    return None


def delete_transaction(transaction_id: str) -> bool:
    """Delete a transaction by ID."""
    keys = _storage.list_keys("transactions/", ".json")

    for key in keys:
        transactions = _storage.read_json(key) or []

        for i, t in enumerate(transactions):
            if t.get("id") == transaction_id:
                transactions.pop(i)
                if transactions:
                    _storage.write_json(key, transactions)
                else:
                    _storage.delete(key)
                return True

    return False


# ============ BUDGETS ============

def get_budget(month: str) -> Optional[dict]:
    """Get budget for a specific month."""
    key = f"budgets/{month}.json"
    return _storage.read_json(key)


def save_budget(budget: dict) -> dict:
    """Save or update a budget."""
    month = budget["month"]
    budget["updated_at"] = datetime.now().isoformat()
    key = f"budgets/{month}.json"
    _storage.write_json(key, budget)
    return budget


def get_all_budgets() -> list[dict]:
    """Get all budgets."""
    keys = _storage.list_keys("budgets/", ".json")
    keys = sorted(keys, reverse=True)

    budgets = []
    for key in keys:
        data = _storage.read_json(key)
        if data:
            budgets.append(data)
    return budgets


# ============ ACCOUNTS ============

def get_all_accounts() -> list[dict]:
    """Get all accounts."""
    return _storage.read_json("accounts/accounts.json") or []


def save_account(account: dict) -> dict:
    """Save a new account."""
    if not account.get("id"):
        account["id"] = str(uuid.uuid4())[:8]

    now = datetime.now().isoformat()
    account["created_at"] = now
    account["updated_at"] = now

    accounts = get_all_accounts()
    accounts.append(account)
    _storage.write_json("accounts/accounts.json", accounts)

    return account


def update_account(account_id: str, updates: dict) -> Optional[dict]:
    """Update an account."""
    accounts = get_all_accounts()

    for i, a in enumerate(accounts):
        if a.get("id") == account_id:
            for key, value in updates.items():
                if value is not None:
                    a[key] = value
            a["updated_at"] = datetime.now().isoformat()
            accounts[i] = a
            _storage.write_json("accounts/accounts.json", accounts)
            return a

    return None


def delete_account(account_id: str) -> bool:
    """Delete an account."""
    accounts = get_all_accounts()

    for i, a in enumerate(accounts):
        if a.get("id") == account_id:
            accounts.pop(i)
            _storage.write_json("accounts/accounts.json", accounts)
            return True

    return False


# ============ REPORTS ============

def get_transactions_for_month(month: str) -> list[dict]:
    """Get all transactions for a specific month."""
    # Month format: YYYY-MM
    keys = _storage.list_keys("transactions/", ".json")
    all_transactions = []

    for key in keys:
        # Key format: transactions/2025-12-14.json
        filename = key.split("/")[-1].replace(".json", "")
        if filename.startswith(month):
            transactions = _storage.read_json(key) or []
            all_transactions.extend(transactions)

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
