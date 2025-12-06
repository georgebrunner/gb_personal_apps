# GB Finance - Development Plan

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## Overview

This document outlines the development phases for GB Finance, following the same architecture patterns established in GB Health and GB Guitar.

---

## Phase 1: MVP - Core Bill & Payment Tracking

### 1.1 Project Setup

- [ ] Create folder structure (frontend/, backend/, data/, docs/)
- [ ] Initialize React + TypeScript frontend with Vite
- [ ] Configure PWA manifest and service worker
- [ ] Set up Python FastAPI backend
- [ ] Create start.bat script
- [ ] Add to start-all.bat

### 1.2 Backend API

**Accounts Endpoints:**
- [ ] `GET /api/accounts` - List all accounts
- [ ] `POST /api/accounts` - Create account
- [ ] `PUT /api/accounts/{id}` - Update account
- [ ] `DELETE /api/accounts/{id}` - Archive account

**Bills Endpoints:**
- [ ] `GET /api/bills` - List bills (with date range filter)
- [ ] `GET /api/bills/upcoming` - Get upcoming due dates
- [ ] `POST /api/bills` - Create bill entry
- [ ] `PUT /api/bills/{id}` - Update bill
- [ ] `DELETE /api/bills/{id}` - Delete bill

**Payments Endpoints:**
- [ ] `GET /api/payments` - List payments (with date range filter)
- [ ] `GET /api/payments/account/{id}` - Get payments for account
- [ ] `POST /api/payments` - Log payment
- [ ] `PUT /api/payments/{id}` - Update payment
- [ ] `DELETE /api/payments/{id}` - Delete payment

**Dashboard Endpoint:**
- [ ] `GET /api/dashboard` - Get dashboard summary (upcoming, overdue, totals)

### 1.3 Data Storage

- [ ] Create `data/accounts.json` with initial account structure
- [ ] Create `data/bills/` directory structure
- [ ] Create `data/payments/` directory structure
- [ ] Implement JSON file read/write utilities
- [ ] Add data validation

### 1.4 Frontend - Account Management

- [ ] Accounts list view
- [ ] Add account form (modal or page)
- [ ] Edit account form
- [ ] Delete/archive account confirmation

### 1.5 Frontend - Dashboard

- [ ] Dashboard layout with summary cards
- [ ] Total due this month display
- [ ] Total balances display
- [ ] Upcoming bills list (sorted by due date)
- [ ] Overdue bills section (highlighted)
- [ ] Quick "Log Payment" button per account
- [ ] Days until due counter

### 1.6 Frontend - Bill Entry

- [ ] Bill entry form
- [ ] Account selector
- [ ] Currency input formatting
- [ ] Date pickers
- [ ] Form validation
- [ ] Save confirmation

### 1.7 Frontend - Payment Logging

- [ ] Payment entry form (modal for quick access)
- [ ] Account selector
- [ ] Currency input formatting
- [ ] Confirmation number field
- [ ] Payment method selector
- [ ] Save confirmation
- [ ] Success message with details

### 1.8 Frontend - Account Detail

- [ ] Account detail page
- [ ] Current balance and credit limit display
- [ ] Credit utilization bar
- [ ] Payment history list
- [ ] Bill history list

### 1.9 Navigation & PWA

- [ ] Tab navigation (Dashboard, Accounts, History)
- [ ] Mobile-responsive design
- [ ] PWA install capability
- [ ] Offline indicator

---

## Phase 2: Enhanced Features

### 2.1 FICO Score Tracking

- [ ] `GET /api/fico-scores` - List scores
- [ ] `POST /api/fico-scores` - Add score
- [ ] FICO score entry form
- [ ] Score history list
- [ ] Score source selector (Equifax, Experian, etc.)

### 2.2 Credit Utilization

- [ ] Calculate utilization per account
- [ ] Calculate total utilization
- [ ] Visual utilization bar (color-coded)
- [ ] Utilization trend over time

### 2.3 History & Search

- [ ] Payment history view with filters
- [ ] Bill history view with filters
- [ ] Date range selector
- [ ] Account filter
- [ ] Search by confirmation number

### 2.4 Data Export

- [ ] Export payments to CSV
- [ ] Export bills to CSV
- [ ] Export accounts to CSV
- [ ] Date range selection for export

---

## Phase 3: Visualizations

### 3.1 Charts

- [ ] Balance trend chart (per account and total)
- [ ] Payment history chart
- [ ] FICO score trend chart
- [ ] Credit utilization trend

### 3.2 Calendar View

- [ ] Calendar showing due dates
- [ ] Calendar showing payment dates
- [ ] Color-coded by status

---

## Phase 4: Notifications (Future)

### 4.1 Email Reminders

- [ ] Configure reminder days before due
- [ ] Email template for reminders
- [ ] Integration with email service
- [ ] Reminder preferences settings

---

## Technical Specifications

### Port Assignment

| App | Frontend Port | Backend Port |
|-----|--------------|--------------|
| GB Health | 5173 | 8000 |
| GB Guitar | 5174 | 8001 |
| GB Finance | 5175 | 8002 |

### File Structure

```
gb-finance/
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AccountList.tsx
│   │   │   ├── AccountForm.tsx
│   │   │   ├── AccountDetail.tsx
│   │   │   ├── BillForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── UpcomingBills.tsx
│   │   │   └── History.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── api/
│   │       └── client.ts
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── storage.py
│   │   └── routes/
│   │       ├── accounts.py
│   │       ├── bills.py
│   │       ├── payments.py
│   │       └── dashboard.py
│   └── requirements.txt
├── data/
│   ├── accounts.json
│   ├── bills/
│   ├── payments/
│   └── fico-scores.json
├── docs/
│   ├── REQUIREMENTS.md
│   └── DEVELOPMENT_PLAN.md
└── start.bat
```

### Dependencies

**Frontend (package.json):**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

**Backend (requirements.txt):**
```
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.5.0
python-dateutil>=2.8.0
```

---

## UI Color Coding

| Status | Color | Use |
|--------|-------|-----|
| Overdue | Red (#EF4444) | Past due bills |
| Due Soon (≤7 days) | Yellow (#F59E0B) | Urgent attention |
| Due Later (>7 days) | Green (#10B981) | On track |
| Paid | Gray (#6B7280) | Completed payments |

---

## Acceptance Criteria

### MVP Complete When:

- [ ] Can add and manage credit card accounts
- [ ] Can enter bill/statement details
- [ ] Can log payments with confirmation numbers
- [ ] Dashboard shows upcoming due dates sorted by urgency
- [ ] Dashboard highlights overdue bills in red
- [ ] Can view payment history per account
- [ ] Works on iPhone via Edge browser (PWA)
- [ ] Data persists in local JSON files

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial development plan |
