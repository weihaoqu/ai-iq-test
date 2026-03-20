# Question Quality & Coverage Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul AI IQ test questions — retire 6 weak questions, write 9 new ones covering modern AI topics, standardize 6 questions per dimension (48 total), rename "Vibe Coding" to "AI-Assisted Building", rebalance scoring, and validate via simulated test-takers.

**Architecture:** Single-file app (index.html) with inlined questions + reference questions.json. All changes are in-place edits. Google Apps Script needs header updates for new question IDs.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Apps Script, questions.json

---

### Task 1: Write 9 New Questions

**Files:**
- Modify: `questions.json`

**Step 1: Draft new questions covering missing topics**

Write 9 new questions with 4 graduated choices (score 1-4). Each question needs: id, dim, dimLabel, q, img, choices.

New question assignments:

| ID | Dimension | Topic |
|---|---|---|
| f06 | foundations | AI agents — what they are, how they differ from chatbots |
| f07 | foundations | Multimodal AI — image/audio/video input capabilities |
| p06 | problemFraming | Agentic workflows — when to use multi-step AI pipelines vs single prompt |
| t06 | toolSelection | Open vs closed models — when to use local/open-source vs API |
| t07 | toolSelection | MCP / tool integration — AI connecting to external services |
| s06 | ethicsSafety | AI regulation & policy — EU AI Act, deepfake laws, institutional policies |
| h06 | humanCollaboration | Learning with AI — metacognition, skill-building vs shortcutting |
| v06 | vibeCoding (AI-Assisted Building) | AI in education — using AI to learn effectively vs dependency |
| v07 | vibeCoding (AI-Assisted Building) | Debugging AI-generated code — systematic approach |

Note: v06 replaces a retired question. v07 is needed because we retire t03, t04 but only add t06, t07 — net zero for tool selection. The extra v06/v07 handles the fact that we retire f01, f03, f05 (3 from foundations) but only add f06, f07 (2 new) + keep x01 (already foundations). So foundations goes 6→3+2+x01=6. Wait, let me recount:

**Current question counts and planned changes:**

| Dim | Current IDs | Count | Retire | Keep | Add | Final |
|---|---|---|---|---|---|---|
| foundations | f01-f05, x01 | 6 | f01, f03, f05 | f02, f04, x01 | f06, f07, f08 | 6 |
| problemFraming | p01-p05 | 5 | p03 | p01, p02, p04, p05 | p06 | 6 |
| toolSelection | t01-t05, x04 | 6 | t03, t04 | t01, t02, t05, x04 | t06, t07 | 6 |
| promptEngineering | e01-e05, x03 | 6 | — | all | — | 6 |
| criticalEvaluation | c01-c05, x02 | 6 | — | all | — | 6 |
| ethicsSafety | s01-s05 | 5 | — | all | s06 | 6 |
| humanCollaboration | h01-h05 | 5 | — | all | h06 | 6 |
| vibeCoding | v01-v05, x05 | 6 | — | all | — | 6 |

Total: 48 questions (retire 6, add 5 = net -1... need to add one more)

Correction — we need **f08** (one more foundations question) to replace the 3rd retired one. Updated new questions:

| ID | Dimension | Topic |
|---|---|---|
| f06 | foundations | AI agents — what they are, autonomous tool use |
| f07 | foundations | Multimodal AI — image/audio/video input |
| f08 | foundations | How LLMs actually learn (training vs inference) |
| p06 | problemFraming | Agentic workflows — when multi-step pipelines vs single prompt |
| t06 | toolSelection | Open vs closed models — local/open-source vs API |
| t07 | toolSelection | MCP / tool integration — AI connecting to external services |
| s06 | ethicsSafety | AI regulation & policy — EU AI Act, deepfakes, institutional policy |
| h06 | humanCollaboration | Learning with AI — building skills vs outsourcing thinking |

That's 8 new questions. Total: retire 6, add 8 = 48. Correct.

**Step 2: Write each question following the existing format**

Each question must have:
- Realistic scenario grounding (not abstract)
- Score 1: naive/dangerous misunderstanding
- Score 2: partially correct but incomplete
- Score 3: good understanding, missing nuance
- Score 4: comprehensive, accounts for edge cases
- The score-4 answer should NOT be identifiable by being the longest

Append all 8 new questions to `questions.json`.

**Step 3: Verify question count**

Run: Count questions per dimension in questions.json. Should be 6 per dimension, 48 total.

**Step 4: Commit**

```bash
git add questions.json
git commit -m "feat: add 8 new questions covering agents, multimodal, MCP, regulation, learning-with-AI"
```

---

### Task 2: Simulate Test-Takers to Validate Questions

**Files:**
- Read: `questions.json`

**Step 1: Launch 3 subagents in parallel, each simulating a different student profile**

Each subagent receives ALL 48 questions and must:
1. Answer each question as their persona would
2. Rate each question's quality (1-5) on:
   - Is the score-4 answer guessable without real understanding?
   - Are distractors plausible?
   - Is the score-4 answer identifiable just by being longest/most technical?
3. Flag any problematic questions

**Profiles:**
- **Agent A:** Non-technical college student (business major, uses ChatGPT for essays, no coding)
- **Agent B:** CS freshman (basic Python, used GitHub Copilot, took intro ML course)
- **Agent C:** Experienced AI user / CS senior (built apps with AI, familiar with agents, RAG, etc.)

**Step 2: Collect and analyze results**

- If a non-technical student scores 4 on a question by guessing the longest answer → flag
- If an experienced user scores < 4 on a question due to ambiguity → flag
- If all 3 profiles pick the same wrong answer → distractor quality issue

**Step 3: Revise flagged questions**

Edit questions.json to fix issues found.

**Step 4: Commit**

```bash
git add questions.json
git commit -m "fix: revise questions based on simulated test-taker feedback"
```

---

### Task 3: Remove Retired Questions from questions.json

**Files:**
- Modify: `questions.json`

**Step 1: Remove retired question objects**

Remove questions with IDs: f01, f03, f05, t03, t04, p03

**Step 2: Verify final count**

48 questions total, 6 per dimension.

**Step 3: Commit**

```bash
git add questions.json
git commit -m "refactor: remove 6 retired questions (f01, f03, f05, t03, t04, p03)"
```

---

### Task 4: Update index.html — Swap Questions

**Files:**
- Modify: `index.html` (lines ~716-761, the QUESTIONS array)

**Step 1: Replace the entire QUESTIONS array**

Copy the final 48 questions from questions.json into the QUESTIONS const in index.html (lines 716-761), maintaining the minified single-line-per-question format.

**Step 2: Update DIMS array — rename vibeCoding**

Change line ~773 from:
```js
{key:'vibeCoding', label:'Vibe Coding & Creation', color:'var(--dim-vibe)'}
```
to:
```js
{key:'vibeCoding', label:'AI-Assisted Building', color:'var(--dim-vibe)'}
```

Keep the key as `vibeCoding` for backwards compatibility with stored data.

**Step 3: Update dimension label in CSS variable comment and any UI references**

Search for "Vibe Coding" in index.html and update all display labels to "AI-Assisted Building".

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: update questions in index.html — 48 questions, rename Vibe Coding to AI-Assisted Building"
```

---

### Task 5: Update Scoring Thresholds

**Files:**
- Modify: `index.html`

**Step 1: Update LEVELS for 48 questions (range 48-192)**

Replace LEVELS (line ~776):
```js
const LEVELS = [
  {min:48, max:110, label:'AI Novice',       lvl:1, cls:'iq-level-1'},
  {min:111,max:140, label:'AI Apprentice',   lvl:2, cls:'iq-level-2'},
  {min:141,max:170, label:'AI Practitioner', lvl:3, cls:'iq-level-3'},
  {min:171,max:192, label:'AI Master',       lvl:4, cls:'iq-level-4'}
];
```

**Step 2: Update quick mode to select 2 questions per dimension (16 total)**

Replace selectQuickQuestions function (line ~793):
```js
function selectQuickQuestions(){
  const picked=[];
  DIMS.forEach(d=>{
    const pool=QUESTIONS.filter(q=>q.dim===d.key);
    // Shuffle and pick 2
    const shuffled=[...pool].sort(()=>Math.random()-0.5);
    picked.push(shuffled[0], shuffled[1]);
  });
  // Shuffle all picked questions
  for(let i=picked.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [picked[i],picked[j]]=[picked[j],picked[i]];
  }
  return picked;
}
```

**Step 3: Update QUICK_LEVELS for 16 questions (range 16-64)**

Replace QUICK_LEVELS (line ~786):
```js
const QUICK_LEVELS=[
  {min:25,max:56,label:'AI Novice',lvl:1,cls:'iq-level-1'},
  {min:57,max:68,label:'AI Apprentice',lvl:2,cls:'iq-level-2'},
  {min:69,max:81,label:'AI Practitioner',lvl:3,cls:'iq-level-3'},
  {min:82,max:100,label:'AI Master',lvl:4,cls:'iq-level-4'}
];
```

**Step 4: Update all hardcoded references to "45" and "180"**

Search index.html for:
- `45` in question count contexts → `48`
- `180` in max score contexts → `192`
- Meta description, OG tags, structured data, landing page text
- Report HTML ("out of 180" → "out of 192")
- Certificate HTML

**Step 5: Update quick mode landing card text**

Change "8 questions" → "16 questions" and "~2 minutes" → "~4 minutes" in the landing page mode cards.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: rebalance scoring for 48 questions, upgrade quick mode to 16 questions"
```

---

### Task 6: Update Google Apps Script

**Files:**
- Modify: `google-apps-script.js`

**Step 1: Update question ID arrays**

Replace the qids arrays in both doPost and doGet with the new 48 question IDs:
```js
var qids = [
  'f02','f04','f06','f07','f08','x01',
  'p01','p02','p04','p05','p06',
  // ... (fill in rest — must match removed/added question IDs, but keep backwards compat note)
  't01','t02','t05','t06','t07','x04',
  'e01','e02','e03','e04','e05','x03',
  'c01','c02','c03','c04','c05','x02',
  's01','s02','s03','s04','s05','s06',
  'h01','h02','h03','h04','h05','h06',
  'v01','v02','v03','v04','v05','x05'
];
```

Note: Each dimension should have exactly 6 IDs. Order should group by dimension for readability. The 'x' prefix questions keep their IDs but are now grouped with their dimension.

**Step 2: Update dimension column header for renamed dimension**

Change `dim_vibeCoding` to `dim_aiAssistedBuilding` — actually NO, keep as `dim_vibeCoding` for data continuity. The rename is display-only.

**Step 3: Commit**

```bash
git add google-apps-script.js
git commit -m "feat: update Google Apps Script for 48-question schema"
```

---

### Task 7: Generate SVG Images for New Questions

**Files:**
- Create: `images/scenarios/f06.svg`, `f07.svg`, `f08.svg`, `p06.svg`, `t06.svg`, `t07.svg`, `s06.svg`, `h06.svg`

**Step 1: Check existing SVG style**

Read 2-3 existing SVGs to understand the visual style (dimensions, color palette, illustration approach).

**Step 2: Generate 8 new SVGs**

Create scenario illustrations matching existing style for each new question. Each SVG should visually represent the scenario described in the question.

**Step 3: Commit**

```bash
git add images/scenarios/
git commit -m "feat: add scenario images for 8 new questions"
```

---

### Task 8: Update questions.json as Reference

**Files:**
- Modify: `questions.json`

**Step 1: Ensure questions.json matches index.html QUESTIONS array exactly**

The final questions.json should contain the same 48 questions in the same order as the QUESTIONS const in index.html. This file is a reference/export only.

**Step 2: Commit**

```bash
git add questions.json
git commit -m "docs: sync questions.json with final 48-question set"
```

---

### Task 9: End-to-End Testing

**Files:**
- Read: `index.html`

**Step 1: Launch local server and test full mode**

Start a local HTTP server and test:
- Landing page shows "48 questions" and "~10 minutes"
- Full mode presents 48 questions
- All 8 dimensions appear in results with correct labels
- "AI-Assisted Building" label appears (not "Vibe Coding")
- Score out of 192
- Report/certificate download works
- Radar chart renders 8 dimensions correctly

**Step 2: Test quick mode**

- Quick mode presents 16 questions (2 per dimension)
- Score percentage calculated correctly
- Results show all 8 dimensions

**Step 3: Test Google Apps Script submission**

- Verify POST payload includes all 48 question IDs
- Verify dimension scores sum correctly

**Step 4: Fix any issues found**

**Step 5: Final commit**

```bash
git add -A
git commit -m "test: verify 48-question test works in both modes"
```

---

### Task Order & Dependencies

```
Task 1 (Write new questions)
  → Task 2 (Simulate test-takers) — depends on Task 1
    → Task 3 (Remove retired questions) — depends on Task 2
      → Task 4 (Update index.html questions) — depends on Task 3
      → Task 5 (Update scoring) — depends on Task 3
      → Task 6 (Update GAS) — depends on Task 3
      → Task 7 (Generate SVGs) — depends on Task 1
    → Task 8 (Sync questions.json) — depends on Tasks 4-6
      → Task 9 (E2E testing) — depends on all above
```

Tasks 4, 5, 6, 7 can run in parallel after Task 3.
