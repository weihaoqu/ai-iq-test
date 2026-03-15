# Quick Mode Design

**Date:** 2026-03-14
**Status:** Approved

## Summary

Add a "Quick Assessment" mode (8 questions, ~2 min) alongside the existing "Full Assessment" (45 questions, ~10 min). Both modes live in the same `index.html`, selected via side-by-side cards on the landing page.

## Landing Page

Two equal-weight cards replace the single "Start Test" button:
- **Quick card**: amber accent, custom SVG speedometer icon, "8 questions / ~2 minutes / Score + radar"
- **Full card**: blue accent, custom SVG radar/constellation icon, "45 questions / ~10 minutes / Full analysis / Report & certificate"
- On mobile: cards stack vertically
- Existing dim pills, stats row, how-it-works cards stay above

## Question Selection (Quick Mode)

- 1 random question per dimension = 8 total
- Randomly picked from each dimension's pool each attempt
- Choice order shuffled (same as full test)
- Question order: shuffled across dimensions

## Scoring (Quick Mode)

- Raw: 8-32 (each question 1-4)
- Display: **percentage only** (e.g., "78%")
- Level thresholds (by percentage):
  - Novice: 25-66%
  - Apprentice: 67-77%
  - Practitioner: 78-88%
  - Master: 89-100%

## Quick Results Page

**Included:**
- Percentage score (animated gradient text)
- Level badge
- Radar chart (8 axes, 1 question each)
- Dimension bars (percentage per dimension)
- Share URL, share image
- Confetti (Apprentice+)
- Retake button
- Upsell card: "Want deeper insights? Take the full 45-question assessment"

**Excluded:**
- Analysis text (not enough data from 1 question per dimension)
- Report download
- Certificate download

## Google Sheets Submission

- Same POST endpoint
- New field: `test_mode` ("quick" or "full")
- Quick mode sends: participant_id, participant_name, timestamp, ai_experience, total_score (raw), percentage, level, duration_seconds, test_mode
- Per-question: only the 8 randomly selected question IDs with scores/choices (other columns empty)

## URL & State

- Mode stored in JS variable: `testMode = 'quick' | 'full'`
- Share URLs: `?mode=quick&s=...` vs `?mode=full&s=...`
- localStorage: separate keys per mode for last result
- Landing page shows previous results for both modes if they exist

## What Stays the Same

- Welcome screen (name + experience)
- Quiz UI (progress bar, dots, image, choices, nav)
- Timer
- Deep Space palette
- All full test functionality unchanged
