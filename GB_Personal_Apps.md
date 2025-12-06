# GB Personal Apps

## Overview

A suite of personal applications for tracking health, fitness, and hobbies. Built as Progressive Web Apps (PWAs) for seamless use on both Windows laptop and iPhone.

**Created:** December 6, 2025
**Author:** George Brunner

**User Environment:**
- Windows laptop (primary development)
- iPhone (default browser: **Edge**, not Safari)

---

## Goals

### Primary Objectives
1. Replace OneNote-based tracking with purpose-built applications
2. Easier data entry on mobile (iPhone)
3. Better visualizations and charts for progress tracking
4. Searchable history and notes
5. Sync between laptop and iPhone
6. Offline-first capability

### Secondary Objectives
- Integration with Microsoft Outlook/Teams for business-related tasks
- Future integration with Apple Health app
- Data export capabilities

---

## Applications

### 1. GB Health

**Purpose:** Daily health journaling and metrics tracking

#### Personal Goals

**Health Goals**
| Goal | Target | Current | Notes |
|------|--------|---------|-------|
| Lose weight | < 200 lbs | 219 lbs | ~20 lbs to lose |
| Daily calories | 1,500 cal | Tracking | Heart-healthy diet |
| Reduce alcohol | Minimize | Tracking | Track frequency, identify patterns |
| Monitor glucose | < 100 fasting | 115 | Prediabetes range, needs attention |
| Blood pressure | Normal range | Tracking | Daily monitoring |
| Get more sleep | 7-8 hours | Tracking | Quality rest = better decisions |

**Diet Guidelines**
- **Calorie target:** 1,500 calories/day
- **Focus:** Heart-healthy eating
- **Good choices:** Lean proteins, whole grains, vegetables, healthy fats (avocado, olive oil)
- **Limit:** Sodium, saturated fats, added sugars, processed foods

**Mindset / Productivity Goals**
| Goal | Principle | Notes |
|------|-----------|-------|
| Think before doing | "Don't jump to DO until you've thought and planned" | Resist the urge to dive in immediately |
| Plan first | Think → Plan → Document → DO | The DO becomes super efficient when preceded by planning |
| Document | Capture thinking before executing | This doc is an example of that principle in action |

#### Features

**Daily Tracking**
| Metric | Type | Notes |
|--------|------|-------|
| Date | Auto | Current date |
| Weight | Number (lbs) | Daily weigh-in |
| Blood Pressure | Text (sys/dia) | e.g., 120/80 |
| Glucose | Number (mg/dL) | Blood sugar reading |
| Steps | Number | Daily step count |
| Sleep | Number (hours) | Hours slept |
| Water | Number (glasses) | Water intake |
| Alcohol | Yes/No | Did you drink? |
| Exercise | Text/Select | Type of exercise (Run, Walk, None, etc.) |
| Supplements | Checkboxes | Vitamins, medications taken |
| Stress Level | 1-10 scale | Daily stress rating |
| Notes | Text | Free-form journaling |

**Running/Exercise Log**
| Field | Type | Notes |
|-------|------|-------|
| Date | Date | Exercise date |
| Type | Select | Run, Walk, Weights, etc. |
| Distance | Number (miles) | For cardio |
| Time | Duration | How long |
| Pace | Calculated | Auto-calculate for runs |
| Notes | Text | How it felt, conditions, etc. |

**Weekly Summary**
- Auto-generated stats (avg weight, total steps, exercise count)
- Goals section (editable)
- Reflections/notes section

**Visualizations**
- Weight trend chart (line graph)
- Steps over time (bar chart)
- Sleep patterns
- Exercise frequency
- Stress level trends

#### Future Enhancements
- Apple Health integration (import steps, sleep, vitals)
- Photo attachments for progress pics
- Meal/nutrition logging
- Medication reminders

---

### 2. GB Guitar

**Purpose:** Guitar practice tracking and progression system for long-term beginners

#### Guitar Goals
| Goal | Target | Notes |
|------|--------|-------|
| Practice regularly | 4+ days/week | Build consistency |
| Tune guitar | Every other day | Keep instruments ready to play |
| Learn new songs | 2-3 in progress | From song library |

#### The Problem to Solve
Playing for years but still feeling like a beginner = inconsistent practice and/or unstructured learning. This app will provide:
- Accountability through practice logging
- Structured progression tracking
- Visual proof of improvement over time

#### Learning Context
- **Primary Resource:** JustinGuitar (online)
- **No in-person instructor**
- **Musical Taste:** Singer-songwriter, soft rock, 70s-80s acoustic
- **Favorite Artists:** James Taylor, Jim Croce, Hall & Oates, Jackson Browne

#### Gear
| Instrument | Notes |
|------------|-------|
| Martin Dreadnought | Acoustic w/ electronics (primary for fingerpicking/singer-songwriter style) |
| Fender Stratocaster | Electric |
| Fender Bass | Rarely played |

#### Existing Resources

**Books:**
- Teach Yourself Visually Guitar (physical book)

**OneDrive - Guitar Resources folder:**
`C:\Users\GeorgeBrunner\OneDrive\Guitar Resources\`
- Guitar Chord Chart.pdf
- ChordHouse.url (online chord reference)
- JustinGuitar.url
- Metronome.url
- Song files (.docx): Bad Bad Leroy Brown, Fire and Rain, Horse with No Name, Operator, Teach Your Children, Time in a Bottle, Wonderful Tonight, You've Got a Friend, etc.

**OneDrive - Documents:**
- Guitars and Songs.docx - Songs by genre (includes jazz like Take Five)
- Guitar Chord Chart.docx
- Chords and Notes on Guitar.docx

**OneNote:**
- "Guitar" section in George Personal Notebook - rhythm guitar notes, Van Morrison, etc.
- "GB guitar notes" in George @ Work - Electric guitar songs (Jessie's Girl, You Shook Me All Night Long)

**Note:** GB Guitar app could consolidate all these scattered resources into one place

#### Starter Song Ideas
These artists are great for acoustic guitar learning:

| Song | Artist | Difficulty | Key Skills |
|------|--------|------------|------------|
| Fire and Rain | James Taylor | Intermediate | Fingerpicking, chord transitions |
| You've Got a Friend | James Taylor | Beginner-Intermediate | Open chords, strumming |
| Sweet Baby James | James Taylor | Intermediate | Fingerpicking patterns |
| Time in a Bottle | Jim Croce | Intermediate | Fingerpicking, Am shapes |
| Operator | Jim Croce | Beginner-Intermediate | Strumming, storytelling |
| Bad, Bad Leroy Brown | Jim Croce | Beginner | Fun strumming pattern |
| Sara Smile | Hall & Oates | Intermediate | Chord voicings |
| She's Gone | Hall & Oates | Intermediate | Soul/R&B strumming |
| Doctor My Eyes | Jackson Browne | Beginner | Simple progression |
| Running on Empty | Jackson Browne | Intermediate | Driving rhythm |
| These Days | Jackson Browne | Beginner-Intermediate | Beautiful fingerpicking |

#### Features

**Practice Log**
| Field | Type | Notes |
|-------|------|-------|
| Date | Date | When you practiced |
| Duration | Minutes | How long |
| Focus Area | Select | Chords, Scales, Songs, Techniques, Theory |
| What You Worked On | Text | Specific details |
| Difficulty | 1-5 | How hard was it? |
| Notes | Text | What clicked? What's frustrating? |

**Song Tracker**
| Field | Type | Notes |
|-------|------|-------|
| Song Name | Text | Title |
| Artist | Text | Who performs it |
| Difficulty | Easy/Medium/Hard | Your assessment |
| Status | Select | Want to Learn, Learning, Can Play, Mastered |
| Progress | Percentage | How far along |
| Notes | Text | Tricky parts, links to tabs, etc. |

**Skills Checklist**
Track your progression through fundamentals:

*Chords*
- [ ] Open chords (C, G, D, E, A, Am, Em, Dm)
- [ ] Barre chords (F, Bm)
- [ ] Power chords
- [ ] 7th chords
- [ ] More advanced shapes

*Techniques*
- [ ] Clean chord transitions
- [ ] Strumming patterns
- [ ] Fingerpicking basics
- [ ] Hammer-ons / Pull-offs
- [ ] Bends
- [ ] Slides

*Theory*
- [ ] Notes on fretboard
- [ ] Major scale
- [ ] Pentatonic scale
- [ ] Reading chord charts
- [ ] Understanding keys

**Practice Stats**
- Weekly/monthly practice time
- Streak tracking (consecutive days practiced)
- Most practiced songs
- Progress over time

**Reference Section**
- Chord diagrams (interactive)
- Scale patterns
- Common strumming patterns
- Metronome (built-in or link to app)

#### Future Enhancements
- Record yourself playing (audio clips)
- Compare recordings over time
- Lesson notes from teachers/YouTube
- Integration with Ultimate Guitar or similar

---

### 3. GB Finance

**Purpose:** Bill and payment tracking to never miss a due date

#### Finance Goals
| Goal | Target | Notes |
|------|--------|-------|
| Never miss a payment | 0 missed payments | Track all due dates |
| Reduce debt | Pay down balances | Track progress over time |
| Improve credit score | FICO > 700 | Currently ~600 |

#### Accounts to Track

**Credit Cards:**
| Account | Institution | Notes |
|---------|-------------|-------|
| Visa Classic Contactless-0576 | Trumark | Primary |
| Costco Card | Citibank | |
| Aviator Red Mastercard | Barclay's | AAdvantage miles |
| Credit Card | Police and Fire FCU (PFFCU) | |
| Credit Card | Home Depot | Store card |

#### Features

**Dashboard**
- Upcoming due dates (next 30 days)
- Overdue bills highlighted in red
- Total minimum payments due this month
- Total balances across all accounts
- Quick "Log Payment" button per account

**Bill Entry**
| Field | Type | Notes |
|-------|------|-------|
| Account | Select | Which card |
| Statement Date | Date | When statement was issued |
| Statement Balance | Currency | Total owed |
| Minimum Payment | Currency | Minimum due |
| Due Date | Date | When payment is due |
| Available Credit | Currency | Remaining credit |
| Past Due Amount | Currency | If any |
| Notes | Text | Optional |

**Payment Logging**
| Field | Type | Notes |
|-------|------|-------|
| Account | Select | Which card |
| Payment Date | Date | When paid |
| Amount | Currency | How much |
| Confirmation Number | Text | For records |
| Payment Method | Select | ACH, Debit, Check, Auto-Pay |
| Notes | Text | Optional |

**FICO Score Tracking**
| Field | Type | Notes |
|-------|------|-------|
| Score | Number | FICO score |
| Source | Select | Equifax, Experian, TransUnion, etc. |
| Date | Date | When reported |
| Notes | Text | From which card/service |

**Account Detail View**
- Current balance and credit limit
- Credit utilization percentage
- Payment history list
- Bill history list

#### Security Notes
- **No full account numbers** - Last 4 digits only
- **No passwords/logins stored** - Never store credentials in the app
- **Local storage only** - Financial data stays on local machine
- **No cloud sync** - Too sensitive for cloud backup

---

## Technical Architecture

### Stack

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│                Progressive Web App (PWA)                 │
│         Works in browser + installable on iPhone         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Python)                       │
│                  FastAPI REST API                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Storage                          │
│         Local MD/JSON files (file-based storage)         │
│      Health data: Local only (privacy-sensitive)         │
│      Guitar data: Optional S3 backup (non-sensitive)     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Integrations                           │
│    Microsoft Graph API (Outlook/Teams task sync)         │
│    AWS S3 (optional backup for non-health data)          │
│    Email-to-App (via existing email routing service)     │
│    Apple Health (future)                                 │
└─────────────────────────────────────────────────────────┘
```

### Email-to-App Integration

**Existing System:** `C:\Users\GeorgeBrunner\Cursor\Email to S3 for Corpus Updates`

You already have an email routing service that monitors inbound emails and routes them based on recipient aliases. This can be extended to capture notes for your personal apps!

**Proposed Aliases:**
| Alias | Routes To | Use Case |
|-------|-----------|----------|
| `gbhealth@acumenanalytics.com` | GB Health notes | Email yourself health observations from anywhere |
| `gbguitar@acumenanalytics.com` | GB Guitar notes | Email practice notes, song ideas, questions |

**Example Workflows:**

1. **Quick health note from phone:**
   - Email to `gbhealth@acumenanalytics.com`
   - Subject: "Felt tired after lunch"
   - Body: "Energy crash around 2pm. Had pasta for lunch. Maybe blood sugar spike?"
   - → Automatically captured as a note in GB Health

2. **Guitar idea while commuting:**
   - Email to `gbguitar@acumenanalytics.com`
   - Subject: "Song to learn: Landslide"
   - Body: "Heard on radio. Fingerpicking. Look up tabs later."
   - → Added to GB Guitar song wishlist

**Implementation:**
- Add routing rules to existing `routing_rules_aliases.yaml`
- Create simple parser that writes email body to app's notes JSON
- No WiFi needed - works from anywhere via email!

### Technology Choices

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | React + TypeScript | Modern, component-based, great PWA support |
| UI Framework | TBD (Tailwind, MUI, or Chakra) | Fast development, mobile-friendly |
| Backend | Python + FastAPI | Fast, modern, great for APIs |
| Data Storage | MD/JSON files | Simple, human-readable, version-controllable, no database overhead |
| Cloud Backup | AWS S3 (optional) | For non-sensitive data (guitar); uses existing AWS credentials |
| Hosting | Local Python server | Accessible on same network for iPhone |

### Project Structure

```
GB Personal/
├── GB_Personal_Apps.md          # This file
├── gb-health/
│   ├── frontend/                # React PWA
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── backend/                 # Python FastAPI
│   │   ├── app/
│   │   └── requirements.txt
│   └── data/                    # Local data storage
│       ├── daily/               # Daily health entries
│       │   └── 2025-12-06.json
│       ├── exercises/           # Exercise log entries
│       │   └── 2025-12-06.json
│       └── weekly/              # Weekly summaries
│           └── 2025-W49.md
├── gb-guitar/
│   ├── frontend/
│   ├── backend/
│   └── data/
│       ├── practice-log/        # Practice session logs
│       │   └── 2025-12-06.json
│       ├── songs.json           # Song library
│       ├── skills.json          # Skills checklist progress
│       └── stats.json           # Aggregated stats
├── gb-finance/
│   ├── frontend/
│   ├── backend/
│   └── data/
│       ├── accounts.json        # Credit card accounts
│       ├── bills/               # Monthly bill statements
│       │   └── 2025-12.json
│       ├── payments/            # Payment records
│       │   └── 2025-12.json
│       └── fico-scores.json     # Credit score history
└── shared/                      # Shared utilities
    └── integrations/
        ├── outlook.py
        └── s3_backup.py
```

### Data Storage Strategy

| App | Data Type | Storage | Reason |
|-----|-----------|---------|--------|
| GB Health | Daily metrics | Local JSON | Privacy - health data stays local |
| GB Health | Exercise log | Local JSON | Privacy |
| GB Health | Weekly summaries | Local MD | Human-readable, easy to review |
| GB Guitar | Practice log | Local JSON + S3 backup | Non-sensitive, nice to have backup |
| GB Guitar | Songs/Skills | Local JSON + S3 backup | Non-sensitive |

### Data Privacy

- **Health data:** Stays 100% local - never leaves your machine
- **Guitar data:** Local with optional S3 backup (your AWS account, not shared)
- **No database:** Simple file-based storage (JSON/MD) - easy to read, edit, backup
- **No tracking:** No analytics or third-party data collection
- **Git-friendly:** Can version control your data if desired (except health)

---

## Development Phases

### Phase 1: GB Health MVP
- [ ] Set up project structure
- [ ] Create React PWA shell
- [ ] Build daily entry form
- [ ] Implement local SQLite storage
- [ ] Basic data viewing (list of entries)
- [ ] PWA configuration for iPhone install

### Phase 2: GB Health Enhancements
- [ ] Charts and visualizations
- [ ] Weekly summary auto-generation
- [ ] Exercise log with pace calculation
- [ ] Search and filter history
- [ ] Data export

### Phase 3: GB Guitar
- [ ] Define features (need input)
- [ ] Build MVP
- [ ] Iterate based on use

### Phase 4: Integrations
- [ ] Microsoft Graph API for Outlook/Teams
- [ ] Apple Health import (research required)
- [ ] Cross-app dashboard

---

## Open Questions

1. ~~**GB Guitar features:** What specifically do you want to track?~~ ✅ Defined
2. ~~**Hosting preference:** Local only, or deploy to cloud for anywhere access?~~ ✅ Local server + iPhone on same network
3. ~~**UI style:** Any preference on look and feel? Dark mode? Minimal?~~ ✅ Light mode, clean/minimal
4. ~~**Authentication:** Need login/password, or just local access?~~ ✅ No auth needed initially (local network)
5. ~~**iPhone access method:**~~ ✅ Same WiFi to start, add tunnel later for remote access

## Decisions Made

| Decision | Choice | Notes |
|----------|--------|-------|
| UI Theme | Light mode | No dark mode |
| Initial Access | Same WiFi only | Local IP address |
| Future Access | Cloudflare Tunnel | For remote note-taking and questions when away from home |
| Authentication | None initially | Add basic auth when tunnel is enabled |

---

## Notes

*This document will be updated as the project evolves.*
