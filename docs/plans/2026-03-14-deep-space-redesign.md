# Deep Space Visual Redesign

**Date:** 2026-03-14
**Status:** Approved
**Preview:** `preview-redesign.html`

## Summary

Full visual overhaul of the AI IQ Test from purple glassmorphism to a "Deep Space" blue/orange palette. Same functionality, layout (560px narrow column), and structure. Futuristic/techy direction, refined and warmer.

## Color System

```
Background:     #06080f  (unchanged near-black)
Elevated:       #0c1222  (dark navy)
Card:           rgba(12, 18, 40, 0.65)  (blue-tinted glass)

Primary:        #2563eb  (royal blue)
Primary light:  #60a5fa  (soft blue)
Primary dark:   #1d4ed8  (deep blue)

Accent:         #f59e0b  (warm amber)
Accent light:   #fbbf24  (bright gold)

Cyan:           #38bdf8  (sky blue — secondary)

Text:           #e2e8f0  (cool white)
Text dim:       #7c8ea3  (blue-gray)
Text muted:     #5b6b82  (dark blue-gray)

Border:         rgba(37, 99, 235, 0.12)  (blue-tinted)
```

### Dimension Colors
| Dimension | Color |
|-----------|-------|
| Foundations | #60a5fa |
| Problem Framing | #f472b6 |
| Tool Selection | #f59e0b |
| Prompting | #34d399 |
| Critical Eval | #fb923c |
| Ethics & Safety | #a78bfa |
| Collaboration | #38bdf8 |
| Vibe Coding | #f97316 |

## Design Decisions

### Ambient Background
- Blue nebula gradient top-left (opacity 0.12)
- Two amber radial glows bottom-right + bottom-left (opacity 0.10, 0.07)
- Cyan center glow (opacity 0.04)
- Keep noise texture overlay

### Orange Warmth Distribution
Orange/amber appears in these key spots to balance the blue:
- Landing orbs: amber orb is second-largest, brighter
- Badge glow: alternates blue → amber pulse
- Progress bar: gradient ends in amber
- Selected choice: amber border + amber letter badge
- Input focus ring: amber
- Score number: amber-first gradient (amber → gold → blue → cyan)
- Score glow: amber center → blue fade
- Analysis card top bar: blue → amber gradient
- Share card: blue-to-amber gradient bg + amber radial glow
- Share button: blue-to-amber animated gradient
- Button hover: subtle amber glow mixed in

### What Stays the Same
- Dark background (#06080f)
- Narrow single column (560px max)
- Outfit + Space Mono fonts
- Scenario images in 16:10 frame
- All functionality, animations, and interactions
- Glassmorphism card style (backdrop-filter blur)
- Overall layout and screen flow

## Scope of Changes

1. **CSS variables** — replace all purple/violet references with blue/amber
2. **Ambient gradients** — body::before nebula colors
3. **Buttons** — primary, outline, share gradients + shadows
4. **Cards** — border color, shimmer tint
5. **Choice buttons** — selected state → amber
6. **Progress bar** — gradient colors
7. **Landing page** — orb colors, badge glow, pill colors
8. **Results page** — score gradient, gauge, level badges, radar chart colors
9. **Analysis card** — top bar gradient, highlight text color
10. **Share card** — gradient + glow
11. **Report HTML template** — swap purple → blue/amber
12. **Certificate HTML template** — swap purple → blue/amber
13. **Confetti** — particle colors to blue/amber/cyan
14. **Input focus** — amber ring
15. **meta theme-color** — keep #06080f (unchanged)

---

# Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reskin the AI IQ Test from purple glassmorphism to "Deep Space" blue/amber palette.

**Architecture:** Pure CSS variable + inline color swaps in a single file (`index.html`). No structural changes. Reference `preview-redesign.html` for the approved look.

**Tech Stack:** Vanilla HTML/CSS/JS (single-file app)

---

### Task 1: CSS Variables & Ambient Background

**Files:**
- Modify: `index.html` (lines 31-69, the `:root` block and `body::before`/`body::after`)

**Step 1: Replace CSS custom properties**

Old → New mappings:
```
--primary:#a78bfa          → --primary:#2563eb
--primary-light:#c4b5fd    → --primary-light:#60a5fa
--primary-dark:#7c3aed     → --primary-dark:#1d4ed8
--accent:#fbbf24           → --accent:#f59e0b
--accent-glow:rgba(251,191,36,.35) → --accent-glow:rgba(245,158,11,.3)
--bg-elevated:#0d1117      → --bg-elevated:#0c1222
--bg-card:rgba(15,20,35,.65) → --bg-card:rgba(12,18,40,.65)
--border:rgba(255,255,255,.08) → --border:rgba(37,99,235,.12)
--border-active:rgba(167,139,250,.5) → --border-active:rgba(96,165,250,.5)
--text:#e8eaf0             → --text:#e2e8f0
--text-dim:#7c8599         → --text-dim:#7c8ea3
--text-muted:#6a7688       → --text-muted:#5b6b82
```

Dimension color vars:
```
--dim-foundations:#818cf8   → --dim-foundations:#60a5fa
--dim-tool:#fbbf24         → --dim-tool:#f59e0b
--dim-critical:#fb7185     → --dim-critical:#fb923c
--dim-ethics:#c084fc       → --dim-ethics:#a78bfa
--dim-vibe:#fb923c         → --dim-vibe:#f97316
```
(--dim-problem, --dim-prompt, --dim-collab stay the same)

**Step 2: Replace ambient gradients in body::before**

Replace `rgba(124,58,237,.12)` purple gradient with `rgba(29,78,216,.12)` blue.
Add second amber radial: `radial-gradient(ellipse 70% 55% at 85% 75%,rgba(245,158,11,.10) 0%,transparent 50%)`.
Add third amber: `radial-gradient(ellipse 40% 40% at 10% 90%,rgba(249,115,22,.07) 0%,transparent 45%)`.
Change cyan from `rgba(34,211,238,.08)` to `rgba(56,189,248,.04)`.

**Step 3: Replace glow variables**

```
--glow-sm:0 0 15px rgba(167,139,250,.15)  → 0 0 15px rgba(37,99,235,.15)
--glow-md:0 0 30px rgba(167,139,250,.2)   → 0 0 30px rgba(37,99,235,.2)
--glow-lg:0 4px 60px rgba(167,139,250,.25) → 0 4px 60px rgba(37,99,235,.25)
```

**Step 4: Verify** — open in browser, confirm background gradients look correct.

**Step 5: Commit** — `git commit -m "feat: update CSS variables and ambient bg to Deep Space palette"`

---

### Task 2: Buttons, Cards & Inputs

**Files:**
- Modify: `index.html` (CSS section, lines ~105-176)

**Step 1: Update button styles**

`.btn-primary` gradient: `linear-gradient(135deg,var(--primary-dark),var(--primary))` — already uses vars, should auto-update. But update box-shadow:
- `rgba(124,58,237,.3)` → `rgba(29,78,216,.3)`
- hover: `rgba(124,58,237,.45)` → add amber: `0 6px 25px rgba(29,78,216,.35),0 2px 15px rgba(245,158,11,.15)`

`.btn-outline`:
- border: `rgba(255,255,255,.08)` → already var(--border)
- hover border uses `var(--border-active)` — already updated via vars
- hover bg: `rgba(167,139,250,.06)` → `rgba(37,99,235,.06)`

`.btn-share`:
- gradient: `linear-gradient(135deg,var(--primary-dark),#6d28d9,var(--cyan))` → `linear-gradient(135deg,var(--primary-dark),var(--primary),var(--accent))`
- shadow: `rgba(124,58,237,.35)` → `0 4px 25px rgba(29,78,216,.25),0 2px 15px rgba(245,158,11,.2)`

**Step 2: Update card shimmer**

`.card::before` gradient: `rgba(255,255,255,.03)` → `rgba(96,165,250,.03)`

**Step 3: Update input focus**

`.input-group input:focus` and `.input-group select:focus`:
- border-color: var(--primary) → var(--accent)
- box-shadow: `rgba(167,139,250,.15)` → `rgba(245,158,11,.12)`

**Step 4: Verify** — check buttons, cards, inputs in browser.

**Step 5: Commit** — `git commit -m "feat: update buttons, cards, inputs to Deep Space palette"`

---

### Task 3: Choice Buttons, Progress Bar & Dots

**Files:**
- Modify: `index.html` (CSS section, lines ~178-263)

**Step 1: Update progress bar**

`.progress-fill` gradient: add amber at end:
`linear-gradient(90deg,var(--primary-dark),var(--primary),var(--cyan))` → `linear-gradient(90deg,var(--primary-dark),var(--primary),var(--cyan),var(--accent))`
Shadow: `rgba(167,139,250,.4)` → `rgba(37,99,235,.4)`

**Step 2: Update progress dots**

`.dot.answered`: already uses `var(--primary)` — auto-updates.
Shadow: `rgba(167,139,250,.3)` → `rgba(37,99,235,.3)`
`.dot.current`: `rgba(34,211,238,.4)` → keep (cyan stays).

**Step 3: Update choice buttons**

`.choice-btn:hover`: `rgba(167,139,250,.3)` → `rgba(96,165,250,.3)`

`.choice-btn.selected`:
- border-color: `var(--primary)` → `var(--accent)`
- background: `rgba(167,139,250,.08)` → `rgba(245,158,11,.06)`
- box-shadow: `rgba(167,139,250,.1)` → `rgba(245,158,11,.1)`

`.choice-btn.selected .choice-letter`:
- background: `var(--primary)` → `var(--accent)`
- color: `#fff` → `#0c1222` (dark text on amber)
- box-shadow: `rgba(167,139,250,.4)` → `rgba(245,158,11,.4)`

**Step 4: Verify** — check quiz question screen.

**Step 5: Commit** — `git commit -m "feat: update choices, progress bar to Deep Space palette"`

---

### Task 4: Landing Page

**Files:**
- Modify: `index.html` (CSS lines ~267-299, HTML lines ~476-521)

**Step 1: Update landing orbs**

CSS:
- `.orb-1`: keep `var(--primary-dark)` — auto-updates
- `.orb-2`: `background:var(--cyan)` → `background:var(--accent)`, size `90px` → `100px`, opacity add `.7`
- `.orb-3`: `background:var(--accent)` → `background:var(--cyan)`, size `70px` → `80px`

**Step 2: Update IQ badge glow**

`@keyframes glowPulse`:
```
0%,100%{box-shadow:0 0 20px rgba(167,139,250,.15)}50%{box-shadow:0 0 40px rgba(167,139,250,.3)}
```
→
```
0%{box-shadow:0 0 20px rgba(37,99,235,.15)}33%{box-shadow:0 0 35px rgba(37,99,235,.3)}66%{box-shadow:0 0 35px rgba(245,158,11,.2)}100%{box-shadow:0 0 20px rgba(37,99,235,.15)}
```

`.iq-badge-big`:
- background: `rgba(124,58,237,.15)` → `rgba(29,78,216,.15)`
- border: `rgba(167,139,250,.3)` → `rgba(96,165,250,.3)`

**Step 3: Update dimension pill colors in HTML**

Replace inline styles for each pill to match new dimension colors:
- Foundations: `rgba(129,140,248,.15)` / `#818cf8` → `rgba(96,165,250,.15)` / `#60a5fa`
- Tool Selection: keep `#fbbf24` → `#f59e0b`
- Critical Eval: `rgba(251,113,133,.15)` / `#fb7185` → `rgba(251,146,60,.15)` / `#fb923c`
- Ethics: `rgba(192,132,252,.15)` / `#c084fc` → `rgba(167,139,250,.15)` / `#a78bfa`
- Vibe Coding: keep `#fb923c` → `#f97316`

**Step 4: Update landing stats dots**

In HTML: first dot `#2563eb`, keep cyan and amber as-is.

**Step 5: Verify** — check landing page.

**Step 6: Commit** — `git commit -m "feat: update landing page to Deep Space palette"`

---

### Task 5: Results Page (Score, Gauge, Level Badges)

**Files:**
- Modify: `index.html` (CSS lines ~308-344)

**Step 1: Update score number gradient**

`.iq-score-num` background:
`linear-gradient(135deg,var(--primary-light),var(--cyan),var(--accent))` → `linear-gradient(135deg,var(--accent),var(--accent-light),var(--primary-light),var(--cyan))`

Score glow (`.iq-score-wrap::before`):
`rgba(124,58,237,.2)` → `rgba(245,158,11,.15),rgba(29,78,216,.1) 50%,transparent 70%` (amber center to blue)

**Step 2: Update level badges**

- `.iq-level-4` (Master): `rgba(167,139,250,.12)` / `var(--primary-light)` / `rgba(167,139,250,.25)` → `rgba(96,165,250,.12)` / `var(--primary-light)` / `rgba(96,165,250,.25)`

**Step 3: Verify** — check results score display.

**Step 4: Commit** — `git commit -m "feat: update results page score/gauge to Deep Space palette"`

---

### Task 6: Radar Chart, Analysis Card & Share Card

**Files:**
- Modify: `index.html` (JS lines ~973-1066 for radar, CSS lines ~363-404 for analysis/share)

**Step 1: Update radar chart colors in JS**

`drawRadar()` function:
- `colors` array (line ~1000): `['#818cf8','#f472b6','#fbbf24','#34d399','#fb7185','#c084fc','#38bdf8','#fb923c']` → `['#60a5fa','#f472b6','#f59e0b','#34d399','#fb923c','#a78bfa','#38bdf8','#f97316']`
- Glow shadow (line ~1038): `rgba(167,139,250,.5)` → `rgba(37,99,235,.5)`
- Glow fill (line ~1039): `rgba(167,139,250,.1)` → `rgba(37,99,235,.1)`
- Polygon gradient (line ~1052): `rgba(129,140,248,.15)` → `rgba(37,99,235,.15)`
- Polygon gradient stop 2 (line ~1053): `rgba(34,211,238,.1)` → `rgba(245,158,11,.08)`
- Polygon stroke (line ~1055): `rgba(167,139,250,.6)` → `rgba(96,165,250,.6)`

**Step 2: Update analysis card CSS**

`.analysis-card::before` gradient:
`linear-gradient(90deg,var(--primary-dark),var(--primary),var(--cyan))` → `linear-gradient(90deg,var(--primary-dark),var(--primary),var(--accent),var(--accent-light))`

Border: `rgba(167,139,250,.2)` → `rgba(37,99,235,.2)` (already uses blue via var update? check)

**Step 3: Update share card CSS**

`.share-card`:
- background: `rgba(124,58,237,.3),rgba(109,40,217,.2)` → `rgba(29,78,216,.25),rgba(245,158,11,.1)`
- border: `rgba(167,139,250,.25)` → `rgba(245,158,11,.2)`

`.share-card::before`:
- `rgba(34,211,238,.08)` → `rgba(245,158,11,.08)`

**Step 4: Verify** — check radar chart, analysis, share card.

**Step 5: Commit** — `git commit -m "feat: update radar, analysis, share card to Deep Space palette"`

---

### Task 7: Share Image Canvas & Confetti

**Files:**
- Modify: `index.html` (JS lines ~1152-1238 for share image, ~1540-1573 for confetti)

**Step 1: Update share image canvas colors**

`shareAsImage()` function:
- Glow (line ~1170): `rgba(124,58,237,.12)` → `rgba(245,158,11,.1)` + add second glow: `rgba(29,78,216,.12)`
- Border (line ~1174): `rgba(167,139,250,.3)` → `rgba(96,165,250,.3)`
- Score gradient (line ~1188): `#c4b5fd` → `#f59e0b`, `#22d3ee` → `#fbbf24`, `#fbbf24` → `#60a5fa`
- Level colors (line ~1193): `4:'#c4b5fd'` → `4:'#60a5fa'`
- dimColors (line ~1201): same swap as radar: `['#818cf8',...` → `['#60a5fa','#f472b6','#f59e0b','#34d399','#fb923c','#a78bfa','#38bdf8','#f97316']`
- Radar fill (line ~1216): `rgba(167,139,250,.15)` → `rgba(37,99,235,.15)`
- Radar stroke (line ~1217): `rgba(167,139,250,.6)` → `rgba(96,165,250,.6)`

**Step 2: Update confetti colors**

Line ~1543: `['#a78bfa','#c4b5fd','#22d3ee','#fbbf24','#34d399','#fb7185','#f472b6','#818cf8']`
→ `['#2563eb','#60a5fa','#38bdf8','#f59e0b','#fbbf24','#f97316','#34d399','#fb923c']`

**Step 3: Verify** — download a share image, trigger confetti.

**Step 4: Commit** — `git commit -m "feat: update share image and confetti to Deep Space palette"`

---

### Task 8: Report & Certificate HTML Templates

**Files:**
- Modify: `index.html` (JS lines ~1348-1401 for report, ~1415-1480 for certificate)

**Step 1: Update dimColors object (report)**

Line ~1348: `{foundations:'#818cf8',...}` →
`{foundations:'#60a5fa',problemFraming:'#f472b6',toolSelection:'#f59e0b',promptEngineering:'#34d399',criticalEvaluation:'#fb923c',ethicsSafety:'#a78bfa',humanCollaboration:'#38bdf8',vibeCoding:'#f97316'}`

**Step 2: Update report HTML template colors**

- `.score-big` gradient (line ~1374): `#c4b5fd,#22d3ee,#fbbf24` → `#f59e0b,#fbbf24,#60a5fa`
- `.section h2` color (line ~1377): `#c4b5fd` → `#60a5fa`
- `levelColors` (line ~1366): `4:'#c4b5fd'` → `4:'#60a5fa'`
- Print `.score-big` fill (line ~1381): `#7c3aed` → `#1d4ed8`
- Print `.level-badge` (line ~1384): `#7c3aed` → `#1d4ed8`
- Print `.section h2` (line ~1385): `#7c3aed` → `#1d4ed8`
- Analysis box border (line ~1398): `rgba(167,139,250,.15)` → `rgba(37,99,235,.15)`
- Review item border-left (line ~1363): uses `${color}` from dimColors — auto-updates

**Step 3: Update certificate HTML template colors**

- `levelColors` (line ~1424): `4:['#c4b5fd','#a78bfa']` → `4:['#60a5fa','#2563eb']`
- `dimColors2` (line ~1427): `['#818cf8','#f472b6','#fbbf24','#34d399','#fb7185','#c084fc','#38bdf8','#fb923c']` → `['#60a5fa','#f472b6','#f59e0b','#34d399','#fb923c','#a78bfa','#38bdf8','#f97316']`
- `.cert` border (line ~1436): `rgba(167,139,250,.2)` → `rgba(37,99,235,.2)`
- `.cert::before` (line ~1437): `rgba(167,139,250,.1)` → `rgba(37,99,235,.1)`
- `.cert::after` (line ~1438): `rgba(124,58,237,.08)` → `rgba(29,78,216,.08)`
- `.orb1` (line ~1439): `rgba(124,58,237,.12)` → `rgba(29,78,216,.12)`
- `.orb2` (line ~1440): `rgba(34,211,238,.08)` → `rgba(245,158,11,.08)`
- `.cert-name` gradient (line ~1446): `#fff,#c4b5fd` → `#fff,#60a5fa`
- `.score-num` gradient (line ~1448): `${lc1},#22d3ee` → `${lc1},#38bdf8`

**Step 4: Verify** — download report and certificate, check colors.

**Step 5: Commit** — `git commit -m "feat: update report and certificate templates to Deep Space palette"`

---

### Task 9: Remaining Inline Colors & Cleanup

**Files:**
- Modify: `index.html` — grep for any remaining purple references

**Step 1: Search and replace remaining hardcoded purple colors**

Search for these patterns and replace:
- `#a78bfa` → `#2563eb` (only in non-dimension contexts)
- `#c4b5fd` → `#60a5fa` (only in non-dimension contexts)
- `#7c3aed` → `#1d4ed8`
- `rgba(167,139,250` → `rgba(37,99,235` (in CSS) or `rgba(245,158,11` (for warm contexts)
- `rgba(124,58,237` → `rgba(29,78,216`
- `#818cf8` → `#60a5fa` (dimension: foundations)
- `#fbbf24` → `#f59e0b` (dimension: tool selection — careful, some fbbf24 is accent-light)
- `#fb7185` → `#fb923c` (dimension: critical eval — careful, some fb7185 is Novice level)
- `#c084fc` → `#a78bfa` (dimension: ethics)
- `#fb923c` → `#f97316` (dimension: vibe coding)

Be careful: some colors have dual use (e.g., `#fb7185` is both Novice level AND old critical eval dimension). Only change dimension contexts.

**Step 2: Update inline HTML colors**

Dimension badge inline styles in the results HTML, review section colors, and any remaining inline `style=` attributes referencing old purple colors.

**Step 3: Full visual test** — walk through entire flow: landing → welcome → quiz (answer a few) → results. Check every screen.

**Step 4: Commit** — `git commit -m "feat: clean up remaining purple references in Deep Space reskin"`

---

### Task 10: Delete Preview File & Final Commit

**Step 1: Delete** `preview-redesign.html` — it was only for design review.

**Step 2: Final visual walkthrough** — complete a full test run.

**Step 3: Commit** — `git commit -m "chore: remove redesign preview file"`
