# GB Finance - Requirements Document

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Overview

GB Finance is a personal bill and payment tracking application designed to replace OneNote-based tracking with a purpose-built, mobile-friendly solution.

### 1.1 Purpose

Track credit card bills, payments, and due dates to:
- Never miss a payment due date
- Track payment history with confirmation numbers
- Monitor balances and minimum payments across accounts
- View upcoming bills at a glance
- Track FICO score changes over time

### 1.2 Users

Primary user: George Brunner
- Devices: Windows laptop, iPhone
- Usage: Weekly bill review, payment logging after each payment

---

## 2. Accounts to Track

### 2.1 Credit Cards

| Account | Institution | Notes |
|---------|-------------|-------|
| Visa Classic Contactless-0576 | Trumark | Primary |
| Costco Card | Citibank | |
| Aviator Red Mastercard | Barclay's | AAdvantage miles |
| Credit Card | Police and Fire FCU (PFFCU) | |
| Credit Card | Home Depot | Store card |

### 2.2 Bank Accounts (Phase 2)

| Account | Institution | Notes |
|---------|-------------|-------|
| Checking | PFFCU | Primary checking |

---

## 3. Functional Requirements

### 3.1 Account Management (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| AM-001 | Add credit card account | Form | P0 |
| AM-002 | Store account nickname | Text | P0 |
| AM-003 | Store institution name | Text | P0 |
| AM-004 | Store last 4 digits of card | Text | P0 |
| AM-005 | Store credit limit | Number | P1 |
| AM-006 | Edit account details | Form | P0 |
| AM-007 | Archive/delete account | Button | P1 |

### 3.2 Bill Entry (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| BE-001 | Select account | Select | P0 |
| BE-002 | Enter statement date | Date | P0 |
| BE-003 | Enter statement balance | Currency | P0 |
| BE-004 | Enter minimum payment due | Currency | P0 |
| BE-005 | Enter payment due date | Date | P0 |
| BE-006 | Enter available credit | Currency | P1 |
| BE-007 | Enter past due amount | Currency | P1 |
| BE-008 | Enter interest charged | Currency | P2 |
| BE-009 | Enter fees charged | Currency | P2 |
| BE-010 | Add notes | Text | P1 |
| BE-011 | Save bill entry | Button | P0 |

### 3.3 Payment Logging (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| PL-001 | Select account | Select | P0 |
| PL-002 | Enter payment date | Date | P0 |
| PL-003 | Enter payment amount | Currency | P0 |
| PL-004 | Enter confirmation number | Text | P0 |
| PL-005 | Select payment method | Select | P1 |
| PL-006 | Mark as scheduled vs completed | Toggle | P1 |
| PL-007 | Add notes | Text | P1 |
| PL-008 | Save payment | Button | P0 |

**Payment Method Options:**
- Bank Transfer (ACH)
- Debit Card
- Check
- Auto-Pay
- Other

### 3.4 Dashboard (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| DB-001 | Show upcoming due dates (next 30 days) | List | P0 |
| DB-002 | Highlight overdue bills | Alert | P0 |
| DB-003 | Show total minimum payments due | Summary | P0 |
| DB-004 | Show total balances across accounts | Summary | P0 |
| DB-005 | Quick-add payment button per account | Button | P0 |
| DB-006 | Show days until next due date | Counter | P1 |
| DB-007 | Color-code by urgency | Visual | P1 |

### 3.5 Account Detail View (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| AD-001 | Show current balance | Display | P0 |
| AD-002 | Show credit limit | Display | P1 |
| AD-003 | Show credit utilization % | Calculated | P1 |
| AD-004 | Show payment history | List | P0 |
| AD-005 | Show bill history | List | P0 |
| AD-006 | Show next due date | Display | P0 |

### 3.6 FICO Score Tracking (Phase 2)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| FS-001 | Enter FICO score | Number | P1 |
| FS-002 | Select score source (Equifax, etc.) | Select | P1 |
| FS-003 | Enter date of score | Date | P1 |
| FS-004 | View score history | List | P1 |
| FS-005 | Show score trend chart | Chart | P2 |

**Score Sources:**
- Equifax
- Experian
- TransUnion
- Credit Karma
- Bank/Card Provider

### 3.7 Reports & History (Phase 2)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| RH-001 | View all payments for date range | Report | P1 |
| RH-002 | View payment history by account | Report | P1 |
| RH-003 | Export payment history to CSV | Export | P2 |
| RH-004 | Monthly summary view | Report | P2 |

### 3.8 Notifications (Phase 3)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| NT-001 | Email reminder X days before due | Notification | P2 |
| NT-002 | Configurable reminder days | Setting | P2 |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PF-001 | Dashboard load time | < 2 seconds |
| PF-002 | Save response | < 1 second |
| PF-003 | Load account history | < 500ms |

### 4.2 Usability

| ID | Requirement | Target |
|----|-------------|--------|
| UX-001 | Log a payment | < 30 seconds |
| UX-002 | View upcoming bills | Immediate (dashboard) |
| UX-003 | Mobile touch targets | >= 44px |
| UX-004 | Currency input | Auto-format |

### 4.3 Security

| ID | Requirement | Target |
|----|-------------|--------|
| SE-001 | Data storage | Local filesystem only |
| SE-002 | No full account numbers | Last 4 digits only |
| SE-003 | No passwords stored | Never store login credentials |
| SE-004 | Network access | Local network only (MVP) |
| SE-005 | No cloud storage | Financial data never uploaded |
| SE-006 | No analytics | Zero third-party tracking |

---

## 5. Data Requirements

### 5.1 Account Schema

```json
{
  "id": "uuid-1234",
  "nickname": "Trumark Visa",
  "institution": "Trumark",
  "card_type": "Visa",
  "last_four": "0576",
  "credit_limit": 11000.00,
  "is_active": true,
  "notes": "",
  "created_at": "2025-12-06T10:00:00",
  "updated_at": "2025-12-06T10:00:00"
}
```

### 5.2 Bill Schema

```json
{
  "id": "uuid-5678",
  "account_id": "uuid-1234",
  "statement_date": "2025-11-15",
  "due_date": "2025-12-10",
  "statement_balance": 10689.45,
  "minimum_payment": 478.00,
  "available_credit": 310.00,
  "past_due_amount": 0.00,
  "interest_charged": 221.16,
  "fees_charged": 0.00,
  "notes": "",
  "created_at": "2025-11-16T08:00:00"
}
```

### 5.3 Payment Schema

```json
{
  "id": "uuid-9012",
  "account_id": "uuid-1234",
  "payment_date": "2025-12-01",
  "amount": 478.00,
  "confirmation_number": "I1DZF3KGYT",
  "payment_method": "Bank Transfer (ACH)",
  "status": "completed",
  "notes": "Paid minimum",
  "created_at": "2025-12-01T14:30:00"
}
```

### 5.4 FICO Score Schema

```json
{
  "id": "uuid-3456",
  "score": 600,
  "source": "Equifax",
  "date": "2025-03-01",
  "notes": "From Citibank statement",
  "created_at": "2025-03-03T10:00:00"
}
```

### 5.5 Storage Structure

```
gb-finance/data/
├── accounts.json          (all accounts)
├── bills/
│   ├── 2025-12.json       (bills by month)
│   └── ...
├── payments/
│   ├── 2025-12.json       (payments by month)
│   └── ...
└── fico-scores.json       (score history)
```

---

## 6. User Interface Requirements

### 6.1 Screens

| Screen | Purpose | Priority |
|--------|---------|----------|
| Dashboard | Upcoming bills, quick actions | P0 |
| Accounts | Manage accounts | P0 |
| Account Detail | View account history | P0 |
| Log Payment | Record a payment | P0 |
| Enter Bill | Record statement details | P0 |
| FICO Scores | Track credit score | P1 |
| History | Payment/bill history | P1 |
| Settings | Configure app | P2 |

### 6.2 Design Guidelines

- Match GB Health/Guitar aesthetic
- Light theme only
- Mobile-first responsive
- Primary color: Indigo (#4F46E5)
- Accent color for alerts: Red for overdue, Yellow for due soon, Green for paid
- Currency formatting: $1,234.56
- Date formatting: Month Day, Year (Dec 10, 2025)

### 6.3 Dashboard Layout

```
+----------------------------------+
|  GB Finance              [+ Pay] |
+----------------------------------+
|  Total Due This Month: $1,418.21 |
|  Total Balances: $23,456.78      |
+----------------------------------+
|  UPCOMING BILLS                  |
|  +--------------------------+    |
|  | Trumark Visa        [Pay]|    |
|  | $478.00 due Dec 10       |    |
|  | 4 days                   |    |
|  +--------------------------+    |
|  | Citibank Costco     [Pay]|    |
|  | $460.00 due Dec 16       |    |
|  | 10 days                  |    |
|  +--------------------------+    |
|  | OVERDUE                  |    |
|  | Barclay Aviator     [Pay]|    |
|  | $376.58 past due         |    |
|  +--------------------------+    |
+----------------------------------+
|  [Dashboard] [Accounts] [History]|
+----------------------------------+
```

### 6.4 Navigation

- Tab-based: Dashboard, Accounts, History
- Modal for Log Payment / Enter Bill
- Single-page application

---

## 7. Acceptance Criteria

### 7.1 MVP Complete When:

- [ ] Can add/edit credit card accounts
- [ ] Can enter bill/statement details
- [ ] Can log payments with confirmation numbers
- [ ] Dashboard shows upcoming due dates
- [ ] Dashboard highlights overdue bills
- [ ] Can view payment history per account
- [ ] Works on iPhone (PWA)
- [ ] Data persists after closing app

### 7.2 Phase 2 Complete When:

- [ ] Can track FICO scores over time
- [ ] Credit utilization displays per account
- [ ] Can export payment history to CSV
- [ ] Monthly summary view available

### 7.3 Phase 3 Complete When:

- [ ] Email reminders before due dates
- [ ] Configurable reminder settings

---

## 8. Technical Constraints

| Constraint | Description |
|------------|-------------|
| Frontend | React 18 + TypeScript |
| Backend | Python 3.10+ + FastAPI |
| Storage | JSON files (no database) |
| Hosting | Local server |
| Platform | Windows (primary), PWA (iPhone) |

---

## 9. Out of Scope (Not Planned)

- Automatic bill import from banks
- Automatic payment scheduling
- Full account number storage
- Password/login credential storage
- Budget tracking
- Expense categorization
- Investment tracking
- Bank account balance tracking (MVP)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial requirements |
