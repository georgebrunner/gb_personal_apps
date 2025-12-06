# GB Health - Requirements Document

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Overview

GB Health is a personal health tracking application designed to replace OneNote-based tracking with a purpose-built, mobile-friendly solution.

### 1.1 Purpose

Track daily health metrics to support personal goals:
- Lose weight (target: < 200 lbs, current: 219 lbs)
- Reduce alcohol consumption
- Monitor glucose (current: 115 fasting, target: < 100)
- Monitor blood pressure
- Improve sleep (target: 7-8 hours)

### 1.2 Users

Primary user: George Brunner
- Devices: Windows laptop, iPhone
- Usage: Daily logging, weekly review

---

## 2. Functional Requirements

### 2.1 Daily Entry (MVP - COMPLETE)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| DE-001 | Enter date (auto-filled to today) | Auto | ✅ Done |
| DE-002 | Enter weight in pounds | Number | ✅ Done |
| DE-003 | Enter blood pressure (systolic) | Number | ✅ Done |
| DE-004 | Enter blood pressure (diastolic) | Number | ✅ Done |
| DE-005 | Enter fasting glucose | Number | ✅ Done |
| DE-006 | Enter step count | Number | ✅ Done |
| DE-007 | Enter sleep hours | Number | ✅ Done |
| DE-008 | Enter water intake (glasses) | Number | ✅ Done |
| DE-009 | Mark alcohol consumption (yes/no) | Boolean | ✅ Done |
| DE-010 | Select exercise type | Select | ✅ Done |
| DE-011 | Check supplements taken | Multi-select | ✅ Done |
| DE-012 | Set stress level (1-10) | Slider | ✅ Done |
| DE-013 | Enter free-form notes | Text | ✅ Done |
| DE-014 | Save entry | Button | ✅ Done |
| DE-015 | Load existing entry for today | Auto | ✅ Done |

### 2.2 Exercise Log (MVP - COMPLETE)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| EX-001 | Select date | Date picker | ✅ Done |
| EX-002 | Select exercise type | Select | ✅ Done |
| EX-003 | Enter distance (miles) | Number | ✅ Done |
| EX-004 | Enter duration (minutes) | Number | ✅ Done |
| EX-005 | Auto-calculate pace | Calculated | ✅ Done |
| EX-006 | Enter notes | Text | ✅ Done |
| EX-007 | Save exercise | Button | ✅ Done |
| EX-008 | Multiple exercises per day | Array | ✅ Done |

### 2.3 History View (MVP - COMPLETE)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| HV-001 | List recent daily entries | List | ✅ Done |
| HV-002 | Show key metrics per entry | Summary | ✅ Done |
| HV-003 | List recent exercises | List | ✅ Done |
| HV-004 | Display goal progress | Dashboard | ✅ Done |

### 2.4 Visualizations (Phase 2)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| VZ-001 | Weight trend line chart | Chart | Planned |
| VZ-002 | Glucose trend with target zone | Chart | Planned |
| VZ-003 | Blood pressure chart | Chart | Planned |
| VZ-004 | Sleep pattern chart | Chart | Planned |
| VZ-005 | Exercise frequency calendar | Calendar | Planned |
| VZ-006 | Alcohol tracking calendar | Calendar | Planned |

### 2.5 Data Management (Phase 2)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| DM-001 | Export all data to JSON | Export | Planned |
| DM-002 | Export all data to CSV | Export | Planned |
| DM-003 | Generate weekly summary | Report | Planned |
| DM-004 | View past entries by date | Navigation | Planned |
| DM-005 | Edit past entries | Edit | Planned |

### 2.6 Integrations (Phase 4)

| ID | Requirement | Type | Status |
|----|-------------|------|--------|
| IN-001 | Email-to-app note capture | Integration | Planned |
| IN-002 | Apple Health import | Integration | Future |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PF-001 | Initial page load | < 2 seconds |
| PF-002 | Save entry response | < 1 second |
| PF-003 | Load history (30 days) | < 500ms |

### 3.2 Usability

| ID | Requirement | Target |
|----|-------------|--------|
| UX-001 | Complete daily entry | < 60 seconds |
| UX-002 | Mobile touch targets | >= 44px |
| UX-003 | Form field labels | Always visible |
| UX-004 | Error messages | Clear, actionable |

### 3.3 Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| AC-001 | Font size | >= 16px inputs |
| AC-002 | Color contrast | WCAG AA |
| AC-003 | Form labels | Associated with inputs |

### 3.4 Security

| ID | Requirement | Target |
|----|-------------|--------|
| SE-001 | Data location | Local filesystem only |
| SE-002 | Network access | Local network only (MVP) |
| SE-003 | No cloud storage | Health data never uploaded |
| SE-004 | No analytics | Zero third-party tracking |

---

## 4. Data Requirements

### 4.1 Daily Entry Schema

```json
{
  "date": "2025-12-06",
  "weight": 219.5,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80,
  "glucose": 115,
  "steps": 5000,
  "sleep_hours": 7.5,
  "water_glasses": 8,
  "alcohol": false,
  "exercise": "Run",
  "supplements": ["Multivitamin", "Vitamin D"],
  "stress_level": 5,
  "notes": "Felt good today. Morning glucose a bit high.",
  "updated_at": "2025-12-06T08:30:00"
}
```

### 4.2 Exercise Entry Schema

```json
{
  "date": "2025-12-06",
  "exercise_type": "Run",
  "distance_miles": 3.1,
  "duration_minutes": 30,
  "pace_per_mile": "9:41",
  "notes": "Easy pace, nice weather",
  "created_at": "2025-12-06T07:00:00"
}
```

### 4.3 Storage Structure

```
gb-health/data/
├── daily/
│   ├── 2025-12-01.json
│   ├── 2025-12-02.json
│   └── ...
├── exercises/
│   ├── 2025-12-01.json  (array of exercises)
│   └── ...
└── weekly/
    ├── 2025-W49.md
    └── ...
```

---

## 5. User Interface Requirements

### 5.1 Screens

| Screen | Purpose | Priority |
|--------|---------|----------|
| Daily Log | Enter daily metrics | P0 |
| Exercise | Log workouts | P0 |
| History | View past entries | P0 |
| Charts | Visualize trends | P1 |
| Settings | Configure app | P2 |

### 5.2 Design Guidelines

- Light theme only (no dark mode)
- Clean, minimal interface
- Mobile-first responsive design
- Primary color: Indigo (#4F46E5)
- Card-based layout
- Clear visual hierarchy

### 5.3 Navigation

- Tab-based navigation (Daily, Exercise, History)
- No nested navigation in MVP
- Single-page application

---

## 6. Technical Constraints

| Constraint | Description |
|------------|-------------|
| Frontend | React 18 + TypeScript |
| Backend | Python 3.10+ + FastAPI |
| Storage | JSON files (no database) |
| Hosting | Local server |
| Platform | Windows (primary), PWA (iPhone) |

---

## 7. Acceptance Criteria

### 7.1 MVP Complete When:

- [x] Can enter all daily metrics from laptop
- [x] Can enter all daily metrics from iPhone (same network)
- [x] Can log exercise with auto-calculated pace
- [x] Can view last 14 days of entries
- [x] Can see goal progress (weight, alcohol-free days, glucose avg)
- [x] Data persists after closing app
- [x] PWA installable on iPhone

### 7.2 Phase 2 Complete When:

- [ ] Weight chart displays correctly
- [ ] Glucose chart shows target zone
- [ ] Weekly summary generates automatically
- [ ] Can export data to CSV

---

## 8. Appendix

### 8.1 Supplement Options

Default list (editable in code):
- Multivitamin
- Vitamin D
- Fish Oil
- Magnesium
- B12

### 8.2 Exercise Types

- Run
- Walk
- Weights
- Bike
- Swim
- Yoga
- Other

### 8.3 Reference Values

| Metric | Normal | Goal |
|--------|--------|------|
| Fasting Glucose | < 100 mg/dL | < 100 |
| Blood Pressure | < 120/80 | Normal |
| Weight | - | < 200 lbs |
| Sleep | 7-9 hours | 7-8 hours |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial requirements |
