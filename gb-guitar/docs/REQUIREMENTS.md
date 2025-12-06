# GB Guitar - Requirements Document

**Version:** 1.0
**Date:** December 6, 2025
**Author:** George Brunner

---

## 1. Overview

GB Guitar is a personal guitar practice tracking application designed to help a long-term beginner build consistency, track progress, and consolidate learning resources.

### 1.1 Purpose

Address the "playing for years but still a beginner" problem by providing:
- Accountability through practice logging
- Structured progression tracking
- Visual proof of improvement over time
- Consolidated access to learning resources

### 1.2 User Profile

**Primary User:** George Brunner
- **Experience Level:** Long-term beginner
- **Learning Resource:** JustinGuitar (online)
- **Musical Interest:** Singer-songwriter, soft rock, 70s-80s acoustic
- **Favorite Artists:** James Taylor, Jim Croce, Hall & Oates, Jackson Browne

### 1.3 Equipment

| Instrument | Notes |
|------------|-------|
| Martin Dreadnought | Acoustic w/ electronics (primary) |
| Fender Stratocaster | Electric |
| Fender Bass | Rarely played |

---

## 2. Functional Requirements

### 2.1 Practice Log (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| PL-001 | Log practice date | Date | P0 |
| PL-002 | Log duration (minutes) | Number | P0 |
| PL-003 | Select focus area | Select | P0 |
| PL-004 | Enter what was worked on | Text | P0 |
| PL-005 | Rate difficulty (1-5) | Rating | P1 |
| PL-006 | Enter notes/observations | Text | P0 |
| PL-007 | Save practice session | Button | P0 |
| PL-008 | Multiple sessions per day | Array | P1 |

**Focus Area Options:**
- Chords
- Scales
- Songs
- Techniques
- Theory
- Other

### 2.2 Song Tracker (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| ST-001 | Add song (name, artist) | Form | P0 |
| ST-002 | Set difficulty level | Select | P1 |
| ST-003 | Track status | Select | P0 |
| ST-004 | Track progress percentage | Slider | P1 |
| ST-005 | Add notes | Text | P1 |
| ST-006 | Link to resource file | URL/Path | P2 |
| ST-007 | View all songs | List | P0 |
| ST-008 | Filter by status | Filter | P1 |

**Status Options:**
- Want to Learn
- Learning
- Can Play
- Mastered

**Difficulty Options:**
- Easy
- Medium
- Hard

### 2.3 Practice History (MVP)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| PH-001 | View recent practice sessions | List | P0 |
| PH-002 | Display streak (consecutive days) | Counter | P0 |
| PH-003 | Show weekly practice time | Summary | P1 |
| PH-004 | Show monthly practice time | Summary | P1 |

### 2.4 Skills Checklist (Phase 2)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| SC-001 | Track chord proficiency | Checklist | P1 |
| SC-002 | Track technique proficiency | Checklist | P1 |
| SC-003 | Track theory knowledge | Checklist | P1 |
| SC-004 | Visual progress indicators | Progress bars | P2 |

**Chords to Track:**
- [ ] Open chords (C, G, D, E, A, Am, Em, Dm)
- [ ] Barre chords (F, Bm)
- [ ] Power chords
- [ ] 7th chords
- [ ] More advanced shapes

**Techniques to Track:**
- [ ] Clean chord transitions
- [ ] Strumming patterns
- [ ] Fingerpicking basics
- [ ] Hammer-ons / Pull-offs
- [ ] Bends
- [ ] Slides

**Theory to Track:**
- [ ] Notes on fretboard
- [ ] Major scale
- [ ] Pentatonic scale
- [ ] Reading chord charts
- [ ] Understanding keys

### 2.5 Reference Section (Phase 2)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| RS-001 | Chord diagrams | Visual | P2 |
| RS-002 | Scale patterns | Visual | P2 |
| RS-003 | Common strumming patterns | Text/Visual | P2 |
| RS-004 | Metronome link | Link | P2 |
| RS-005 | Link to existing resources | Links | P1 |

### 2.6 Integrations (Phase 3)

| ID | Requirement | Type | Priority |
|----|-------------|------|----------|
| IN-001 | Email-to-app note capture | Integration | P2 |
| IN-002 | S3 backup | Integration | P2 |
| IN-003 | Link to OneDrive song files | Integration | P2 |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PF-001 | Page load time | < 2 seconds |
| PF-002 | Save response | < 1 second |
| PF-003 | Load practice history | < 500ms |

### 3.2 Usability

| ID | Requirement | Target |
|----|-------------|--------|
| UX-001 | Log practice session | < 30 seconds |
| UX-002 | Mobile touch targets | >= 44px |
| UX-003 | Streak visible on home | Always |

### 3.3 Security

| ID | Requirement | Target |
|----|-------------|--------|
| SE-001 | Data storage | Local + optional S3 |
| SE-002 | Network access | Local network (MVP) |
| SE-003 | No tracking | Zero third-party analytics |

---

## 4. Data Requirements

### 4.1 Practice Session Schema

```json
{
  "date": "2025-12-06",
  "duration_minutes": 30,
  "focus_area": "Songs",
  "what_worked_on": "Fire and Rain - intro fingerpicking pattern",
  "difficulty": 3,
  "notes": "Getting smoother on the transitions. Thumb pattern feels more natural.",
  "created_at": "2025-12-06T19:30:00"
}
```

### 4.2 Song Schema

```json
{
  "id": "uuid-1234",
  "name": "Fire and Rain",
  "artist": "James Taylor",
  "difficulty": "Intermediate",
  "status": "Learning",
  "progress": 40,
  "notes": "Working on fingerpicking pattern. Bridge is tricky.",
  "resource_path": "C:/Users/GeorgeBrunner/OneDrive/Guitar Resources/Fire and Rain.docx",
  "added_at": "2025-12-06T10:00:00",
  "updated_at": "2025-12-06T19:30:00"
}
```

### 4.3 Skills Schema

```json
{
  "chords": {
    "open_chords": true,
    "barre_chords": false,
    "power_chords": false,
    "seventh_chords": false,
    "advanced_shapes": false
  },
  "techniques": {
    "chord_transitions": true,
    "strumming_patterns": true,
    "fingerpicking_basics": false,
    "hammer_ons_pull_offs": false,
    "bends": false,
    "slides": false
  },
  "theory": {
    "fretboard_notes": false,
    "major_scale": false,
    "pentatonic_scale": false,
    "reading_chord_charts": true,
    "understanding_keys": false
  },
  "updated_at": "2025-12-06T19:30:00"
}
```

### 4.4 Storage Structure

```
gb-guitar/data/
├── practice-log/
│   ├── 2025-12-06.json   (array of sessions)
│   └── ...
├── songs.json            (all songs)
├── skills.json           (checklist state)
└── stats.json            (aggregated stats)
```

---

## 5. Existing Resources to Integrate

### 5.1 OneDrive - Guitar Resources

**Location:** `C:\Users\GeorgeBrunner\OneDrive\Guitar Resources\`

**Files:**
- Guitar Chord Chart.pdf
- ChordHouse.url
- JustinGuitar.url
- Metronome.url
- Song files (.docx): Bad Bad Leroy Brown, Fire and Rain, Horse with No Name, Operator, Teach Your Children, Time in a Bottle, Wonderful Tonight, You've Got a Friend

### 5.2 OneDrive - Documents

- Guitars and Songs.docx
- Guitar Chord Chart.docx
- Chords and Notes on Guitar.docx

### 5.3 OneNote

- "Guitar" section in George Personal Notebook
- "GB guitar notes" in George @ Work

### 5.4 Physical Book

- Teach Yourself Visually Guitar

---

## 6. User Interface Requirements

### 6.1 Screens

| Screen | Purpose | Priority |
|--------|---------|----------|
| Practice Log | Log sessions | P0 |
| Songs | Manage song library | P0 |
| History | View past sessions, stats | P0 |
| Skills | Track skill progress | P1 |
| Reference | Quick access to resources | P2 |

### 6.2 Design Guidelines

- Match GB Health aesthetic
- Light theme only
- Mobile-first responsive
- Primary color: Indigo (#4F46E5)
- Streak prominently displayed
- Motivational progress indicators

### 6.3 Navigation

- Tab-based: Practice, Songs, History, (Skills, Reference)
- Single-page application

---

## 7. Starter Song Library

Pre-populated songs based on user's musical taste:

| Song | Artist | Difficulty | Skills |
|------|--------|------------|--------|
| Fire and Rain | James Taylor | Intermediate | Fingerpicking |
| You've Got a Friend | James Taylor | Beginner-Intermediate | Open chords |
| Sweet Baby James | James Taylor | Intermediate | Fingerpicking |
| Time in a Bottle | Jim Croce | Intermediate | Fingerpicking |
| Operator | Jim Croce | Beginner-Intermediate | Strumming |
| Bad, Bad Leroy Brown | Jim Croce | Beginner | Strumming |
| Horse with No Name | America | Beginner | Two chords! |
| Wonderful Tonight | Eric Clapton | Beginner | Chord transitions |
| Doctor My Eyes | Jackson Browne | Beginner | Simple progression |
| Running on Empty | Jackson Browne | Intermediate | Driving rhythm |

---

## 8. Acceptance Criteria

### 8.1 MVP Complete When:

- [ ] Can log practice session with all fields
- [ ] Can view practice history
- [ ] Streak tracking works correctly
- [ ] Can add songs to library
- [ ] Can update song status/progress
- [ ] Can view weekly/monthly practice time
- [ ] Works on iPhone (PWA)

### 8.2 Phase 2 Complete When:

- [ ] Skills checklist functional
- [ ] Can link to OneDrive resources
- [ ] Reference section available

### 8.3 Phase 3 Complete When:

- [ ] Email-to-app captures notes
- [ ] S3 backup configured

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-06 | George Brunner | Initial requirements |
