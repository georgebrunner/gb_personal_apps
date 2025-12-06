# GB Personal Apps - Development Plan

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Project Overview

This document outlines the development plan for GB Personal Apps, a suite of personal tracking applications.

### 1.1 Applications

| App | Purpose | Status |
|-----|---------|--------|
| GB Health | Health metrics and journaling | MVP Complete |
| GB Guitar | Guitar practice tracking | Not Started |
| Shared Services | Email integration, backups | Not Started |

### 1.2 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GB Personal Apps                          │
├─────────────────────────────────────────────────────────────┤
│  GB Health          │  GB Guitar          │  Shared         │
│  ├── frontend/      │  ├── frontend/      │  ├── email/     │
│  ├── backend/       │  ├── backend/       │  └── backup/    │
│  └── data/          │  └── data/          │                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Development Phases

### Phase 1: GB Health MVP ✅ COMPLETE

**Objective:** Replace OneNote health tracking with dedicated app

**Deliverables:**
- [x] Project structure setup
- [x] FastAPI backend with file storage
- [x] React PWA frontend
- [x] Daily entry form (weight, BP, glucose, etc.)
- [x] Exercise log form
- [x] Entry history view
- [x] Goal progress display
- [x] PWA configuration for iPhone

**Technical Stack:**
- Frontend: React 18 + TypeScript + Vite
- Backend: Python 3 + FastAPI
- Storage: JSON files
- PWA: vite-plugin-pwa

---

### Phase 2: GB Health Enhancements

**Objective:** Add visualizations and data management features

**Deliverables:**
| Feature | Description | Priority |
|---------|-------------|----------|
| Weight chart | Line chart showing weight over time | High |
| Glucose chart | Line chart with target zone indicator | High |
| BP chart | Dual-line chart (systolic/diastolic) | Medium |
| Weekly summary | Auto-generated MD file each week | Medium |
| Data export | Export to CSV and JSON | Medium |
| Date picker | Navigate to past entries | Low |
| Edit past entries | Modify historical data | Low |

**Technical Approach:**
- Use Chart.js or Recharts for visualizations
- Add `/weekly` endpoint to generate summaries
- Add export buttons to history page

---

### Phase 3: GB Guitar MVP

**Objective:** Build guitar practice tracking application

**Deliverables:**
| Feature | Description | Priority |
|---------|-------------|----------|
| Practice log | Date, duration, focus area, notes | High |
| Song tracker | Song library with status tracking | High |
| Practice history | List of recent sessions | High |
| Streak tracking | Consecutive days practiced | High |
| Skills checklist | Track chord/technique progress | Medium |
| Weekly stats | Practice time summaries | Medium |

**Technical Approach:**
- Copy GB Health structure as starting point
- Modify models for guitar-specific data
- Add streak calculation logic

**Data Models:**
```python
# Practice Session
{
  "date": "2025-12-06",
  "duration_minutes": 30,
  "focus_area": "Fingerpicking",
  "what_worked_on": "Fire and Rain intro",
  "difficulty": 3,
  "notes": "Getting smoother on transitions"
}

# Song
{
  "id": "uuid",
  "name": "Fire and Rain",
  "artist": "James Taylor",
  "difficulty": "Intermediate",
  "status": "Learning",  # Want to Learn, Learning, Can Play, Mastered
  "progress": 40,
  "notes": "Working on fingerpicking pattern",
  "file_path": "C:/Users/.../Guitar Resources/Fire and Rain.docx"
}

# Skills
{
  "chords": {
    "open_chords": true,
    "barre_chords": false,
    "power_chords": false
  },
  "techniques": {
    "strumming": true,
    "fingerpicking": false
  }
}
```

---

### Phase 4: Integrations

**Objective:** Connect apps to external services

#### 4.1 Email-to-App Integration

**How it works:**
1. Create email aliases (gbhealth@, gbguitar@)
2. Add routing rules to existing email service
3. Email parser writes to app data folders
4. App displays captured notes

**Files to create:**
- `shared/integrations/email_handler.py`
- Routing rules in email service config

**Example routing rule:**
```yaml
- name: "gb_health_notes"
  conditions:
    - field: "any_recipient"
      operator: "contains"
      value: "gbhealth@acumenanalytics.com"
  action:
    handler: "gb_personal_handler"
    app: "health"
```

#### 4.2 Remote Access (Cloudflare Tunnel)

**Steps:**
1. Install cloudflared on laptop
2. Create tunnel for localhost:5173 and localhost:8000
3. Add basic authentication
4. Access from anywhere

#### 4.3 S3 Backup (Guitar only)

**How it works:**
- Scheduled backup of gb-guitar/data/ to S3
- Use existing AWS credentials from environment
- Daily sync, keep 30 days of history

---

## 3. Technical Standards

### 3.1 Code Organization

```
app-name/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api.ts         # API client
│   │   ├── App.tsx        # Main app
│   │   └── index.css      # Styles
│   ├── public/            # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app
│   │   ├── models.py      # Pydantic models
│   │   └── storage.py     # File operations
│   └── requirements.txt
├── data/                   # JSON/MD data files
└── start.bat              # Launch script
```

### 3.2 API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /{resource} | List resources |
| GET | /{resource}/{id} | Get single resource |
| POST | /{resource} | Create/update resource |
| DELETE | /{resource}/{id} | Delete resource |

### 3.3 Data Storage

- One JSON file per day for daily logs
- Single JSON file for collections (songs, skills)
- MD files for summaries and notes
- Files named by date: `2025-12-06.json`

### 3.4 Frontend Patterns

- Functional components with hooks
- TypeScript for type safety
- CSS in single index.css (no CSS-in-JS)
- Mobile-first responsive design

---

## 4. Development Workflow

### 4.1 Running Locally

```bash
# GB Health
cd gb-health
./start.bat

# Or manually:
# Terminal 1
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
cd frontend && npm run dev
```

### 4.2 Testing on iPhone

1. Find laptop IP: `ipconfig` → look for IPv4 Address
2. Ensure laptop and iPhone on same WiFi
3. Open `http://LAPTOP_IP:5173` in Safari
4. Add to Home Screen for PWA experience

### 4.3 Adding New Features

1. Update requirements doc if needed
2. Add backend endpoint (models.py, storage.py, main.py)
3. Add frontend component
4. Test locally
5. Test on iPhone

---

## 5. Risk Management

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss | High | Regular manual backups, S3 sync for guitar |
| iPhone can't connect | Medium | Document IP setup, add troubleshooting guide |
| Feature creep | Medium | Stick to requirements, MVP first |
| Motivation loss | Medium | Keep it simple, use daily |

---

## 6. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Daily usage | 7 days/week | Check data files |
| Entry time | < 60 seconds | Self-observation |
| Weight trend | Decreasing | Chart visualization |
| Alcohol-free days | 5+/week | History count |
| Guitar practice | 4+ days/week | Streak tracker |

---

## 7. Future Considerations

Things intentionally deferred:
- Apple Health integration (complex, needs research)
- Native mobile apps (PWA is good enough)
- Multi-user support (personal use only)
- Cloud database (files are simpler)
- Dark mode (not wanted)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial development plan |
