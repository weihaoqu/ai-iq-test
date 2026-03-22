# Simulated Tester Report — 2026-03-22

**Test:** AI IQ Test, Level 1 (Quick Scan, 16 MCQ, adaptive path)
**Method:** 5 Playwright-automated testers with distinct personas
**URL:** http://localhost:8080/level1.html

---

## Score Distribution

| Tester | Profile | Experience | Score | Level | L2 Qualified? |
|---|---|---|---|---|---|
| Maya | Humanities freshman | Never used AI | 67% | AI Apprentice | Yes |
| Dr. Sarah | Professor, AI skeptic | Tried a few times | 70% | AI Practitioner | Yes |
| Alex | Marketing pro | Uses regularly | 80% | AI Practitioner | Yes |
| Jake | CS sophomore | Uses regularly | 98% | AI Master | Yes |
| Rusher | Random clicker | Never used AI | 57% | AI Apprentice | Yes |

**All 5 testers qualified for Level 2.** This is a problem — the Rusher should not advance.

---

## Key Findings

### 1. Floor Score Too High (CRITICAL)

The Rusher scored **57% by always clicking the first option** — exactly at the Apprentice threshold, qualifying for Level 2. This undermines the gate's purpose.

**Root cause:** The 4-point graduated scoring (1-2-3-4) means even "wrong" answers often score 2-3 points. With a 1-4 scale, the mathematical floor is 25% (all 1s) and ceiling is 100% (all 4s). Random clicking averages ~2.5 points per question = 62.5% expected score. The current gate threshold of 57% is BELOW the random expected value.

**Fix options:**
- **A)** Raise the L2 gate threshold to 70%+ (above random expected value)
- **B)** Add a minimum time requirement (Rusher finished in 44 seconds vs 3+ minutes for real testers)
- **C)** Both A and B

### 2. Jake Scored Too High (98%)

Jake's persona (CS sophomore, overconfident, weak on ethics nuance) should realistically score 75-85%, not 98%. The subagent playing Jake was too good at picking correct answers despite the persona constraints.

**However,** this also reveals that a regular AI user can easily max out Level 1. The questions may be too easy for anyone with moderate AI experience. This is acceptable IF Level 2 provides the real differentiation.

### 3. Dimension Profiles Worked Well

The dimension breakdown accurately reflected each persona's strengths/weaknesses:

| Dimension | Maya (humanities) | Dr. Sarah (skeptic) | Alex (marketing) | Jake (CS) |
|---|---|---|---|---|
| AI Foundations | 4/8 weak | 6/8 academic | 5/8 weak | 8/8 strong |
| Problem Framing | 7/8 strong | 6/8 good | 8/8 strong | 8/8 strong |
| Tool Selection | 6/8 ok | 3/8 weak | 5/8 ok | 7/8 strong |
| Prompt Engineering | 5/8 ok | 3/8 weak | 8/8 strong | 8/8 strong |
| Critical Evaluation | 5/8 ok | 7/8 strong | 5/8 ok | 8/8 strong |
| Ethics & Safety | 6/8 good | 7/8 strong | 7/8 good | 8/8 strong |
| Collaboration | 6/8 good | 8/8 strong | 7/8 good | 8/8 strong |
| AI Building | 4/8 weak | 5/8 ok | 6/8 ok | 8/8 strong |

The radar charts would show distinct shapes per persona — this validates the 8-dimension model.

### 4. No Questions Were Universally Easy or Hard

No question scored 4 for ALL testers (Jake came close on most). Ethics and collaboration questions provided good differentiation between technical and non-technical users. AI Building and Prompt Engineering were the hardest for non-technical users.

---

## UX Issues Found

### Feedback Modal Timing
The "How was this test?" face-slider modal appears immediately over the results screen, blocking the score display. Users must dismiss it before seeing their results.

**Fix:** Increase the delay to 5+ seconds, or trigger it after the user scrolls past the score section.

### Google Sheets Submission
Console errors on submission — the Google Apps Script endpoint returns errors. Results show "saved" in UI but may not actually reach the sheet.

**Fix:** Deploy the updated Google Apps Script (Task 9) and verify the endpoint URL matches.

### Completion Time Display
All testers showed correct completion times (44s to 3m36s). Timer and progress bar worked correctly throughout.

---

## Gate Threshold Analysis

Current L2 gate: **57% (Apprentice level)**

| Tester | Should Pass? | Actually Passed? | Correct? |
|---|---|---|---|
| Maya (67%) | Yes — genuine effort | Yes | Correct |
| Dr. Sarah (70%) | Yes — knowledgeable | Yes | Correct |
| Alex (80%) | Yes — experienced user | Yes | Correct |
| Jake (98%) | Yes — strong user | Yes | Correct |
| Rusher (57%) | **No — random clicks** | **Yes** | **WRONG** |

**Recommendation:** Raise L2 gate to **70%** (Practitioner level) or add a minimum completion time of 2 minutes.

---

## Recommendations

### Immediate (before deployment)
1. **Raise L2 gate threshold to 70%** — prevents random clickers from advancing
2. **Deploy Google Apps Script** — ensure data collection works
3. **Delay feedback modal** — move to 5s+ after results render

### Short-term (next iteration)
4. **Add minimum time gate** — require 2+ minutes to submit (prevents bots/rushers)
5. **Question difficulty tuning** — some technical questions may be too easy for CS students; consider harder L1 questions or rely on L2 for differentiation
6. **Answer position audit** — verify shuffling works correctly; if choices are shuffled per-session, the Rusher's 57% may be an unlucky run (or lucky, depending on perspective)

### Medium-term (after L2 testing)
7. **Item analysis** — once real data flows into Google Sheets, calculate difficulty index and discrimination index per question
8. **Adaptive L1 difficulty** — if a user is clearly acing every question, skip ahead to harder ones
