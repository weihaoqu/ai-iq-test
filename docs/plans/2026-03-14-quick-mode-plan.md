# Quick Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Quick Assessment" (8 questions, ~2 min) mode alongside the existing full test, with mode selection on the landing page.

**Architecture:** All changes in `index.html`. Add a `testMode` variable ('quick'|'full'), modify landing HTML to show two cards, add question selection logic for quick mode, and conditionally render results based on mode. Also update `google-apps-script.js` to accept `test_mode` field.

**Tech Stack:** Vanilla HTML/CSS/JS (single-file app), Google Apps Script

---

### Task 1: Add Mode Selection Variable & Quick Mode Constants

**Files:**
- Modify: `index.html` (JS section, around lines 695-720)

**Step 1: Add testMode variable and quick-mode constants**

After the existing `LEVELS` array (line 713) and before `DIM_MAX` (line 716), add:

```javascript
// ─── Test Mode ──────────────────────────────────────────────────────────
let testMode='full'; // 'quick' or 'full'

const QUICK_LEVELS=[
  {min:25,max:66,label:'AI Novice',lvl:1,cls:'iq-level-1'},
  {min:67,max:77,label:'AI Apprentice',lvl:2,cls:'iq-level-2'},
  {min:78,max:88,label:'AI Practitioner',lvl:3,cls:'iq-level-3'},
  {min:89,max:100,label:'AI Master',lvl:4,cls:'iq-level-4'}
];

function selectQuickQuestions(){
  // Pick 1 random question per dimension, shuffle the order
  const picked=[];
  DIMS.forEach(d=>{
    const pool=QUESTIONS.filter(q=>q.dim===d.key);
    picked.push(pool[Math.floor(Math.random()*pool.length)]);
  });
  // Shuffle the picked questions
  for(let i=picked.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [picked[i],picked[j]]=[picked[j],picked[i]];
  }
  return picked;
}
```

**Step 2: Add `activeQuestions` variable**

Near the existing global variables (around line 720, near `let currentQ=0, answers=[], ...`), add:

```javascript
let activeQuestions=QUESTIONS; // switches between QUESTIONS (full) and quick subset
```

**Step 3: Commit**

```
git commit -m "feat: add testMode variable, quick levels, and question selector"
```

---

### Task 2: Landing Page HTML — Mode Selection Cards

**Files:**
- Modify: `index.html` (HTML section, around lines 474-522; CSS section)

**Step 1: Add CSS for mode cards**

Before the closing `</style>` tag (around line 467), add:

```css
/* ── Mode Cards ── */
.mode-cards{display:flex;gap:14px;width:100%}
.mode-card{
  flex:1;padding:20px 16px;border-radius:var(--radius);
  background:var(--bg-card);backdrop-filter:var(--glass-blur);
  border:1.5px solid var(--border);cursor:pointer;
  transition:all .25s cubic-bezier(.16,1,.3,1);
  text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;
}
.mode-card:hover{transform:translateY(-2px)}
.mode-card--quick:hover{border-color:rgba(245,158,11,.4);box-shadow:0 4px 25px rgba(245,158,11,.15)}
.mode-card--full:hover{border-color:rgba(37,99,235,.4);box-shadow:0 4px 25px rgba(37,99,235,.15)}
.mode-card__icon{width:48px;height:48px}
.mode-card__title{font-size:1rem;font-weight:700}
.mode-card__details{font-size:.75rem;color:var(--text-dim);line-height:1.5}
.mode-card__btn{
  margin-top:auto;padding:10px 20px;border-radius:var(--radius-sm);
  font-family:'Outfit',sans-serif;font-size:.85rem;font-weight:600;
  border:none;cursor:pointer;width:100%;transition:all .2s;
}
.mode-card--quick .mode-card__btn{background:linear-gradient(135deg,#d97706,var(--accent));color:#0c1222}
.mode-card--full .mode-card__btn{background:linear-gradient(135deg,var(--primary-dark),var(--primary));color:#fff}
@media(max-width:420px){.mode-cards{flex-direction:column}}
```

**Step 2: Replace the "Start Test" button in landing HTML**

Replace the existing start button (around line 497):
```html
<button class="btn btn-primary btn-full btn-lg" id="btn-start" onclick="startTest()">
  <span id="btn-start-text">Start Test</span>
</button>
```

With the mode selection cards:
```html
<div class="mode-cards">
  <div class="mode-card mode-card--quick" onclick="startTest('quick')">
    <svg class="mode-card__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="#f59e0b" stroke-width="2.5" opacity=".2"/>
      <circle cx="24" cy="24" r="20" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="94.25 31.42" stroke-linecap="round"/>
      <path d="M24 14v10l7 4" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="24" cy="24" r="3" fill="#f59e0b"/>
    </svg>
    <div class="mode-card__title" style="color:var(--accent)">Quick</div>
    <div class="mode-card__details">
      8 questions<br>~2 minutes<br>Score + radar chart
    </div>
    <button class="mode-card__btn">Start Quick</button>
  </div>
  <div class="mode-card mode-card--full" onclick="startTest('full')">
    <svg class="mode-card__icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="#2563eb" stroke-width="1" opacity=".15"/>
      <circle cx="24" cy="24" r="13" stroke="#2563eb" stroke-width="1" opacity=".15"/>
      <circle cx="24" cy="24" r="6" stroke="#2563eb" stroke-width="1" opacity=".15"/>
      <polygon points="24,4 28.5,17 42,17 31,26 35,40 24,31 13,40 17,26 6,17 19.5,17" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round" opacity=".8"/>
      <circle cx="24" cy="4" r="2.5" fill="#60a5fa"/>
      <circle cx="42" cy="17" r="2" fill="#38bdf8"/>
      <circle cx="35" cy="40" r="2" fill="#2563eb"/>
      <circle cx="13" cy="40" r="2" fill="#38bdf8"/>
      <circle cx="6" cy="17" r="2" fill="#60a5fa"/>
      <circle cx="24" cy="24" r="3" fill="#2563eb"/>
    </svg>
    <div class="mode-card__title" style="color:var(--primary-light)">Full</div>
    <div class="mode-card__details">
      45 questions<br>~10 minutes<br>Full analysis + report<br>& certificate
    </div>
    <button class="mode-card__btn">Start Full</button>
  </div>
</div>
```

**Step 3: Commit**

```
git commit -m "feat: add mode selection cards to landing page"
```

---

### Task 3: Modify startTest() and beginQuiz() for Mode Selection

**Files:**
- Modify: `index.html` (JS section, around lines 748-768)

**Step 1: Update startTest() to accept mode parameter**

Replace the existing `startTest()` function (around line 748):

```javascript
function startTest(mode){
  testMode=mode||'full';
  showScreen('screen-welcome');
  // Preload images based on mode
  const qs=testMode==='quick'?QUESTIONS:QUESTIONS; // preload from full pool either way
  for(let i=0;i<Math.min(3,qs.length);i++){const img=new Image();img.src=qs[i].img;}
}
```

**Step 2: Update beginQuiz() to use activeQuestions**

In `beginQuiz()` (around line 754), after the existing setup code (getting name, experience, etc.) and before choice shuffling, add the question selection:

After `quizStartTime=Date.now();` add:
```javascript
activeQuestions=testMode==='quick'?selectQuickQuestions():QUESTIONS;
```

Then update the choice shuffling to use `activeQuestions` instead of `QUESTIONS`:
```javascript
activeQuestions.forEach(q=>{...}); // was QUESTIONS.forEach
```

Update `answers` array init:
```javascript
answers=new Array(activeQuestions.length).fill(null); // was QUESTIONS.length
```

And the progress dots generation to use `activeQuestions.length` instead of `QUESTIONS.length`.

**Step 3: Commit**

```
git commit -m "feat: wire up mode selection to startTest and beginQuiz"
```

---

### Task 4: Update Quiz Screen to Use activeQuestions

**Files:**
- Modify: `index.html` (JS section — renderQuestion, goNext, goBack, and related functions)

**Step 1: Replace all QUESTIONS references in quiz logic with activeQuestions**

In `renderQuestion()` (around line 769):
- `QUESTIONS[currentQ]` → `activeQuestions[currentQ]`
- `QUESTIONS.length` → `activeQuestions.length`
- Preload next image: `QUESTIONS[currentQ+1]` → `activeQuestions[currentQ+1]`

In `goNext()`:
- `QUESTIONS.length` → `activeQuestions.length`
- When reaching last question, call buildResults

In `goBack()`:
- No QUESTIONS references, but verify

In progress dot generation:
- `QUESTIONS.length` → `activeQuestions.length`

In the progress bar/counter updates:
- `QUESTIONS.length` → `activeQuestions.length`

**IMPORTANT:** Do NOT change QUESTIONS references in:
- `buildReportHTML()` — always uses full QUESTIONS for review
- `buildCertificateHTML()` — always uses full set
- `DIM_MAX` computation — always based on full set
- `submitData()` — needs special handling (Task 6)

**Step 2: Commit**

```
git commit -m "feat: quiz screen uses activeQuestions instead of QUESTIONS"
```

---

### Task 5: Update Results Page for Quick Mode

**Files:**
- Modify: `index.html` (JS section — buildResults function, around line 869)

**Step 1: Modify buildResults() for quick mode scoring**

At the top of `buildResults()`, change the score/level computation:

```javascript
const total=answers.reduce((s,a)=>s+a.score,0);
const maxScore=activeQuestions.length*4;
const pct=Math.round((total/maxScore)*100);

let level;
if(testMode==='quick'){
  level=QUICK_LEVELS.find(l=>pct>=l.min&&pct<=l.max)||QUICK_LEVELS[QUICK_LEVELS.length-1];
} else {
  level=LEVELS.find(l=>total>=l.min&&total<=l.max)||LEVELS[LEVELS.length-1];
}
```

**Step 2: Conditionally show score**

For the score display:
- Quick mode: show `pct + '%'` instead of the raw total
- Full mode: keep showing total as-is

The score label:
- Quick: "AI IQ Score"
- Full: "AI IQ Score (Xth %ile)" (existing behavior)

**Step 3: Conditionally show/hide sections**

In quick mode, hide:
- Analysis card (`res-analysis`) — `display:none`
- Report download button
- Certificate download button

In quick mode, show:
- Upsell card (new HTML element, see Step 4)

**Step 4: Add upsell card HTML**

In the results screen HTML (around line 600-640), add before the retake button area:

```html
<div class="card" id="upsell-card" style="display:none;text-align:center;border-color:rgba(37,99,235,.2)">
  <h3 style="color:var(--primary-light);margin-bottom:8px">Want deeper insights?</h3>
  <p class="subtitle">Take the full 45-question assessment for detailed analysis, downloadable report, and certificate.</p>
  <button class="btn btn-primary btn-full" style="margin-top:14px" onclick="startTest('full')">Take Full Assessment</button>
</div>
```

In `buildResults()`, toggle visibility:
```javascript
document.getElementById('upsell-card').style.display=testMode==='quick'?'block':'none';
```

**Step 5: Update gauge for quick mode**

Quick mode: hide the gauge (score ranges don't apply) or show percentage-based gauge.
Simplest: hide gauge in quick mode.

**Step 6: Update DIM_MAX for quick mode radar**

For the radar chart in quick mode, each dimension max is 4 (1 question × 4 points):
```javascript
const dimMax=testMode==='quick'?
  Object.fromEntries(DIMS.map(d=>[d.key,4])):
  DIM_MAX;
```

Compute dimScores using `activeQuestions` instead of `QUESTIONS`:
```javascript
activeQuestions.forEach((q,i)=>{dimScores[q.dim]+=(answers[i]?.score||0);});
```

**Step 7: Commit**

```
git commit -m "feat: results page adapts to quick/full mode"
```

---

### Task 6: Update Data Submission for Quick Mode

**Files:**
- Modify: `index.html` (JS section — submitData function, around line 1253)
- Modify: `google-apps-script.js`

**Step 1: Add test_mode to submission payload**

In `submitData()`, add to the payload object:
```javascript
test_mode: testMode,
percentage: Math.round((total/(activeQuestions.length*4))*100)
```

For per-question data, iterate `activeQuestions` instead of `QUESTIONS`:
```javascript
activeQuestions.forEach((q,i)=>{
  payload[q.id+'_score']=answers[i]?.score||0;
  payload[q.id+'_choice']=answers[i]?.origLetter||'';
});
```
(In quick mode, only the 8 selected question columns will have data; the rest stay empty/0)

**Step 2: Update Google Apps Script**

In `google-apps-script.js`, add `test_mode` and `percentage` to the headers array (after `duration_seconds`):
```javascript
'participant_id', 'participant_name', 'timestamp', 'date', 'ai_experience',
'total_score', 'level', 'duration_seconds', 'test_mode', 'percentage',
```

Add to the row builder:
```javascript
data.test_mode || 'full',
data.percentage || 0
```

**Step 3: Commit**

```
git commit -m "feat: submit test_mode and percentage to Google Sheets"
```

---

### Task 7: Update Share URL and Share Image for Quick Mode

**Files:**
- Modify: `index.html` (JS section — getShareUrl, shareAsImage)

**Step 1: Update getShareUrl()**

Add mode to the URL:
```javascript
function getShareUrl(){
  const total=answers.reduce((s,a)=>s+a.score,0);
  const maxScore=activeQuestions.length*4;
  const pct=Math.round((total/maxScore)*100);
  const level=testMode==='quick'?
    (QUICK_LEVELS.find(l=>pct>=l.min&&pct<=l.max)||QUICK_LEVELS[QUICK_LEVELS.length-1]):
    (LEVELS.find(l=>total>=l.min&&total<=l.max)||LEVELS[LEVELS.length-1]);
  const url=new URL(window.location.href.split('?')[0]);
  url.searchParams.set('mode',testMode);
  if(testMode==='quick'){
    url.searchParams.set('score',pct+'%');
  } else {
    url.searchParams.set('score',total+'/180');
  }
  url.searchParams.set('level',level.label);
  url.searchParams.set('name',participantName);
  return{total,pct,level,url:url.toString()};
}
```

**Step 2: Update shareAsImage() for quick mode**

In the share image canvas:
- Quick mode: show percentage instead of raw score
- Update the score gradient text to show `pct + '%'`
- Keep the mini radar chart (works for both modes)

**Step 3: Update the landing page share URL parser**

The existing code that parses `?score=...&level=...&name=...` on landing needs to also handle `?mode=quick&score=78%...`.

**Step 4: Commit**

```
git commit -m "feat: share URL and image support quick mode"
```

---

### Task 8: Update localStorage for Per-Mode Results

**Files:**
- Modify: `index.html` (JS section — localStorage save/load, around lines 1272 and 1645-1664)

**Step 1: Update localStorage save key**

Change the save key to include mode:
```javascript
localStorage.setItem(`ai_iq_${testMode}_${participantId}`, JSON.stringify(payload));
```

**Step 2: Update landing page previous result display**

Show the most recent result for each mode:
```javascript
// Find latest quick result
const quickKeys=Object.keys(localStorage).filter(k=>k.startsWith('ai_iq_quick_'));
// Find latest full result
const fullKeys=Object.keys(localStorage).filter(k=>k.startsWith('ai_iq_full_'));
```

Display both if they exist:
- "Your last quick score: 78% (Practitioner)"
- "Your last full score: 156/180 (Practitioner)"

**Step 3: Handle backward compatibility**

Old keys use `ai_iq_` prefix without mode. Treat these as 'full' mode results:
```javascript
const legacyKeys=Object.keys(localStorage).filter(k=>k.startsWith('ai_iq_')&&!k.startsWith('ai_iq_quick_')&&!k.startsWith('ai_iq_full_'));
// Treat legacy keys as full mode
```

**Step 4: Commit**

```
git commit -m "feat: per-mode localStorage with backward compatibility"
```

---

### Task 9: Update Google Apps Script & Deploy Instructions

**Files:**
- Modify: `google-apps-script.js`

**Step 1: Add test_mode and percentage columns**

Update the headers array in both `doPost()` and `doGet()` (test handler):

Insert after `'duration_seconds'`:
```javascript
'test_mode', 'percentage'
```

Update the row builder in `doPost()`:
```javascript
data.test_mode || 'full',
data.percentage || 0
```

**Step 2: Commit**

```
git commit -m "feat: add test_mode and percentage to Google Apps Script"
```

**Step 3: Manual deploy**

Q must re-deploy `google-apps-script.js` in Google Apps Script editor:
1. Replace Code.gs content
2. Deploy → Manage deployments → Edit → New version → Deploy
3. Delete "Responses" sheet so it recreates with new headers

---

### Task 10: Final Testing & Cleanup

**Step 1: Full visual test**

- Landing page: verify two cards display correctly, mobile responsive
- Quick mode: start → 8 questions → results (percentage, radar, no analysis/report/cert, upsell card)
- Full mode: start → 45 questions → results (unchanged from before)
- Share URL: test both modes
- Previous results: test both modes display on landing

**Step 2: Edge cases**

- Switching modes mid-way (going back to landing)
- Share URL with mode=quick arriving at landing
- localStorage with legacy (no mode) data

**Step 3: Commit & cleanup**

```
git commit -m "chore: final quick mode cleanup"
```
