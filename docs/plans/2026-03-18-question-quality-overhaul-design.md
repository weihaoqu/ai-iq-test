# Phase 1: Question Quality & Coverage Overhaul

**Date:** 2026-03-18
**Goal:** Improve AI IQ test question quality, fix dimension imbalance, update topic coverage for 2025-2026 AI landscape, and rebalance scoring.

## 1. Dimension Restructuring

Standardize all 8 dimensions to **6 questions each = 48 total** (up from 45).

| Dimension | Current | Target | Action |
|---|---|---|---|
| AI Foundations | 6 | 6 | Retire 2 weak, add 2 new |
| Problem Framing | 5 | 6 | Retire 1 overlap, add 2 new |
| Tool Selection | 6 | 6 | Retire 2 dated, add 2 new |
| Prompt Engineering | 6 | 6 | Keep strong set, refresh 0-1 |
| Critical Evaluation | 6 | 6 | Keep strong set |
| AI Ethics & Safety | 5 | 6 | Add 1 new |
| AI-Human Collaboration | 5 | 6 | Add 1 new |
| AI-Assisted Building (renamed from Vibe Coding) | 6 | 6 | Refresh 0-1 |

### Dimension Rename

- "Vibe Coding & AI Creation" -> "AI-Assisted Building" (ages better, inclusive of non-coders)

## 2. Question Audit

### Questions to Retire (~6)

| ID | Reason |
|---|---|
| f01 | "ChatGPT understands?" — too basic, widely known |
| f03 | "AI image generator trained on celebrity" — common knowledge in 2026 |
| f05 | "AI will replace ALL jobs" — stale debate, doesn't test real skill |
| t03 | "Spanish conversations with AI" — tests product knowledge, not AI literacy |
| t04 | "500 birthday emails" — generic automation, not AI-specific |
| p03 | Overlaps with f02 (both test non-determinism/temperature) |

### Strong Questions to Keep (no changes)

- e01 (few-shot vs verbal), e03 (sycophancy), e04 (fresh conversation)
- c01, c02 (citation hallucination, false verification)
- s04 (specific hallucinated details), h01 (framing bias)
- v03 (API key exposure), x01 (RAG), x02 (benchmark contamination)

### Missing Topics — New Questions Needed (~9)

1. **AI agents & tool use** — agents that browse, code, call APIs autonomously
2. **Multimodal AI** — image/video/audio input, not just text
3. **MCP / tool integration** — AI connecting to external services
4. **AI in education** — using AI to learn vs. using AI to cheat
5. **Open vs closed models** — when to use local/open-source vs API
6. **Agentic workflows** — multi-step AI pipelines, human-in-the-loop
7. **AI regulation & policy** — EU AI Act, deepfake laws, governance
8. **RAG depth** — beyond x01, deeper understanding of retrieval systems
9. **Learning with AI** — metacognition, skill-building vs. shortcutting

## 3. Scoring Rebalance

### Full Test (48 questions, range 48-192)

| Level | Score Range | % of Range |
|---|---|---|
| Novice | 48-110 | 43% |
| Apprentice | 111-140 | 21% |
| Practitioner | 141-170 | 21% |
| Master | 171-192 | 15% |

### Quick Mode

Increase from 8 to **16 questions** (2 per dimension, ~4 min).
Reduces single-question variance per dimension.

### Post-Launch Item Analysis

Use Google Sheets response data to calculate:
- **Difficulty index** per question (% answering correctly)
- **Discrimination index** (do high-scorers pick better answers?)
- Iterate: retire low-discrimination questions in future updates

## 4. Quality Assurance: Simulated Test-Takers

Use AI subagents simulating different student profiles to validate:
- No answer is guessable without real understanding
- Wrong answers are plausible (not obviously wrong)
- Score-4 answers require genuine insight, not just longest/most technical
- Difficulty spreads appropriately across dimensions

Profiles:
- Non-technical college student (business/humanities)
- CS freshman with basic coding
- Experienced AI user / CS senior

## 5. Phase 2 Preview: Boss Challenge

After Phase 1 ships, add a "Boss Challenge" unlocked at Practitioner level:
- **General track:** browser-based AI tasks (non-technical students)
- **Developer track:** Claude Code / coding tasks (CS students)
- Verification: outcome-based + reflection questions
- Separate badge/certificate, not a number score
- Full design deferred to Phase 2

## 6. Implementation Sequence

1. Write new questions (9 new) with 4-point graduated choices
2. Simulate test-takers (subagents) on all questions (new + existing)
3. Revise based on simulation feedback
4. Update index.html: swap questions, rename dimension, update scoring
5. Update questions.json as reference
6. Update Google Apps Script for 48-question schema
7. Test both modes (quick 16Q, full 48Q)
8. Deploy
