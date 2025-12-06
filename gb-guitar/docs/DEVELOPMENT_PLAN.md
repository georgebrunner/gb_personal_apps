# GB Guitar - Development Plan

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Project Status

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: MVP | Not Started | 0% |
| Phase 2: Skills & Reference | Not Started | 0% |
| Phase 3: Integrations | Not Started | 0% |

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GB Guitar Frontend                        │
│                    (React + TypeScript)                      │
├─────────────────────────────────────────────────────────────┤
│  App.tsx                                                     │
│  ├── PracticeForm.tsx      (Log practice sessions)          │
│  ├── SongList.tsx          (Song library management)        │
│  ├── SongForm.tsx          (Add/edit songs)                 │
│  ├── History.tsx           (Practice history + stats)       │
│  ├── Skills.tsx            (Skills checklist) [Phase 2]     │
│  └── Reference.tsx         (Resources links) [Phase 2]      │
├─────────────────────────────────────────────────────────────┤
│  api.ts                    (API client)                      │
│  index.css                 (Styles - copy from GB Health)    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP (localhost:8001)
┌─────────────────────────────────────────────────────────────┐
│                    GB Guitar Backend                         │
│                    (Python + FastAPI)                        │
├─────────────────────────────────────────────────────────────┤
│  main.py                   (API routes)                      │
│  models.py                 (Pydantic schemas)                │
│  storage.py                (File operations)                 │
│  stats.py                  (Streak/time calculations)        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ File I/O
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                              │
│                    (JSON files)                              │
├─────────────────────────────────────────────────────────────┤
│  data/practice-log/2025-12-06.json                          │
│  data/songs.json                                            │
│  data/skills.json                                           │
│  data/stats.json                                            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 API Endpoints

| Method | Endpoint | Description | Phase |
|--------|----------|-------------|-------|
| GET | / | Health check | 1 |
| POST | /practice | Log practice session | 1 |
| GET | /practice | List practice sessions | 1 |
| GET | /practice/{date} | Get sessions by date | 1 |
| GET | /stats | Get streak and totals | 1 |
| GET | /songs | List all songs | 1 |
| POST | /songs | Add new song | 1 |
| PUT | /songs/{id} | Update song | 1 |
| DELETE | /songs/{id} | Delete song | 1 |
| GET | /skills | Get skills checklist | 2 |
| PUT | /skills | Update skills | 2 |

---

## 3. Phase 1: MVP

### 3.1 Tasks

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 1 | Copy project structure | Clone gb-health as starting point | Small |
| 2 | Update models | PracticeSession, Song schemas | Small |
| 3 | Update storage | Practice log, songs.json operations | Medium |
| 4 | Add stats module | Streak calculation, time aggregation | Medium |
| 5 | Create PracticeForm | Form to log sessions | Medium |
| 6 | Create SongList | View/filter songs | Medium |
| 7 | Create SongForm | Add/edit songs | Small |
| 8 | Create History | Practice history + stats display | Medium |
| 9 | Update App.tsx | New navigation tabs | Small |
| 10 | Pre-populate songs | Add starter song library | Small |
| 11 | Test on iPhone | Verify PWA works | Small |

### 3.2 Backend Implementation

**models.py:**
```python
from pydantic import BaseModel
from typing import Optional
from datetime import date
from uuid import UUID

class PracticeSession(BaseModel):
    date: date
    duration_minutes: int
    focus_area: str  # Chords, Scales, Songs, Techniques, Theory, Other
    what_worked_on: str
    difficulty: Optional[int] = None  # 1-5
    notes: Optional[str] = None

class Song(BaseModel):
    id: Optional[UUID] = None
    name: str
    artist: str
    difficulty: str  # Easy, Medium, Hard
    status: str  # Want to Learn, Learning, Can Play, Mastered
    progress: int = 0  # 0-100
    notes: Optional[str] = None
    resource_path: Optional[str] = None

class Stats(BaseModel):
    current_streak: int
    longest_streak: int
    total_practice_minutes: int
    practice_days_this_week: int
    practice_days_this_month: int
    minutes_this_week: int
    minutes_this_month: int
```

**stats.py (key function):**
```python
def calculate_streak(practice_dates: list[date]) -> int:
    """Calculate current consecutive practice day streak."""
    if not practice_dates:
        return 0

    sorted_dates = sorted(set(practice_dates), reverse=True)
    today = date.today()

    # Must have practiced today or yesterday to have active streak
    if sorted_dates[0] < today - timedelta(days=1):
        return 0

    streak = 1
    for i in range(len(sorted_dates) - 1):
        if sorted_dates[i] - sorted_dates[i+1] == timedelta(days=1):
            streak += 1
        else:
            break

    return streak
```

### 3.3 Frontend Implementation

**PracticeForm.tsx key elements:**
- Date picker (defaults to today)
- Duration input (minutes)
- Focus area dropdown
- What worked on (text area)
- Difficulty slider (1-5, optional)
- Notes textarea
- Save button

**SongList.tsx key elements:**
- List of songs grouped by status
- Progress bar per song
- Filter buttons (All, Learning, Want to Learn, etc.)
- Click to edit
- Add new song button

**History.tsx key elements:**
- Current streak (large, prominent)
- This week: X days, Y minutes
- This month: X days, Y minutes
- Recent sessions list
- Songs in progress summary

### 3.4 Files to Create

| File | Description |
|------|-------------|
| `backend/app/__init__.py` | Package marker |
| `backend/app/main.py` | FastAPI routes |
| `backend/app/models.py` | Pydantic schemas |
| `backend/app/storage.py` | File operations |
| `backend/app/stats.py` | Statistics calculations |
| `backend/requirements.txt` | Dependencies |
| `frontend/src/App.tsx` | Main app |
| `frontend/src/api.ts` | API client |
| `frontend/src/components/PracticeForm.tsx` | Practice logging |
| `frontend/src/components/SongList.tsx` | Song library |
| `frontend/src/components/SongForm.tsx` | Add/edit song |
| `frontend/src/components/History.tsx` | Stats + history |
| `frontend/package.json` | Dependencies |
| `frontend/vite.config.ts` | Vite + PWA |
| `start.bat` | Launch script |
| `data/songs.json` | Pre-populated songs |

### 3.5 Pre-populated Songs

```json
[
  {
    "id": "1",
    "name": "Fire and Rain",
    "artist": "James Taylor",
    "difficulty": "Intermediate",
    "status": "Want to Learn",
    "progress": 0,
    "notes": "Fingerpicking, chord transitions",
    "resource_path": "C:/Users/GeorgeBrunner/OneDrive/Guitar Resources/Fire and Rain.docx"
  },
  {
    "id": "2",
    "name": "Bad, Bad Leroy Brown",
    "artist": "Jim Croce",
    "difficulty": "Easy",
    "status": "Want to Learn",
    "progress": 0,
    "notes": "Fun strumming pattern"
  }
  // ... more songs from starter list
]
```

---

## 4. Phase 2: Skills & Reference

### 4.1 Tasks

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 1 | Create Skills component | Checkbox grid for skills | Medium |
| 2 | Add skills API | GET/PUT /skills endpoints | Small |
| 3 | Create Reference component | Links to resources | Small |
| 4 | Add chord diagrams | SVG or images | Medium |
| 5 | Add navigation tabs | Skills, Reference | Small |

### 4.2 Skills Component

Three columns of checkboxes:
- Chords (Open, Barre, Power, 7th, Advanced)
- Techniques (Transitions, Strumming, Fingerpicking, etc.)
- Theory (Fretboard, Scales, Keys)

Progress bar showing % complete per category.

### 4.3 Reference Component

Links to existing resources:
- JustinGuitar.com
- ChordHouse
- Metronome
- OneDrive folder link

Quick chord reference with common chord diagrams.

---

## 5. Phase 3: Integrations

### 5.1 Email-to-App

**How it works:**
1. Email to gbguitar@acumenanalytics.com
2. Email service parses and routes
3. Creates note in `data/notes/` folder
4. App displays in notes section

**Example email:**
```
To: gbguitar@acumenanalytics.com
Subject: Song idea - Landslide
Body: Heard this on the radio. Fleetwood Mac.
Fingerpicking pattern sounds manageable.
Look up tabs later.
```

**Result in data/notes/2025-12-06.json:**
```json
{
  "timestamp": "2025-12-06T14:30:00",
  "subject": "Song idea - Landslide",
  "body": "Heard this on the radio. Fleetwood Mac...",
  "source": "email"
}
```

### 5.2 S3 Backup

**Configuration:**
```python
# shared/integrations/s3_backup.py
import boto3
from pathlib import Path

def backup_guitar_data():
    s3 = boto3.client('s3')
    bucket = 'gb-personal-backup'

    data_dir = Path('gb-guitar/data')
    for file in data_dir.rglob('*.json'):
        s3.upload_file(str(file), bucket, f'guitar/{file.name}')
```

**Scheduled via Windows Task Scheduler:**
- Daily at midnight
- Run backup script

---

## 6. Testing Strategy

### 6.1 Manual Testing Checklist

**Practice Log:**
- [ ] Can log session with all fields
- [ ] Duration tracked correctly
- [ ] Multiple sessions per day work
- [ ] Form clears after save

**Songs:**
- [ ] Can add new song
- [ ] Can update status
- [ ] Can update progress
- [ ] Filter works
- [ ] Can delete song

**Stats:**
- [ ] Streak calculates correctly
- [ ] Week/month totals accurate
- [ ] Updates after new session

**iPhone:**
- [ ] All features work on touch
- [ ] PWA installs
- [ ] Streak visible on home

---

## 7. Deployment

### 7.1 Ports

| Service | Port | URL |
|---------|------|-----|
| GB Health Frontend | 5173 | http://localhost:5173 |
| GB Health Backend | 8000 | http://localhost:8000 |
| GB Guitar Frontend | 5174 | http://localhost:5174 |
| GB Guitar Backend | 8001 | http://localhost:8001 |

### 7.2 Start Script (start.bat)

```batch
@echo off
echo Starting GB Guitar...

start "GB Guitar Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"

timeout /t 3 /nobreak > nul

start "GB Guitar Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev -- --port 5174"

echo.
echo GB Guitar running on http://localhost:5174
pause
```

---

## 8. Development Sequence

Recommended order to build:

1. **Day 1: Backend Foundation**
   - Copy structure from gb-health
   - Implement models.py
   - Implement storage.py for practice sessions
   - Implement basic stats.py

2. **Day 2: Backend Complete**
   - Song CRUD operations
   - Stats calculations
   - All API endpoints working

3. **Day 3: Frontend Foundation**
   - Copy frontend structure
   - PracticeForm component
   - History component (basic)

4. **Day 4: Frontend Complete**
   - SongList component
   - SongForm component
   - Stats display in History
   - Pre-populated songs

5. **Day 5: Polish & Test**
   - iPhone testing
   - Bug fixes
   - Documentation update

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Practice frequency | 4+ days/week | Streak tracker |
| Session logging | < 30 seconds | Self-observation |
| Songs in progress | 3+ at a time | Song list |
| Streak maintenance | 7+ days | Stats |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial plan |
