# GB Health - Development Plan

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Project Status

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: MVP | ✅ Complete | 100% |
| Phase 2: Visualizations | Not Started | 0% |
| Phase 3: Data Management | Not Started | 0% |
| Phase 4: Integrations | Not Started | 0% |

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GB Health Frontend                        │
│                    (React + TypeScript)                      │
├─────────────────────────────────────────────────────────────┤
│  App.tsx                                                     │
│  ├── DailyEntryForm.tsx    (Daily metrics input)            │
│  ├── ExerciseForm.tsx      (Exercise logging)               │
│  └── EntryList.tsx         (History + goal progress)        │
├─────────────────────────────────────────────────────────────┤
│  api.ts                    (API client)                      │
│  index.css                 (Styles)                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP (localhost:8000)
┌─────────────────────────────────────────────────────────────┐
│                    GB Health Backend                         │
│                    (Python + FastAPI)                        │
├─────────────────────────────────────────────────────────────┤
│  main.py                   (API routes)                      │
│  models.py                 (Pydantic schemas)                │
│  storage.py                (File operations)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ File I/O
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                              │
│                    (JSON files)                              │
├─────────────────────────────────────────────────────────────┤
│  data/daily/2025-12-06.json                                 │
│  data/exercises/2025-12-06.json                             │
│  data/weekly/2025-W49.md                                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | / | Health check | ✅ |
| GET | /health | Health check | ✅ |
| POST | /daily | Create/update daily entry | ✅ |
| GET | /daily | List daily entries | ✅ |
| GET | /daily/{date} | Get single entry | ✅ |
| GET | /daily/today | Get today's entry | ✅ |
| POST | /exercise | Log exercise | ✅ |
| GET | /exercise | List exercises | ✅ |
| GET | /exercise/{date} | Get exercises by date | ✅ |

---

## 3. Completed Work (Phase 1)

### 3.1 Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `backend/app/__init__.py` | Package marker | 1 |
| `backend/app/main.py` | FastAPI routes | ~100 |
| `backend/app/models.py` | Pydantic models | ~40 |
| `backend/app/storage.py` | File operations | ~90 |
| `backend/requirements.txt` | Dependencies | 4 |

### 3.2 Frontend Files

| File | Purpose | Lines |
|------|---------|-------|
| `frontend/src/App.tsx` | Main app, navigation | ~40 |
| `frontend/src/api.ts` | API client | ~60 |
| `frontend/src/main.tsx` | Entry point | ~10 |
| `frontend/src/index.css` | All styles | ~150 |
| `frontend/src/components/DailyEntryForm.tsx` | Daily form | ~200 |
| `frontend/src/components/ExerciseForm.tsx` | Exercise form | ~100 |
| `frontend/src/components/EntryList.tsx` | History view | ~130 |
| `frontend/vite.config.ts` | Vite + PWA config | ~35 |
| `frontend/package.json` | Dependencies | ~25 |

### 3.3 Configuration Files

| File | Purpose |
|------|---------|
| `start.bat` | Launch script |
| `frontend/index.html` | HTML template with PWA meta |
| `frontend/public/favicon.svg` | App icon |

---

## 4. Phase 2: Visualizations

### 4.1 Tasks

| Task | Description | Effort |
|------|-------------|--------|
| Install chart library | Add Recharts or Chart.js | Small |
| Weight chart component | Line chart, last 30 days | Medium |
| Glucose chart component | Line chart with target zone | Medium |
| BP chart component | Dual-line chart | Medium |
| Add Charts tab | New navigation item | Small |
| Sleep pattern chart | Bar chart by day of week | Small |

### 4.2 Technical Approach

**Recommended Library:** Recharts (React-native, lightweight)

**Weight Chart Example:**
```tsx
<LineChart data={entries}>
  <XAxis dataKey="date" />
  <YAxis domain={[190, 230]} />
  <Line dataKey="weight" stroke="#4F46E5" />
  <ReferenceLine y={200} stroke="green" label="Goal" />
</LineChart>
```

**Data Transformation:**
- Fetch last 30 daily entries
- Filter entries with weight values
- Sort by date ascending
- Pass to chart component

### 4.3 Files to Create/Modify

| Action | File | Changes |
|--------|------|---------|
| Create | `src/components/Charts.tsx` | New chart dashboard |
| Create | `src/components/WeightChart.tsx` | Weight visualization |
| Create | `src/components/GlucoseChart.tsx` | Glucose visualization |
| Modify | `src/App.tsx` | Add Charts tab |
| Modify | `package.json` | Add recharts dependency |

---

## 5. Phase 3: Data Management

### 5.1 Tasks

| Task | Description | Effort |
|------|-------------|--------|
| Export to JSON | Download all data as JSON | Small |
| Export to CSV | Download all data as CSV | Medium |
| Weekly summary | Auto-generate MD file | Medium |
| Date navigation | Pick date to view/edit | Medium |
| Edit past entries | Load and modify historical | Medium |

### 5.2 Technical Approach

**Export Implementation:**
- Backend endpoint: `GET /export?format=json|csv`
- Frontend: Download button triggers file download
- CSV: Use Python csv module, flatten nested data

**Weekly Summary:**
- Scheduled generation or on-demand
- Calculate averages, totals, streaks
- Write to `data/weekly/2025-W49.md`

### 5.3 Files to Create/Modify

| Action | File | Changes |
|--------|------|---------|
| Create | `backend/app/export.py` | Export logic |
| Create | `backend/app/summary.py` | Summary generation |
| Modify | `backend/app/main.py` | Add export endpoint |
| Create | `src/components/ExportButton.tsx` | Export UI |
| Modify | `src/components/EntryList.tsx` | Add date picker |

---

## 6. Phase 4: Integrations

### 6.1 Email-to-App

**Purpose:** Capture notes from anywhere via email

**Implementation Steps:**
1. Add routing rule to existing email service
2. Create handler that parses email body
3. Write to `data/notes/` folder
4. Display notes in app

**Configuration (routing_rules.yaml):**
```yaml
- name: "gb_health_notes"
  conditions:
    - field: "any_recipient"
      operator: "contains"
      value: "gbhealth@acumenanalytics.com"
  destination:
    handler: "gb_health_note_handler"
```

### 6.2 Remote Access

**Purpose:** Access from outside home network

**Implementation:**
1. Install Cloudflare Tunnel (cloudflared)
2. Create tunnel: `cloudflared tunnel create gb-health`
3. Configure: Route to localhost:5173 and localhost:8000
4. Add basic authentication

---

## 7. Testing Strategy

### 7.1 Manual Testing Checklist

**Daily Entry:**
- [ ] Can enter all fields
- [ ] Today's date auto-fills
- [ ] Existing entry loads on page open
- [ ] Save shows success message
- [ ] Data persists after refresh

**Exercise Log:**
- [ ] Can select date
- [ ] Pace calculates correctly
- [ ] Multiple exercises per day work
- [ ] Form clears after save

**History:**
- [ ] Recent entries display
- [ ] Goal progress calculates correctly
- [ ] Exercises show with pace

**iPhone:**
- [ ] Can access via local IP
- [ ] All forms work on touch
- [ ] PWA installs correctly
- [ ] Works after adding to home screen

### 7.2 Known Issues

| Issue | Severity | Workaround |
|-------|----------|------------|
| No offline support yet | Low | Stay connected |
| No data validation | Low | Enter valid data |
| No edit past entries | Low | Edit JSON files directly |

---

## 8. Deployment

### 8.1 Local Development

```bash
# Start everything
cd gb-health
./start.bat

# Or manually:
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 8.2 iPhone Access

1. Find laptop IP: `ipconfig` (look for IPv4)
2. Ensure same WiFi network
3. Open Safari: `http://LAPTOP_IP:5173`
4. Tap Share → Add to Home Screen

### 8.3 Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 8000 | http://localhost:8000 |
| API Docs | 8000 | http://localhost:8000/docs |

---

## 9. Future Enhancements

Items intentionally deferred:

| Feature | Reason |
|---------|--------|
| Apple Health import | Complex API, needs research |
| Notifications | Not critical for MVP |
| Multi-device sync | File-based approach works for now |
| User authentication | Local network trusted |
| Dark mode | Not wanted |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial plan |
