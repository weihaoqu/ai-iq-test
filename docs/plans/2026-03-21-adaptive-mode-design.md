# Phase 2: Adaptive Test Mode Design

**Date:** 2026-03-21
**Branch:** phase2-adaptive
**Goal:** Build a 3-level adaptive assessment that progressively deepens testing through new question formats and gated progression.

## Architecture: Split Into Modules

Break the monolithic `index.html` into separate pages with shared infrastructure.

### File Structure

```
/
├── index.html              ← Landing page + mode selection (trimmed)
├── level1.html             ← Quick Scan (16 MCQ)
├── level2.html             ← Mixed Format (ranking, multi-select, free-text)
├── level3.html             ← Boss Challenge (case study, separate session)
├── shared/
│   ├── styles.css          ← Extracted common styles (shader, glassmorphism, cards, etc.)
│   ├── engine.js           ← Shared logic (scoring, progress, timer, navigation, localStorage API)
│   ├── shader.js           ← Three.js background shader
│   ├── submit.js           ← Google Sheets submission logic
│   └── components.js       ← Shared UI (feedback modal, radar chart, 3D tutors)
├── questions/
│   ├── level1.json         ← 48 MCQ questions (existing set, used for L1 selection)
│   ├── level2.json         ← Mixed-format questions (new)
│   └── level3.json         ← Boss challenge scenarios (new)
├── images/                 ← Existing
├── docs/                   ← Existing
└── questions.json          ← Keep for backward compat
```

### State Passing (localStorage)

```json
{
  "participantId": "AIQ1710000000123",
  "participantName": "Jane",
  "experience": "regular",
  "startTime": 1710000000,
  "level1": {
    "scores": { "foundations": 7, "problemFraming": 5, ... },
    "totalScore": 52,
    "percentage": 81,
    "level": "Apprentice",
    "answers": [{ "qId": "f02", "choiceIdx": 1, "origLetter": "B", "score": 4 }, ...]
  },
  "level2": {
    "scores": { ... },
    "totalScore": 38,
    "percentage": 79,
    "level": "Practitioner",
    "answers": [...]
  },
  "level3Unlocked": true
}
```

Key name: `adaptive_session`

---

## Level 1: Quick Scan (16 MCQ)

Extracted from current Quick Mode into `level1.html`.

### Flow

1. From `index.html` landing → click "Adaptive Assessment" card → navigates to `level1.html`
2. Welcome screen: name + experience dropdown
3. 16 randomized MCQs (2 per dimension, drawn from the 48-question pool)
4. Results screen with score percentage + level badge + radar chart

### Gate Logic

| Level 1 Result | Action |
|---|---|
| Apprentice or higher | Show "Continue to Level 2" button → navigates to `level2.html` |
| Novice | "You need Apprentice level to proceed. Review and try again." + retry button |

### Data

- Writes `adaptive_session.level1` to localStorage before navigation
- Submits to Google Sheets as independent row (level=1)

---

## Level 2: Mixed Format (~12 questions)

Continuous session from Level 1. Introduces 3 new question formats.

### Question Selection (Hybrid)

1. Read `adaptive_session.level1.scores` from localStorage
2. Rank 8 dimensions by score (ascending)
3. Pick 3-4 weakest dimensions → 3 questions each = 9-12 questions
4. Pick 1-2 strongest dimensions → 1 verification question each = 1-2 questions
5. **Total: ~12 questions**

### Question Formats

#### Ranking

- **Prompt:** "Rank these 4 approaches from best to worst for [scenario]"
- **UI:** Draggable list (drag-to-reorder) or tap-to-assign-rank (1st, 2nd, 3rd, 4th)
- **Scoring:** Kendall tau distance from correct order
  - Perfect order = 4 pts
  - One swap = 3 pts
  - Two swaps = 2 pts
  - Random/reversed = 1 pt
- **Self-assessment:** After submitting, show correct order + explanation. User confirms "How close was your reasoning?" on 4-point scale.

#### Multi-Select

- **Prompt:** "Select ALL that apply: which of these are valid concerns about [scenario]?"
- **UI:** Checkboxes + submit button
- **Scoring:**
  - Full correct set = 4 pts
  - Miss one = 3 pts
  - Miss two or include one wrong = 2 pts
  - Mostly wrong = 1 pt
- **Self-assessment:** Show correct set, user rates on 4-point scale.

#### Free-Text

- **Prompt:** "Describe how you would approach [scenario]. Consider [constraints]."
- **UI:** Textarea (200-500 char suggested range, not enforced)
- **Scoring:** After writing, show a 4-level rubric with exemplar answers:
  - Novice (1): Surface-level or incorrect approach
  - Developing (2): Partially correct, missing key considerations
  - Proficient (3): Solid approach with minor gaps
  - Expert (4): Comprehensive, demonstrates deep understanding
- User selects which level matches their answer.

### Results

- Combined L1 + L2 score displayed
- Overlaid radar chart: L1 (dimmed) vs L2 (bright) for visual comparison
- Level recalculation based on combined performance

### Gate Logic

| Combined Result | Action |
|---|---|
| Practitioner or higher | "Boss Challenge Unlocked!" — saves `level3Unlocked: true` to localStorage |
| Below Practitioner | "Keep building your skills" + dimension-specific improvement tips |

### Data

- Submits to Google Sheets as independent row (level=2)

---

## Level 3: Boss Challenge (Separate Session)

Unlockable from the landing page after achieving Practitioner+ through L1+L2.

### Entry

- `index.html` landing shows a "Boss Challenge" card
- If `adaptive_session.level3Unlocked === true` → card is unlocked (clickable)
- If false or absent → card shows locked state with requirements
- Clicking unlocked card → navigates to `level3.html`

### Structure: Multi-Step Case Study (4 Phases)

Each scenario is a realistic AI project that unfolds across 4 phases:

#### Phase 1: Briefing (Read-only)
- Present a realistic scenario (e.g., "Your team needs to build an AI-powered customer support system for a small clinic. Budget is limited, data is sensitive, timeline is 2 weeks.")
- No scoring — context setting only.

#### Phase 2: Planning (Free-text)
- "Outline your approach: which AI tools, what data considerations, what risks?"
- Self-assess against 4-level rubric after answering.

#### Phase 3: Execution (Mixed — 2-3 sub-tasks)
- A ranking question (e.g., "Prioritize these 5 implementation steps")
- A multi-select question (e.g., "Which data practices are appropriate here?")
- A free-text decision point (e.g., "The AI is hallucinating medical terms. What do you do?")
- Each sub-task self-assessed.

#### Phase 4: Reflection (Free-text)
- "What would you do differently? What's the biggest risk you didn't address?"
- Self-assess against rubric.

### Grading

- Each phase (2, 3a, 3b, 3c, 4) has a self-assessed score (1-4)
- **Pass threshold:** Average self-assessment >= 2.5 across all phases
- **No numeric score displayed** — only Pass / Fail

### Output

**On Pass:**
- "Boss Challenge Complete" badge
- Downloadable certificate (distinct design from L1/L2 certificate)
- Journey summary: L1 score → L2 score → Boss badge

**On Fail:**
- Encouraging feedback + specific rubric areas to improve
- Can retry (randomly assigned different scenario if multiple available)

### Scenario Pool

- Start with 2-3 scenarios, randomly assigned
- Expandable in future updates
- Scenarios stored in `questions/level3.json`

### Data

- Submits to Google Sheets as independent row (level=3)

---

## Google Sheets Integration

One submission per completed level. Three rows for a full adaptive run.

### Payload Structure

```javascript
// Shared fields (all levels)
{
  participant_id: "AIQ1710000000123",
  participant_name: "Jane",
  timestamp: "2026-03-21T14:32:00Z",
  ai_experience: "regular",
  test_mode: "adaptive",
  level: 1,                          // 1, 2, or 3
  duration_seconds: 240
}

// Level 1 & 2 additional fields
{
  total_score: 52,
  percentage: 81,
  result_level: "Practitioner",
  dim_foundations: 7,
  dim_problemFraming: 6,
  // ... all 8 dimensions
  // Per-question data:
  f02_score: 4,
  f02_choice: "B",
  f02_format: "mcq"                  // mcq | ranking | multiselect | freetext
}

// Level 3 additional fields
{
  boss_scenario: "clinic_support",
  boss_phase1_rating: 3,             // planning
  boss_phase2_rating: 2,             // execution sub-tasks (averaged)
  boss_phase3_rating: 3,             // reflection
  boss_result: "pass"                // pass | fail
}
```

---

## Scoring & Thresholds

### Level 1 (Quick Scan)

16 questions × 4 pts max = 64 pts max. Score displayed as percentage.

| Level | Percentage | Unlocks |
|---|---|---|
| Novice | 25-56% | Nothing |
| Apprentice | 57-68% | Level 2 |
| Practitioner | 69-81% | Level 2 |
| Master | 82-100% | Level 2 |

### Level 2 (Mixed Format)

~12 questions × 4 pts max = ~48 pts max. Combined with L1 for overall level.

| Combined Level | Unlocks |
|---|---|
| Novice / Apprentice | Retry tips |
| Practitioner | Level 3 (Boss Challenge) |
| Master | Level 3 (Boss Challenge) |

### Level 3 (Boss Challenge)

5 self-assessed components (1-4 scale each). Average >= 2.5 = Pass.

---

## Session Model

- **L1 → L2:** Continuous session. After L1 results, "Continue" button navigates to `level2.html`. Session state in localStorage.
- **L3:** Separate session. User returns to landing page, clicks unlocked Boss Challenge card. Can be attempted at a different time.
- **Partial progress:** Each level submits independently to Google Sheets. If user closes browser after L1, their L1 data is preserved.
