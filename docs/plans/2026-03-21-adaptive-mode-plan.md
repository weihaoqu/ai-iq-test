# Adaptive Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 3-level adaptive assessment (L1 Quick Scan → L2 Mixed Format → L3 Boss Challenge) by splitting the monolithic `index.html` into modular pages with shared infrastructure.

**Architecture:** Extract shared CSS/JS from `index.html` into `shared/` modules. Each level gets its own HTML file that imports shared modules. State passes between levels via `adaptive_session` in localStorage. Level 2 introduces 3 new question formats (ranking, multi-select, free-text with self-assessment). Level 3 is a multi-step case study with pass/fail grading.

**Tech Stack:** Vanilla HTML/CSS/JS (no build step), Three.js (shader), Zdog (3D tutors), Google Apps Script (data submission), localStorage (state). **No frameworks.**

**Design doc:** `docs/plans/2026-03-21-adaptive-mode-design.md`
**Stitch UI spec:** `docs/plans/2026-03-21-stitch-ui-spec.md`

---

## Task 1: Create `shared/` Directory and Extract CSS

**Files:**
- Create: `shared/styles.css`
- Modify: `index.html` (remove inline styles, add `<link>`)

**Step 1: Create `shared/styles.css`**

Extract everything between `<style>` and `</style>` in `index.html` (lines 33-641+) into `shared/styles.css`. This is the entire CSS block — copy it verbatim.

**Step 2: Replace inline styles in `index.html`**

Replace the `<style>...</style>` block with:
```html
<link rel="stylesheet" href="shared/styles.css">
```

**Step 3: Verify `index.html` still renders correctly**

Open `index.html` in browser. Verify:
- Landing page renders with glassmorphism cards, shader background, robot mascot
- Both mode cards (Quick/Full) display correctly
- All animations work (glow pulse, float, shimmer)

**Step 4: Commit**

```bash
git add shared/styles.css index.html
git commit -m "refactor: extract CSS into shared/styles.css"
```

---

## Task 2: Extract Shared JavaScript into Modules

**Files:**
- Create: `shared/engine.js`
- Create: `shared/shader.js`
- Create: `shared/submit.js`
- Create: `shared/components.js`
- Modify: `index.html`

**Step 1: Create `shared/engine.js`**

Extract these functions/constants from `index.html` `<script>` block:

```javascript
// shared/engine.js — Shared quiz engine utilities

// ─── Constants ──────────────────────────────────────────────────────────
const DIMS = [
  // Copy the DIMS array from index.html (line ~1117)
];

const LEVELS = [
  // Copy from index.html (line ~1128)
];

const QUICK_LEVELS = [
  // Copy from index.html
];

// ─── Utilities ──────────────────────────────────────────────────────────
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  // Copy from index.html (line ~1183)
}

function showToast(msg) {
  // Copy from index.html
}

function animateCount(el, target, duration) {
  // Copy from index.html
}

// ─── Timer ──────────────────────────────────────────────────────────────
let timerInterval = null;
function startTimer(quizStartTime) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!quizStartTime) return;
    const el = document.getElementById('q-timer');
    if (!el) return;
    const secs = Math.floor((Date.now() - quizStartTime) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    el.textContent = `${m}:${String(s).padStart(2, '0')}`;
  }, 1000);
}
function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ─── Radar Chart ────────────────────────────────────────────────────────
function drawRadar(dimScores, canvasId, dimMax) {
  // Copy drawRadar from index.html, parameterize canvas ID and dimMax
}

// ─── Confetti ───────────────────────────────────────────────────────────
function launchConfetti() {
  // Copy from index.html
}

// ─── Adaptive Session (localStorage) ────────────────────────────────────
const ADAPTIVE_KEY = 'adaptive_session';

function getAdaptiveSession() {
  try {
    return JSON.parse(localStorage.getItem(ADAPTIVE_KEY)) || {};
  } catch { return {}; }
}

function saveAdaptiveSession(data) {
  const session = getAdaptiveSession();
  Object.assign(session, data);
  localStorage.setItem(ADAPTIVE_KEY, JSON.stringify(session));
}

function clearAdaptiveSession() {
  localStorage.removeItem(ADAPTIVE_KEY);
}
```

**Step 2: Create `shared/shader.js`**

Extract the `initShader` IIFE from index.html (line ~2168-2240):

```javascript
// shared/shader.js — Three.js animated background
function initShader() {
  // Copy the initShader function body from index.html
  // Remove the IIFE wrapper — just export the function
}

// Auto-init when Three.js is ready
if (typeof THREE !== 'undefined') {
  initShader();
} else {
  window.addEventListener('DOMContentLoaded', () => setTimeout(initShader, 100));
}
```

**Step 3: Create `shared/submit.js`**

Extract the Google Sheets submission logic:

```javascript
// shared/submit.js — Google Sheets data submission
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSnBFnM8Q29m7hoRbpHmhYo85_ZXkTR1qcp1n7Q_kXOLBzJClWw0qgHAyrrK017TVJPQ/exec';

function submitToSheets(payload) {
  // Copy the iframe+form submission logic from index.html
  // Also save to localStorage as backup
}
```

**Step 4: Create `shared/components.js`**

Extract reusable UI components:

```javascript
// shared/components.js — Shared UI components

// Feedback modal (face slider + comment)
function showFeedbackModal() { /* copy from index.html */ }
function submitFeedback(tone, comment) { /* copy */ }

// Level indicator component (L1 ○ → L2 ○ → L3 ○)
function renderLevelIndicator(container, currentLevel) {
  const levels = [
    { num: 1, label: 'Quick Scan' },
    { num: 2, label: 'Deep Dive' },
    { num: 3, label: 'Boss Challenge' }
  ];
  container.innerHTML = levels.map((l, i) => {
    let state = 'empty';
    const session = getAdaptiveSession();
    if (l.num < currentLevel) state = 'completed';
    else if (l.num === currentLevel) state = 'active';
    const dot = state === 'completed' ? '✓' : state === 'active' ? '●' : '○';
    const cls = state === 'active' ? 'level-dot active' : state === 'completed' ? 'level-dot completed' : 'level-dot';
    return `<span class="${cls}">${dot}</span>${i < 2 ? '<span class="level-line"></span>' : ''}`;
  }).join('') + '<div class="level-labels">' + levels.map(l =>
    `<span class="level-label">${l.label}</span>`
  ).join('') + '</div>';
}

// Self-assessment overlay (used by L2 and L3)
function showSelfAssessment(config) {
  // config: { correctAnswer, explanation, onRate(score) }
  // Creates slide-up overlay with correct answer + 4-point rating
}
```

**Step 5: Update `index.html` to use shared modules**

Replace the `<script>` block in `index.html`. Remove all extracted functions/constants. Add at the bottom of `<head>`:

```html
<script src="shared/engine.js" defer></script>
<script src="shared/shader.js" defer></script>
<script src="shared/submit.js" defer></script>
<script src="shared/components.js" defer></script>
```

Keep in `index.html`'s inline `<script>` only:
- `QUESTIONS` array (the 48 questions)
- `testMode`, `currentQ`, `activeQuestions`, `answers`, etc. (page-specific state)
- `startTest()`, `beginQuiz()`, `renderQuestion()`, `selectChoice()`, `goBack()`, `goNext()`, `buildResults()` (page-specific flow)
- `selectQuickQuestions()` (page-specific)
- `generateAnalysis()`, `DIM_INSIGHTS` (page-specific)
- Keyboard/swipe handlers (page-specific)
- Share URL check IIFE (page-specific)

**Step 6: Verify everything still works**

Open `index.html`. Test:
- Landing page loads
- Quick mode: start → answer 16 questions → results
- Full mode: start → answer 48 questions → results
- Google Sheets submission fires
- Feedback modal appears
- Downloads/sharing work

**Step 7: Commit**

```bash
git add shared/ index.html
git commit -m "refactor: extract shared JS modules (engine, shader, submit, components)"
```

---

## Task 3: Update Landing Page with Adaptive Mode Card

**Files:**
- Modify: `index.html` (HTML section for landing)
- Modify: `shared/styles.css` (new card styles)

**Step 1: Add Adaptive Assessment card to landing**

In `index.html`, find the `.mode-cards` div (contains the Quick and Full electric cards). Add a third card between them — or restructure to 3 cards. The new card:

```html
<!-- Adaptive Assessment card -->
<div class="ec-wrap ec-wrap--adaptive" onclick="location.href='level1.html'">
  <!-- Same electric card structure as existing cards -->
  <!-- Badge: "NEW" -->
  <!-- Title: "Adaptive Assessment" -->
  <!-- Desc: "3 levels · Adapts to your skills · Unlock the Boss Challenge" -->
  <!-- Button: "Begin Level 1 →" -->
  <!-- Add level dots: L1 ○ → L2 ○ → L3 ○ -->
</div>
```

Use a cyan-to-amber gradient for the adaptive card (distinct from blue/orange).

**Step 2: Add Boss Challenge card (locked state)**

```html
<div class="ec-wrap ec-wrap--boss" id="boss-card">
  <!-- Locked by default, check localStorage on load -->
  <!-- Locked: greyed out, lock icon, "Complete Adaptive at Practitioner level" -->
  <!-- Unlocked: amber glow, "UNLOCKED" badge, links to level3.html -->
</div>
```

**Step 3: Add lock-check logic**

In `index.html`'s inline script, on page load:

```javascript
(function checkBossUnlock() {
  const session = getAdaptiveSession();
  const card = document.getElementById('boss-card');
  if (!card) return;
  if (session.level3Unlocked) {
    card.classList.add('unlocked');
    card.onclick = () => location.href = 'level3.html';
  } else {
    card.classList.add('locked');
    card.onclick = null;
  }
})();
```

**Step 4: Add new CSS for adaptive/boss cards**

In `shared/styles.css`:

```css
/* Adaptive = cyan-amber gradient */
.ec-wrap--adaptive .ec-card { /* cyan/amber gradient */ }
.ec-wrap--adaptive .ec-btn { background: linear-gradient(135deg, #0891b2, #22d3ee); }

/* Boss = locked/unlocked states */
.ec-wrap--boss.locked { opacity: 0.4; pointer-events: none; filter: grayscale(0.5); }
.ec-wrap--boss.unlocked .ec-card { /* amber glow border */ }
.ec-wrap--boss.unlocked .ec-btn { background: linear-gradient(135deg, #d97706, #f59e0b); }

/* Level indicator dots */
.level-indicator { display: flex; align-items: center; gap: 8px; justify-content: center; margin-top: 8px; }
.level-dot { font-size: 0.8rem; color: var(--text-muted); }
.level-dot.active { color: var(--cyan); text-shadow: 0 0 8px var(--cyan-glow); }
.level-dot.completed { color: var(--accent); }
.level-line { width: 20px; height: 1px; background: var(--border); }
```

**Step 5: Verify landing page**

- 3 mode cards visible (Quick, Full, Adaptive) — or 4 if Boss is separate
- Boss card locked by default
- Clicking Adaptive card navigates to `level1.html` (404 for now — expected)

**Step 6: Commit**

```bash
git add index.html shared/styles.css
git commit -m "feat: add Adaptive Assessment and Boss Challenge cards to landing"
```

---

## Task 4: Create Level 1 (`level1.html`)

**Files:**
- Create: `level1.html`
- Create: `questions/level1.json` (copy of `questions.json`)

**Step 1: Create `questions/level1.json`**

```bash
cp questions.json questions/level1.json
```

**Step 2: Create `level1.html`**

This is a slimmed-down version of `index.html` that only has:
- Welcome screen (name + experience)
- Question screen (MCQ)
- Results screen (with gate logic)

Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI IQ Test — Level 1: Quick Scan</title>
  <!-- Same fonts, preconnects -->
  <link rel="stylesheet" href="shared/styles.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
  <script src="shared/engine.js" defer></script>
  <script src="shared/shader.js" defer></script>
  <script src="shared/submit.js" defer></script>
  <script src="shared/components.js" defer></script>
</head>
<body>
  <div id="shader-bg"></div>
  <div class="app">
    <!-- Level indicator -->
    <div class="level-indicator" id="level-indicator"></div>

    <!-- Welcome screen -->
    <div id="screen-welcome" class="screen active">
      <h1>Level 1: Quick Scan</h1>
      <p class="subtitle">16 questions · ~4 minutes · Test your AI foundations</p>
      <div class="card">
        <div class="input-group">
          <label for="inp-name">Your name</label>
          <input type="text" id="inp-name" placeholder="Anonymous hero">
        </div>
        <div class="input-group">
          <label for="inp-background">AI Experience</label>
          <select id="inp-background">
            <option value="">Select...</option>
            <option value="never">Never used AI</option>
            <option value="beginner">Tried a few times</option>
            <option value="regular">Use regularly</option>
            <option value="daily">Use daily for work</option>
          </select>
        </div>
        <button class="btn btn-primary btn-full btn-lg" onclick="beginQuiz()">Start Quick Scan →</button>
      </div>
    </div>

    <!-- Question screen (same structure as index.html) -->
    <div id="screen-question" class="screen">
      <!-- Copy question screen HTML from index.html -->
    </div>

    <!-- Results screen with gate -->
    <div id="screen-results" class="screen">
      <!-- Score display, radar, dimension bars (same as index.html quick mode) -->

      <!-- Gate section -->
      <div id="gate-section" class="card">
        <!-- Dynamically populated: continue to L2 or retry -->
      </div>
    </div>
  </div>

  <script>
    // ─── Page-specific state & logic ────────────────────────────────────
    let questions = [];
    let activeQuestions = [];
    let currentQ = 0;
    let answers = [];
    let shuffledChoices = [];
    let participantId = '';
    let participantName = '';
    let quizStartTime = null;

    // Load questions from JSON
    fetch('questions/level1.json')
      .then(r => r.json())
      .then(data => { questions = data; console.log(`${data.length} questions loaded`); });

    // Render level indicator
    document.addEventListener('DOMContentLoaded', () => {
      renderLevelIndicator(document.getElementById('level-indicator'), 1);
    });

    function selectQuickQuestions() {
      // 2 per dimension, random — same logic as index.html
      const selected = [];
      DIMS.forEach(d => {
        const pool = questions.filter(q => q.dim === d.key);
        const picked = shuffle(pool).slice(0, 2);
        selected.push(...picked);
      });
      return shuffle(selected);
    }

    function beginQuiz() {
      const bg = document.getElementById('inp-background').value;
      if (!bg) { showToast('Please select your AI experience'); return; }
      participantName = document.getElementById('inp-name').value.trim() || 'Anonymous';
      participantId = 'AIQ' + Date.now();
      quizStartTime = Date.now();
      activeQuestions = selectQuickQuestions();
      shuffledChoices = activeQuestions.map(q => shuffle(q.choices));
      currentQ = 0;
      answers = new Array(activeQuestions.length).fill(null);

      // Save session start
      saveAdaptiveSession({
        participantId,
        participantName,
        experience: bg,
        startTime: quizStartTime
      });

      startTimer(quizStartTime);
      renderQuestion();
      showScreen('screen-question');
    }

    function renderQuestion() {
      // Same as index.html renderQuestion — copy and adapt
    }

    function selectChoice(idx) {
      // Same as index.html
    }

    function goBack() { if (currentQ > 0) { currentQ--; renderQuestion(); } }

    function goNext() {
      if (!answers[currentQ]) return;
      if (currentQ < activeQuestions.length - 1) { currentQ++; renderQuestion(); }
      else {
        const unanswered = answers.findIndex(a => a === null);
        if (unanswered !== -1) {
          showToast(`Question ${unanswered + 1} is unanswered`);
          currentQ = unanswered; renderQuestion(); return;
        }
        buildResults();
        showScreen('screen-results');
      }
    }

    function buildResults() {
      stopTimer();
      const total = answers.reduce((s, a) => s + a.score, 0);
      const maxScore = activeQuestions.length * 4;
      const pct = Math.round((total / maxScore) * 100);
      const level = QUICK_LEVELS.find(l => pct >= l.min && pct <= l.max) || QUICK_LEVELS[QUICK_LEVELS.length - 1];

      // Calculate dimension scores
      const dimScores = {};
      DIMS.forEach(d => { dimScores[d.key] = 0; });
      activeQuestions.forEach((q, i) => { dimScores[q.dim] += (answers[i]?.score || 0); });

      // Animate score, render radar, dimension bars — same patterns as index.html
      // ...

      // Save to adaptive session
      saveAdaptiveSession({
        level1: {
          scores: dimScores,
          totalScore: total,
          percentage: pct,
          level: level.label,
          answers: activeQuestions.map((q, i) => ({
            qId: q.id, choiceIdx: answers[i].choiceIdx,
            origLetter: answers[i].origLetter, score: answers[i].score
          }))
        }
      });

      // Submit to Google Sheets
      submitToSheets({
        participant_id: participantId,
        participant_name: participantName,
        timestamp: new Date().toISOString(),
        ai_experience: document.getElementById('inp-background').value,
        test_mode: 'adaptive',
        level: 1,
        total_score: total,
        percentage: pct,
        result_level: level.label,
        duration_seconds: Math.round((Date.now() - quizStartTime) / 1000),
        ...Object.fromEntries(DIMS.map(d => [`dim_${d.key}`, dimScores[d.key]])),
        ...Object.fromEntries(activeQuestions.map((q, i) => [
          [`${q.id}_score`, answers[i].score],
          [`${q.id}_choice`, answers[i].origLetter],
          [`${q.id}_format`, 'mcq']
        ]).flat())
      });

      // Gate logic
      renderGate(level, pct);
    }

    function renderGate(level, pct) {
      const gate = document.getElementById('gate-section');
      const isQualified = pct >= 57; // Apprentice+ threshold

      if (isQualified) {
        gate.innerHTML = `
          <div style="border:1.5px solid var(--cyan);border-radius:var(--radius);padding:24px;text-align:center">
            <h2>You've qualified for Level 2!</h2>
            <p class="subtitle" style="margin:12px 0">Level 2 adapts to your results — focusing on your developing areas with new question formats.</p>
            <button class="btn btn-primary btn-full btn-lg" onclick="location.href='level2.html'" style="margin-top:16px">
              Continue to Level 2 →
            </button>
          </div>
        `;
      } else {
        gate.innerHTML = `
          <div style="border:1.5px solid rgba(251,113,133,.3);border-radius:var(--radius);padding:24px;text-align:center">
            <h2>You need Apprentice level to advance</h2>
            <p class="subtitle" style="margin:12px 0">Score 57%+ to unlock Level 2. Focus on your developing areas and try again.</p>
            <button class="btn btn-primary btn-full btn-lg" onclick="location.reload()" style="margin-top:16px">
              Try Again
            </button>
          </div>
        `;
      }
    }
  </script>
</body>
</html>
```

**Step 3: Verify Level 1 flow**

Open `level1.html` directly in browser:
- Welcome screen shows with level indicator (L1 ● → L2 ○ → L3 ○)
- Questions load from `questions/level1.json`
- 16 MCQ questions display correctly
- Results show with radar + dimension bars
- Gate shows "Continue to Level 2" or "Try Again" based on score
- `adaptive_session` saved in localStorage (verify via DevTools)

**Step 4: Commit**

```bash
git add level1.html questions/level1.json
git commit -m "feat: create Level 1 (Quick Scan) as standalone page"
```

---

## Task 5: Create Level 2 Question Content (`questions/level2.json`)

**Files:**
- Create: `questions/level2.json`

**Step 1: Write Level 2 questions**

Create ~4 questions per dimension across the 3 formats (ranking, multi-select, free-text). The adaptive selector will pick from these based on L1 results.

JSON structure:

```json
[
  {
    "id": "l2-f01",
    "dim": "foundations",
    "dimLabel": "AI Foundations",
    "format": "ranking",
    "q": "Rank these explanations of why AI models hallucinate from most to least accurate:",
    "items": [
      { "text": "The model generates statistically plausible text that isn't grounded in verified facts", "correctRank": 1 },
      { "text": "Training data contained errors that the model memorized", "correctRank": 2 },
      { "text": "The model tries to be helpful and fabricates answers rather than saying 'I don't know'", "correctRank": 3 },
      { "text": "The model's internet connection was interrupted during generation", "correctRank": 4 }
    ],
    "explanation": "Hallucination is primarily a statistical generation issue..."
  },
  {
    "id": "l2-f02",
    "dim": "foundations",
    "dimLabel": "AI Foundations",
    "format": "multiselect",
    "q": "Which of the following are TRUE about how large language models work? Select all that apply.",
    "options": [
      { "text": "They predict the next token based on learned patterns", "correct": true },
      { "text": "They store a searchable database of facts", "correct": false },
      { "text": "They can generate novel combinations of learned patterns", "correct": true },
      { "text": "Their outputs are deterministic by default", "correct": false },
      { "text": "They process text as numerical vectors (embeddings)", "correct": true }
    ],
    "explanation": "LLMs are pattern-based next-token predictors..."
  },
  {
    "id": "l2-f03",
    "dim": "foundations",
    "dimLabel": "AI Foundations",
    "format": "freetext",
    "q": "A colleague says 'AI understands language just like humans do.' Write a response explaining what AI actually does differently from human language understanding.",
    "rubric": {
      "4": { "label": "Expert", "description": "Distinguishes statistical pattern matching from human comprehension. Mentions lack of grounding, embodiment, or intentionality. Notes practical implications.", "exemplar": "AI processes language as statistical patterns in token sequences..." },
      "3": { "label": "Proficient", "description": "Correctly identifies key differences but misses nuance.", "exemplar": "AI doesn't truly understand — it predicts likely next words..." },
      "2": { "label": "Developing", "description": "Has the right intuition but explanation is vague.", "exemplar": "AI is just pattern matching, it doesn't really think..." },
      "1": { "label": "Novice", "description": "Incorrect or superficial.", "exemplar": "AI is getting close to human understanding..." }
    }
  }
  // ... continue for all 8 dimensions, ~4 questions each = ~32 total
  // The adaptive selector picks ~12 per session
]
```

Write at least 3 questions per dimension (1 ranking + 1 multi-select + 1 free-text) = 24 minimum. More is better for variety.

**Step 2: Validate JSON**

```bash
python3 -c "import json; d=json.load(open('questions/level2.json')); print(f'{len(d)} questions loaded')"
```

Expected: 24+ questions, no parse errors.

**Step 3: Commit**

```bash
git add questions/level2.json
git commit -m "feat: add Level 2 mixed-format question content (ranking, multi-select, free-text)"
```

---

## Task 6: Create Level 2 Page (`level2.html`) — ⚠️ NEEDS STITCH UI

**Files:**
- Create: `level2.html`
- Modify: `shared/styles.css` (new question format styles)
- Modify: `shared/components.js` (self-assessment overlay)

> **WAIT FOR STITCH:** Before implementing this task, integrate the Stitch-generated UI for screens 5-9 from the Stitch spec. Use Stitch output for the HTML structure and CSS of: ranking question, multi-select question, free-text question, self-assessment overlay, and L2 results screen. Adapt Stitch output to work with the shared module architecture.

**Step 1: Add Level 2 CSS to `shared/styles.css`**

```css
/* ── Ranking Question ── */
.ranking-list { display: flex; flex-direction: column; gap: 8px; }
.ranking-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: var(--radius-sm);
  background: var(--bg-card); border: 1.5px solid var(--border);
  cursor: grab; transition: all .25s;
  backdrop-filter: var(--glass-blur);
}
.ranking-item.dragging {
  opacity: 0.8; box-shadow: 0 0 20px rgba(37,99,235,.3);
  transform: scale(1.02); z-index: 10;
}
.ranking-item .rank-num {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,.05);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: .85rem; color: var(--text-dim);
  font-family: 'Space Mono', monospace;
}
.ranking-item .drag-handle {
  color: var(--text-muted); cursor: grab; font-size: 1.1rem;
}

/* ── Multi-Select ── */
.multiselect-list { display: flex; flex-direction: column; gap: 10px; }
.multiselect-item {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; border-radius: var(--radius-sm);
  background: var(--bg-card); border: 1.5px solid var(--border);
  cursor: pointer; transition: all .25s;
  backdrop-filter: var(--glass-blur);
}
.multiselect-item.checked {
  border-color: var(--accent); background: rgba(245,158,11,.06);
}
.multiselect-item .checkbox {
  width: 22px; height: 22px; border-radius: 6px;
  border: 2px solid var(--border); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.multiselect-item.checked .checkbox {
  background: var(--accent); border-color: var(--accent);
  color: #0c1222;
}
.select-count { font-size: .8rem; color: var(--text-dim); margin-top: 4px; }

/* ── Free-Text ── */
.freetext-area {
  width: 100%; min-height: 140px; padding: 16px;
  background: var(--bg-elevated); color: var(--text);
  border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  font-family: 'Outfit', sans-serif; font-size: .95rem;
  resize: vertical; line-height: 1.6;
}
.freetext-area:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(245,158,11,.12);
}
.char-hint { font-size: .75rem; color: var(--text-muted); margin-top: 4px; }

/* ── Self-Assessment Overlay ── */
.sa-overlay {
  position: fixed; inset: 0; z-index: 80;
  background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
  display: flex; align-items: flex-end; justify-content: center;
}
.sa-panel {
  background: var(--bg-elevated); border-radius: var(--radius) var(--radius) 0 0;
  padding: 28px; max-width: 640px; width: 100%;
  max-height: 80vh; overflow-y: auto;
  border-top: 1px solid var(--border);
  animation: slideUp .4s cubic-bezier(.16,1,.3,1);
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.sa-correct { margin-bottom: 16px; }
.sa-ratings { display: flex; gap: 8px; margin: 16px 0; }
.sa-rate-btn {
  flex: 1; padding: 12px 8px; border-radius: var(--radius-xs);
  border: 1.5px solid var(--border); background: var(--bg-card);
  color: var(--text); font-family: 'Outfit'; font-size: .8rem;
  cursor: pointer; text-align: center; transition: all .2s;
}
.sa-rate-btn.selected {
  border-color: var(--accent); background: rgba(245,158,11,.1);
}

/* ── Rubric cards (free-text self-assessment) ── */
.rubric-cards { display: flex; flex-direction: column; gap: 10px; }
.rubric-card {
  padding: 14px; border-radius: var(--radius-xs);
  border: 1.5px solid var(--border); background: var(--bg-card);
  cursor: pointer; transition: all .2s;
}
.rubric-card.selected {
  border-color: var(--accent); background: rgba(245,158,11,.06);
}
.rubric-card .rubric-level {
  font-weight: 700; font-size: .9rem; margin-bottom: 4px;
}
.rubric-card .rubric-desc { font-size: .82rem; color: var(--text-dim); line-height: 1.5; }

/* ── Overlaid radar (L2 results) ── */
.radar-legend { display: flex; gap: 16px; justify-content: center; font-size: .8rem; }
.radar-legend span { display: flex; align-items: center; gap: 6px; }
.radar-legend .dot { width: 10px; height: 10px; border-radius: 50%; }
```

**Step 2: Implement self-assessment overlay in `shared/components.js`**

Add these functions:

```javascript
function showSelfAssessmentMCQ(correctAnswer, explanation, onRate) {
  // For ranking and multi-select
  // Shows correct answer + explanation
  // 4 radio buttons: "Way off (1)" / "Partially right (2)" / "Close (3)" / "Nailed it (4)"
  // Calls onRate(score) when user selects and clicks Continue
}

function showSelfAssessmentRubric(rubric, onRate) {
  // For free-text
  // Shows 4 rubric cards (Expert/Proficient/Developing/Novice)
  // User taps to select their level
  // Calls onRate(score) when Continue clicked
}
```

**Step 3: Create `level2.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Same head as level1.html -->
  <title>AI IQ Test — Level 2: Deep Dive</title>
  <link rel="stylesheet" href="shared/styles.css">
  <script src="shared/engine.js" defer></script>
  <script src="shared/shader.js" defer></script>
  <script src="shared/submit.js" defer></script>
  <script src="shared/components.js" defer></script>
</head>
<body>
  <div id="shader-bg"></div>
  <div class="app">
    <div class="level-indicator" id="level-indicator"></div>

    <!-- Transition/intro screen -->
    <div id="screen-intro" class="screen active">
      <h1>Level 2: Deep Dive</h1>
      <p class="subtitle">Adapted to your Level 1 results</p>
      <div class="card">
        <h3>What to Expect</h3>
        <p>Three new question formats:</p>
        <!-- Format previews -->
        <p>~12 questions · ~8 minutes</p>
      </div>
      <div class="card" id="focus-areas">
        <!-- Dynamically filled with weak/strong dimensions from L1 -->
      </div>
      <button class="btn btn-primary btn-full btn-lg" onclick="startLevel2()">Start Level 2 →</button>
    </div>

    <!-- Question screen (renders all 3 formats dynamically) -->
    <div id="screen-question" class="screen">
      <div class="progress-wrap">
        <span class="progress-label" id="q-counter"></span>
        <div class="progress-track"><div class="progress-fill" id="q-progress"></div></div>
        <span class="progress-label" id="q-timer">0:00</span>
      </div>
      <div class="progress-dots" id="q-dots"></div>
      <div id="q-badge"></div>
      <div class="card" id="q-content">
        <!-- Dynamically populated based on question format -->
      </div>
      <div class="nav-row">
        <button class="btn btn-outline" id="btn-back" onclick="goBack()">← Back</button>
        <button class="btn btn-primary" id="btn-next" onclick="goNext()" disabled>Next</button>
      </div>
    </div>

    <!-- Results screen -->
    <div id="screen-results" class="screen">
      <!-- Combined L1+L2 score, overlaid radar, dimension bars, gate -->
    </div>
  </div>

  <script>
    let questions = [];
    let activeQuestions = [];
    let currentQ = 0;
    let answers = [];
    let quizStartTime = null;

    // Load questions + session
    const session = getAdaptiveSession();
    if (!session.level1) {
      // No L1 data — redirect to L1
      location.href = 'level1.html';
    }

    fetch('questions/level2.json')
      .then(r => r.json())
      .then(data => {
        questions = data;
        populateFocusAreas();
      });

    document.addEventListener('DOMContentLoaded', () => {
      renderLevelIndicator(document.getElementById('level-indicator'), 2);
    });

    function populateFocusAreas() {
      // Read L1 dimension scores, sort, show weak + strong dims
      const l1 = session.level1.scores;
      const sorted = DIMS.map(d => ({ ...d, score: l1[d.key] || 0 }))
        .sort((a, b) => a.score - b.score);
      const weak = sorted.slice(0, 4);
      const strong = sorted.slice(-2);
      // Render pills into #focus-areas
    }

    function selectLevel2Questions() {
      // Hybrid selection: 3 Qs from each of 4 weakest dims + 1 Q from each of 2 strongest
      const l1 = session.level1.scores;
      const sorted = DIMS.map(d => ({ key: d.key, score: l1[d.key] || 0 }))
        .sort((a, b) => a.score - b.score);

      const selected = [];
      // 4 weakest: 3 questions each
      sorted.slice(0, 4).forEach(d => {
        const pool = questions.filter(q => q.dim === d.key);
        selected.push(...shuffle(pool).slice(0, 3));
      });
      // 2 strongest: 1 question each
      sorted.slice(-2).forEach(d => {
        const pool = questions.filter(q => q.dim === d.key);
        selected.push(...shuffle(pool).slice(0, 1));
      });
      return shuffle(selected);
    }

    function startLevel2() {
      quizStartTime = Date.now();
      activeQuestions = selectLevel2Questions();
      answers = new Array(activeQuestions.length).fill(null);
      currentQ = 0;
      startTimer(quizStartTime);
      renderQuestion();
      showScreen('screen-question');
    }

    function renderQuestion() {
      const q = activeQuestions[currentQ];
      const content = document.getElementById('q-content');

      // Update progress bar, dots, counter, badge (same as L1)

      // Render based on format
      switch (q.format) {
        case 'ranking':  renderRankingQ(q, content); break;
        case 'multiselect': renderMultiSelectQ(q, content); break;
        case 'freetext': renderFreeTextQ(q, content); break;
      }
    }

    function renderRankingQ(q, container) {
      // Render draggable list with q.items
      // Shuffle items initially
      // Support drag-to-reorder (HTML5 drag API) + tap-to-swap (mobile)
      // On submit → show self-assessment overlay with correct order
    }

    function renderMultiSelectQ(q, container) {
      // Render checkbox list with q.options
      // Track checked state
      // Show "X selected" counter
      // On submit → show self-assessment overlay with correct set
    }

    function renderFreeTextQ(q, container) {
      // Render textarea with q.q as prompt
      // Show character hint
      // On submit → show rubric self-assessment with q.rubric
    }

    function goNext() {
      // After self-assessment completes (answer recorded with self-assessed score):
      if (currentQ < activeQuestions.length - 1) {
        currentQ++;
        renderQuestion();
      } else {
        buildResults();
        showScreen('screen-results');
      }
    }

    function buildResults() {
      stopTimer();
      // Calculate L2 scores
      // Combine with L1 scores from session
      // Draw overlaid radar (L1 dimmed + L2 bright)
      // Determine combined level
      // Gate: Practitioner+ → save level3Unlocked, show unlock message
      // Submit to Google Sheets (level=2)

      const l2Scores = {};
      DIMS.forEach(d => { l2Scores[d.key] = 0; });
      activeQuestions.forEach((q, i) => {
        if (answers[i]) l2Scores[q.dim] += answers[i].score;
      });

      const total = answers.reduce((s, a) => s + (a?.score || 0), 0);
      const maxScore = activeQuestions.length * 4;
      const pct = Math.round((total / maxScore) * 100);

      // Combined score: average L1 and L2 percentages
      const combinedPct = Math.round((session.level1.percentage + pct) / 2);
      const level = QUICK_LEVELS.find(l => combinedPct >= l.min && combinedPct <= l.max);

      const isPractitioner = combinedPct >= 69;
      if (isPractitioner) {
        saveAdaptiveSession({ level3Unlocked: true });
      }

      saveAdaptiveSession({
        level2: {
          scores: l2Scores,
          totalScore: total,
          percentage: pct,
          level: level.label,
          answers: activeQuestions.map((q, i) => ({
            qId: q.id, format: q.format, score: answers[i]?.score || 0
          }))
        }
      });

      // Render results UI...
      // Draw dual radar: drawDualRadar(session.level1.scores, l2Scores)
    }
  </script>
</body>
</html>
```

**Step 4: Verify Level 2 flow**

- Manually set `adaptive_session` in localStorage with L1 data (for testing without completing L1)
- Open `level2.html`
- Verify: intro screen shows focus areas, questions render in all 3 formats, self-assessment works, results show overlaid radar, gate works

**Step 5: Commit**

```bash
git add level2.html shared/styles.css shared/components.js
git commit -m "feat: create Level 2 (Deep Dive) with ranking, multi-select, and free-text formats"
```

---

## Task 7: Create Level 3 Content (`questions/level3.json`)

**Files:**
- Create: `questions/level3.json`

**Step 1: Write 2-3 boss challenge scenarios**

```json
[
  {
    "id": "boss-clinic",
    "title": "AI-Powered Clinic Support",
    "briefing": {
      "text": "You've been asked to help a small medical clinic...",
      "constraints": [
        "Budget: $500/month for AI tools",
        "Data: Patient records are HIPAA-sensitive",
        "Timeline: 2 weeks to first prototype",
        "Team: You + 1 part-time admin",
        "Patients: Mostly elderly, not tech-savvy"
      ]
    },
    "planning": {
      "prompt": "Outline your approach to this project.",
      "subPrompts": [
        "Which AI tools or services would you use?",
        "How would you handle patient data sensitivity?",
        "What are the biggest risks and how would you mitigate them?",
        "What's your timeline breakdown?"
      ],
      "rubric": {
        "4": { "label": "Expert", "description": "...", "exemplar": "..." },
        "3": { "label": "Proficient", "description": "...", "exemplar": "..." },
        "2": { "label": "Developing", "description": "...", "exemplar": "..." },
        "1": { "label": "Novice", "description": "...", "exemplar": "..." }
      }
    },
    "execution": [
      {
        "format": "ranking",
        "q": "Prioritize these implementation steps for the clinic project:",
        "items": [ /* ... */ ],
        "explanation": "..."
      },
      {
        "format": "multiselect",
        "q": "Which data practices are appropriate for this clinic project? Select all that apply.",
        "options": [ /* ... */ ],
        "explanation": "..."
      },
      {
        "format": "freetext",
        "q": "Mid-project crisis: The AI assistant is confidently giving patients incorrect medication interaction warnings. What do you do?",
        "rubric": { /* ... */ }
      }
    ],
    "reflection": {
      "prompt": "Look back at your entire approach.",
      "subPrompts": [
        "What would you do differently if you started over?",
        "What's the biggest risk you didn't fully address?",
        "What did this challenge reveal about your AI knowledge?"
      ],
      "rubric": { /* ... */ }
    }
  },
  {
    "id": "boss-education",
    "title": "AI Tutoring Platform",
    "briefing": { /* second scenario */ },
    "planning": { /* ... */ },
    "execution": [ /* ... */ ],
    "reflection": { /* ... */ }
  },
  {
    "id": "boss-content",
    "title": "AI Content Moderation",
    "briefing": { /* third scenario */ },
    "planning": { /* ... */ },
    "execution": [ /* ... */ ],
    "reflection": { /* ... */ }
  }
]
```

**Step 2: Validate JSON**

```bash
python3 -c "import json; d=json.load(open('questions/level3.json')); print(f'{len(d)} scenarios loaded')"
```

**Step 3: Commit**

```bash
git add questions/level3.json
git commit -m "feat: add Level 3 Boss Challenge scenarios (clinic, education, content moderation)"
```

---

## Task 8: Create Level 3 Page (`level3.html`)

**Files:**
- Create: `level3.html`
- Modify: `shared/styles.css` (boss challenge styles)

**Step 1: Add Boss Challenge CSS to `shared/styles.css`**

```css
/* ── Boss Challenge ── */
.phase-indicator { display: flex; align-items: center; gap: 8px; justify-content: center; }
.phase-dot { /* similar to level-dot */ }
.phase-dot.active { color: var(--accent); }
.phase-dot.completed { color: #34d399; }

.scenario-card {
  background: var(--bg-card); border-radius: var(--radius);
  padding: 28px; border: 1px solid var(--border);
  backdrop-filter: var(--glass-blur);
}
.constraints-box {
  background: rgba(245,158,11,.06); border: 1px solid rgba(245,158,11,.15);
  border-radius: var(--radius-xs); padding: 16px; margin-top: 16px;
}

.boss-result-pass {
  text-align: center; padding: 40px 20px;
}
.boss-badge {
  display: inline-block; padding: 12px 32px; border-radius: 99px;
  background: linear-gradient(135deg, var(--accent), #f59e0b, var(--cyan));
  font-weight: 800; font-size: 1.1rem; color: #0c1222;
  animation: popIn .6s ease, glowPulse 3s ease-in-out infinite;
}
.journey-timeline { /* visual L1→L2→L3 timeline */ }
```

**Step 2: Create `level3.html`**

Structure follows the 4-phase flow: Briefing → Planning → Execution (3 sub-tasks) → Reflection → Result.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>AI IQ Test — Boss Challenge</title>
  <link rel="stylesheet" href="shared/styles.css">
  <script src="shared/engine.js" defer></script>
  <script src="shared/shader.js" defer></script>
  <script src="shared/submit.js" defer></script>
  <script src="shared/components.js" defer></script>
</head>
<body>
  <div id="shader-bg"></div>
  <div class="app">
    <div class="level-indicator" id="level-indicator"></div>
    <div class="phase-indicator" id="phase-indicator"></div>

    <!-- Briefing -->
    <div id="screen-briefing" class="screen active">
      <h1>Boss Challenge</h1>
      <div class="scenario-card" id="scenario-content"></div>
      <button class="btn btn-primary btn-full btn-lg" onclick="startPlanning()">Begin Planning →</button>
    </div>

    <!-- Planning -->
    <div id="screen-planning" class="screen">
      <!-- Free-text prompt + rubric self-assessment -->
    </div>

    <!-- Execution (3 sub-tasks) -->
    <div id="screen-execution" class="screen">
      <!-- Dynamically renders ranking / multi-select / free-text sub-tasks -->
    </div>

    <!-- Reflection -->
    <div id="screen-reflection" class="screen">
      <!-- Free-text prompt + rubric self-assessment -->
    </div>

    <!-- Result -->
    <div id="screen-result" class="screen">
      <!-- Pass/fail badge, journey summary, download/share -->
    </div>
  </div>

  <script>
    let scenarios = [];
    let activeScenario = null;
    let phaseScores = { planning: null, execution: [], reflection: null };

    const session = getAdaptiveSession();
    if (!session.level3Unlocked) {
      location.href = 'index.html';
    }

    fetch('questions/level3.json')
      .then(r => r.json())
      .then(data => {
        scenarios = data;
        activeScenario = shuffle(data)[0]; // Random scenario
        renderBriefing();
      });

    document.addEventListener('DOMContentLoaded', () => {
      renderLevelIndicator(document.getElementById('level-indicator'), 3);
      renderPhaseIndicator('briefing');
    });

    function renderPhaseIndicator(current) {
      const phases = ['briefing', 'planning', 'execution', 'reflection'];
      // Render phase dots
    }

    function renderBriefing() {
      const s = activeScenario;
      document.getElementById('scenario-content').innerHTML = `
        <h2>${s.title}</h2>
        <p>${s.briefing.text}</p>
        <div class="constraints-box">
          <h3>Key Constraints</h3>
          <ul>${s.briefing.constraints.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      `;
    }

    function startPlanning() {
      renderPhaseIndicator('planning');
      showScreen('screen-planning');
      // Render free-text prompt from activeScenario.planning
      // On submit → self-assessment → record phaseScores.planning
    }

    function startExecution() {
      renderPhaseIndicator('execution');
      showScreen('screen-execution');
      // Render 3 sub-tasks sequentially from activeScenario.execution
      // Each sub-task: render → answer → self-assess → next sub-task
      // Record phaseScores.execution array
    }

    function startReflection() {
      renderPhaseIndicator('reflection');
      showScreen('screen-reflection');
      // Render free-text prompt from activeScenario.reflection
      // On submit → self-assessment → record phaseScores.reflection
    }

    function showResult() {
      // Calculate average score
      const allScores = [
        phaseScores.planning,
        ...phaseScores.execution,
        phaseScores.reflection
      ];
      const avg = allScores.reduce((s, v) => s + v, 0) / allScores.length;
      const passed = avg >= 2.5;

      // Render pass/fail
      // Journey summary (L1 → L2 → L3)
      // Submit to Google Sheets (level=3)

      saveAdaptiveSession({
        level3: {
          scenario: activeScenario.id,
          phaseScores,
          result: passed ? 'pass' : 'fail'
        }
      });

      submitToSheets({
        participant_id: session.participantId,
        participant_name: session.participantName,
        timestamp: new Date().toISOString(),
        test_mode: 'adaptive',
        level: 3,
        boss_scenario: activeScenario.id,
        boss_planning_rating: phaseScores.planning,
        boss_execution_rating: Math.round(phaseScores.execution.reduce((a,b)=>a+b,0) / phaseScores.execution.length),
        boss_reflection_rating: phaseScores.reflection,
        boss_result: passed ? 'pass' : 'fail'
      });
    }
  </script>
</body>
</html>
```

**Step 3: Verify Level 3 flow**

- Set `adaptive_session.level3Unlocked = true` in localStorage
- Open `level3.html`
- Walk through: briefing → planning → execution (3 sub-tasks) → reflection → result
- Verify pass/fail logic works

**Step 4: Commit**

```bash
git add level3.html shared/styles.css
git commit -m "feat: create Level 3 (Boss Challenge) with multi-step case study flow"
```

---

## Task 9: Update Google Apps Script for Adaptive Mode

**Files:**
- Modify: `google-apps-script.js`

**Step 1: Update the script to handle adaptive-mode payloads**

The Google Apps Script needs to accept the new fields:
- `test_mode: "adaptive"` + `level: 1|2|3`
- Level 2 format-specific fields (`_format`)
- Level 3 boss fields (`boss_scenario`, `boss_*_rating`, `boss_result`)

Update the `doPost` function to dynamically add columns for new fields. The existing script likely uses `e.parameter` or parses JSON — extend it to handle the new payload shape.

**Step 2: Test submission**

From browser console on any level page:
```javascript
submitToSheets({ test_mode: 'adaptive', level: 1, participant_id: 'TEST123', total_score: 50 });
```

Verify row appears in Google Sheet.

**Step 3: Commit**

```bash
git add google-apps-script.js
git commit -m "feat: update Google Apps Script to handle adaptive mode payloads"
```

---

## Task 10: End-to-End Testing

**Step 1: Full adaptive flow test**

1. Open `index.html` → click "Adaptive Assessment" → verify navigation to `level1.html`
2. Complete Level 1 with high enough score → verify "Continue to Level 2" appears
3. Click continue → verify `level2.html` loads with correct focus areas
4. Complete Level 2 with Practitioner+ → verify "Boss Challenge Unlocked" message
5. Return to `index.html` → verify Boss Challenge card is unlocked
6. Complete Level 3 → verify pass/fail result

**Step 2: Gate failure test**

1. Complete Level 1 with intentionally low score → verify blocked from Level 2
2. Complete Level 2 with low combined score → verify blocked from Level 3

**Step 3: Direct URL protection**

1. Open `level2.html` without L1 data → verify redirect to `level1.html`
2. Open `level3.html` without unlock → verify redirect to `index.html`

**Step 4: localStorage persistence**

1. Complete L1 → close browser → reopen `level2.html` → verify session data persists
2. Verify Google Sheets receives 3 separate rows for a full adaptive run

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: end-to-end testing fixes for adaptive flow"
```

---

## Dependency Graph

```
Task 1 (CSS extraction)
  └→ Task 2 (JS extraction)
       └→ Task 3 (Landing page update)
       └→ Task 4 (Level 1)
       └→ Task 5 (L2 content) ── independent, can parallel with Task 4
       └→ Task 7 (L3 content) ── independent, can parallel with Task 4
            └→ Task 8 (Level 3 page) ── needs Task 7
       └→ Task 6 (Level 2 page) ── ⚠️ BLOCKED on Stitch UI, needs Task 5
Task 9 (Google Apps Script) ── independent, can parallel with any task
Task 10 (E2E testing) ── needs all previous tasks
```

**Parallelizable groups:**
- After Task 2: Tasks 3, 4, 5, 7, 9 can all run in parallel
- After Task 5 + Stitch UI: Task 6
- After Task 7: Task 8
- After all: Task 10
