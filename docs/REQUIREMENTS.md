# GB Personal Apps - Requirements Document

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Executive Summary

GB Personal Apps is a suite of personal tracking applications designed to help George Brunner monitor health metrics, track guitar learning progress, and achieve personal goals. The apps prioritize simplicity, privacy, and cross-device accessibility.

---

## 2. Business Requirements

### 2.1 Problem Statement

Current tracking methods (OneNote, scattered files) are:
- Difficult to use on mobile
- Lack visualization capabilities
- Not searchable
- Spread across multiple locations
- Don't support goal tracking

### 2.2 Goals

| ID | Goal | Success Criteria |
|----|------|------------------|
| G1 | Replace OneNote tracking | All daily tracking done in GB Health |
| G2 | Mobile-first data entry | Can log entries from iPhone in < 30 seconds |
| G3 | Track health goals | Visual progress toward weight, glucose, alcohol goals |
| G4 | Consolidate guitar resources | All guitar materials accessible in one place |
| G5 | Build practice accountability | Streak tracking, practice time visibility |

### 2.3 Stakeholders

| Stakeholder | Role | Needs |
|-------------|------|-------|
| George Brunner | Primary User | Easy tracking, goal visibility, cross-device access |

---

## 3. Functional Requirements

### 3.1 GB Health

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| H-001 | Log daily weight | Must Have | Done |
| H-002 | Log blood pressure (systolic/diastolic) | Must Have | Done |
| H-003 | Log fasting glucose | Must Have | Done |
| H-004 | Log daily steps | Should Have | Done |
| H-005 | Log sleep hours | Should Have | Done |
| H-006 | Log water intake (glasses) | Should Have | Done |
| H-007 | Track alcohol consumption (yes/no) | Must Have | Done |
| H-008 | Log exercise type | Should Have | Done |
| H-009 | Track supplements taken | Nice to Have | Done |
| H-010 | Log stress level (1-10) | Nice to Have | Done |
| H-011 | Free-form notes/journal | Must Have | Done |
| H-012 | View entry history | Must Have | Done |
| H-013 | Log detailed exercise (distance, time, pace) | Should Have | Done |
| H-014 | Auto-calculate running pace | Nice to Have | Done |
| H-015 | Display goal progress (weight, alcohol-free days) | Should Have | Done |
| H-016 | Weekly summary generation | Nice to Have | Planned |
| H-017 | Weight trend chart | Should Have | Planned |
| H-018 | Glucose trend chart | Should Have | Planned |
| H-019 | Export data to CSV/JSON | Nice to Have | Planned |
| H-020 | Email-to-app note capture | Nice to Have | Planned |

### 3.2 GB Guitar

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| G-001 | Log practice sessions (date, duration, focus area) | Must Have | Planned |
| G-002 | Track songs (name, artist, status, progress) | Must Have | Planned |
| G-003 | Skills checklist (chords, techniques, theory) | Should Have | Planned |
| G-004 | Practice streak tracking | Should Have | Planned |
| G-005 | Weekly/monthly practice time stats | Should Have | Planned |
| G-006 | Link to existing song files (OneDrive) | Nice to Have | Planned |
| G-007 | Chord reference section | Nice to Have | Planned |
| G-008 | Built-in metronome or link | Nice to Have | Planned |
| G-009 | Practice notes/journal | Should Have | Planned |
| G-010 | Song wishlist | Nice to Have | Planned |
| G-011 | Email-to-app note capture | Nice to Have | Planned |
| G-012 | S3 backup for data | Nice to Have | Planned |

### 3.3 Shared/Integration

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| S-001 | Cross-device access (laptop + iPhone) | Must Have | Done |
| S-002 | PWA installable on iPhone | Must Have | Done |
| S-003 | Same WiFi network access | Must Have | Done |
| S-004 | Remote access via tunnel | Nice to Have | Planned |
| S-005 | Email routing integration | Nice to Have | Planned |
| S-006 | Outlook/Teams task sync | Nice to Have | Planned |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| P-001 | Page load time | < 2 seconds |
| P-002 | Form submission | < 1 second |
| P-003 | Data retrieval | < 500ms |

### 4.2 Usability

| ID | Requirement | Target |
|----|-------------|--------|
| U-001 | Mobile-friendly UI | Touch targets > 44px |
| U-002 | Daily entry completion | < 60 seconds |
| U-003 | No dark mode | Light theme only |
| U-004 | Minimal UI | Clean, uncluttered |

### 4.3 Security & Privacy

| ID | Requirement | Target |
|----|-------------|--------|
| SEC-001 | Health data storage | Local only, never cloud |
| SEC-002 | Guitar data storage | Local + optional S3 backup |
| SEC-003 | No third-party analytics | Zero external tracking |
| SEC-004 | Authentication | None initially (local network) |
| SEC-005 | Auth when remote | Basic auth with tunnel |

### 4.4 Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| R-001 | Data persistence | JSON files, human-readable |
| R-002 | Offline capability | PWA works offline |
| R-003 | Data backup | Manual export, optional S3 |

---

## 5. Constraints

| Constraint | Description |
|------------|-------------|
| Platform | Windows laptop (primary), iPhone (secondary) |
| Tech Stack | React + TypeScript frontend, Python + FastAPI backend |
| Storage | File-based (JSON/MD), no database |
| Hosting | Local server only (no cloud hosting) |
| Budget | $0 (personal project, use existing AWS account if needed) |
| Timeline | MVP complete, enhancements ongoing |

---

## 6. Assumptions

1. User has Node.js and Python installed on laptop
2. User has access to create email aliases (for email integration)
3. Laptop is typically on when iPhone access is needed
4. Local network is trusted (no auth needed for local access)
5. AWS credentials available in environment variables

---

## 7. Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| Node.js 18+ | Frontend build | Low |
| Python 3.10+ | Backend runtime | Low |
| AWS Account | S3 backup (optional) | Low |
| Email routing service | Note capture (optional) | Low |

---

## 8. Acceptance Criteria

### MVP (GB Health) - COMPLETE
- [x] Can log daily metrics from laptop
- [x] Can log daily metrics from iPhone (same network)
- [x] Can view recent entries
- [x] Can see goal progress
- [x] Data persists in JSON files

### Phase 2 (GB Health Enhancements)
- [ ] Charts for weight/glucose trends
- [ ] Weekly summary auto-generation
- [ ] Data export functionality

### Phase 3 (GB Guitar MVP)
- [ ] Can log practice sessions
- [ ] Can track songs being learned
- [ ] Can view practice history
- [ ] Streak tracking works

### Phase 4 (Integrations)
- [ ] Email-to-app working for both apps
- [ ] Remote access via Cloudflare tunnel
- [ ] Outlook task sync (if needed)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial requirements document |
