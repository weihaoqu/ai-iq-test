# Pre/Post Test Question Pool for LAI Sessions

**Purpose:** Measure learning gains from LearnAI teaching sessions. Same questions administered before and after a session.

**Format:** 6 questions, 4 choices each (A-D), ~3 minutes total. Scored 1-4 per question (graduated, not right/wrong).

**Design principles:**
- Questions should be answerable DIFFERENTLY after learning (sensitive to instruction)
- Avoid questions that test general knowledge or are guessable without AI literacy
- Cover the most teachable dimensions (not deep technical knowledge)
- Short question stems — no long scenarios (saves reading time)
- Each question maps to 1 dimension so you can track per-dimension growth

---

## Question Pool (18 questions — pick 6 per session, or use fixed set for consistency)

### AI Foundations (3 questions)

**F1. What happens when you give ChatGPT the exact same prompt twice?**
- A) It gives the same answer because the input is identical → **Score 1** (misconception about determinism)
- B) Slight variations because a randomness parameter affects word selection → **Score 4** (understands temperature/sampling)
- C) Different answers because it searches the internet each time → **Score 2** (wrong mechanism, right observation)
- D) It remembers the first answer and tries to improve it → **Score 1** (misconception about memory)

**F2. When an AI chatbot says "I think" or "I believe," what's actually happening?**
- A) The AI is expressing its genuine opinion based on its training → **Score 1**
- B) It's generating words that statistically follow patterns of human expression — it has no beliefs → **Score 4**
- C) The AI is uncertain and signaling that you should verify → **Score 3** (partially right but attributes too much intent)
- D) It's been programmed to sound more human and trustworthy → **Score 2** (surface-level understanding)

**F3. A news headline says "AI scores 90% on a medical exam." What should you think first?**
- A) AI is ready to help with medical diagnosis → **Score 1**
- B) Multiple-choice exams don't test the clinical judgment doctors actually need → **Score 4**
- C) That's impressive — AI might replace some doctors soon → **Score 1**
- D) I'd want to know which exam and how it was tested → **Score 3** (good instinct, less specific)

---

### Prompt Engineering (3 questions)

**P1. You ask AI to "write something about climate change" and get a vague essay. What's the best fix?**
- A) Ask it again — it might do better the second time → **Score 1**
- B) Tell it: "Write a 200-word persuasive paragraph for college students arguing for campus solar panels, with 2 statistics" → **Score 4** (specific constraints)
- C) Add "please write a good one" to be more encouraging → **Score 1**
- D) Switch to a more powerful AI model → **Score 2** (wrong lever)

**P2. You need AI to format data consistently. Which approach works best?**
- A) Describe the format you want in detail → **Score 2**
- B) Show 2-3 examples of correctly formatted output, then give it new data → **Score 4** (few-shot prompting)
- C) Ask it to "be consistent with formatting" → **Score 1**
- D) Copy-paste from a spreadsheet so it understands the structure → **Score 3** (provides context but not examples)

**P3. An AI keeps giving you overly long responses. What's the most effective fix?**
- A) Say "shorter please" → **Score 2** (works but imprecise)
- B) Specify the constraint: "Answer in exactly 2 bullet points, max 15 words each" → **Score 4** (precise constraint)
- C) Regenerate until you get a shorter one → **Score 1** (inefficient)
- D) Start a new conversation — this one is stuck in verbose mode → **Score 2** (misconception)

---

### Critical Evaluation (3 questions)

**C1. AI writes a research summary with 5 citations. How should you treat them?**
- A) If citations look real (author names, journal, year), they're probably accurate → **Score 1**
- B) AI frequently fabricates realistic-looking citations — verify every one → **Score 4**
- C) Check the first one; if it's real, the rest probably are too → **Score 2**
- D) Citations from well-known journals are more likely to be real → **Score 2**

**C2. You ask AI the same question three times and get the same answer each time. This means:**
- A) The answer is very likely correct — consistency confirms accuracy → **Score 1** (common misconception)
- B) Nothing about correctness — the same model repeats the same biases → **Score 4**
- C) The AI is very confident in this answer → **Score 2**
- D) You should trust it more than a single response → **Score 1**

**C3. AI gives you a confident, detailed answer about a niche topic you know nothing about. What should you do?**
- A) Trust it — AI is especially good at niche topics with lots of training data → **Score 1**
- B) The more confident and specific AI sounds, the MORE you should verify — fluency doesn't equal accuracy → **Score 4**
- C) Ask the AI if it's sure about its answer → **Score 2** (AI will usually say yes)
- D) Check if the key facts appear in a quick Google search → **Score 3** (good instinct, incomplete strategy)

---

### Ethics & Safety (3 questions)

**E1. A student pastes their essay into ChatGPT and asks "make this better." What's the main concern?**
- A) The AI might plagiarize from its training data → **Score 2**
- B) The student loses the learning opportunity and can't explain their own improvements → **Score 4**
- C) The AI might change the student's original meaning → **Score 2**
- D) This is fine — it's like using spellcheck → **Score 1**

**E2. Your company's free ChatGPT account is used to summarize customer complaint emails. What's the risk?**
- A) The AI might misunderstand the complaints → **Score 2** (real but minor risk)
- B) Customer personal data in those emails may be used to train the model → **Score 4** (data privacy)
- C) The summaries might be biased against certain customers → **Score 3** (valid concern, less critical)
- D) No real risk — AI processes data securely → **Score 1**

**E3. An AI hiring tool rejects 80% of female applicants. The company says "the AI is just following the data." What's the right response?**
- A) The AI must be finding real differences in qualifications → **Score 1**
- B) Historical hiring data reflects past discrimination — the AI is amplifying it, not discovering truth → **Score 4**
- C) The algorithm should be tweaked to accept more women → **Score 2** (band-aid, misses root cause)
- D) AI shouldn't be used for hiring decisions → **Score 3** (valid stance but avoids understanding the problem)

---

### Human-AI Collaboration (3 questions)

**H1. When is AI LEAST helpful for learning a new skill?**
- A) When you ask it to explain concepts in simple terms → **Score 2** (AI is ok at this)
- B) When you ask it to do the work so you can study the output → **Score 4** (passive consumption, no learning)
- C) When you use it to check your own work and explain your mistakes → **Score 1** (this is actually helpful)
- D) When you use it to generate practice problems → **Score 1** (this is also helpful)

**H2. You're using AI to help write a project proposal. What's the best workflow?**
- A) Have AI write the first draft, then edit it → **Score 2** (loses your thinking)
- B) Write your own outline and key arguments first, then use AI to refine language and find gaps → **Score 4**
- C) Alternate: you write one section, AI writes the next → **Score 3** (collaborative but disjointed)
- D) Tell AI everything about the project and let it structure the proposal → **Score 1** (full delegation)

**H3. A team member says "I verified this with AI." How reliable is that?**
- A) Very reliable — AI has access to vast knowledge → **Score 1**
- B) Not reliable at all — AI confirms whatever framing you give it (sycophancy bias) → **Score 4**
- C) Somewhat reliable — depends on the topic → **Score 2**
- D) Reliable if they used a paid/enterprise AI model → **Score 1**

---

### Tool Selection (3 questions)

**T1. You need to extract specific data from a 50-page PDF report. Best approach?**
- A) Copy-paste the whole PDF into ChatGPT → **Score 2** (may exceed context, loses formatting)
- B) Use a PDF-specific AI tool that preserves document structure → **Score 4**
- C) Manually find the pages you need, then paste those sections → **Score 3** (works but slow)
- D) Ask ChatGPT to search for the PDF online → **Score 1** (can't browse/search reliably)

**T2. You want AI to generate images for a class presentation. What should you know?**
- A) AI images are always free to use for any purpose → **Score 1**
- B) AI generates raster images; usage rights depend on the tool and your subscription tier → **Score 4**
- C) AI images are all copyrighted by the AI company → **Score 2** (oversimplified)
- D) You should cite "AI-generated" but otherwise use freely → **Score 3** (good practice, incomplete understanding)

**T3. When should you use a local/open-source AI model instead of ChatGPT?**
- A) When you want better quality answers → **Score 1** (not necessarily true)
- B) When data privacy is critical and you can't send data to external servers → **Score 4**
- C) When you need faster response times → **Score 2** (sometimes true but not the main reason)
- D) Local models are always worse, so never → **Score 1**

---

## Recommended 6-Question Set (Fixed Pre/Post)

For maximum consistency across LAI sessions, use this balanced set:

| # | Question | Dimension | Why Selected |
|---|----------|-----------|-------------|
| 1 | F2 | Foundations | Tests understanding of AI "thinking" — directly teachable |
| 2 | P1 | Prompting | Tests prompt specificity — core LAI skill |
| 3 | C1 | Critical Eval | Tests citation trust — common misconception, high impact |
| 4 | E2 | Ethics | Tests data privacy awareness — practical and teachable |
| 5 | H2 | Collaboration | Tests human-AI workflow — applies to every student |
| 6 | C2 | Critical Eval | Tests consistency ≠ accuracy — unintuitive, big learning moment |

**Expected pre-test average:** ~14/24 (58%) for AI novices
**Expected post-test average:** ~20/24 (83%) after a good LAI session
**Statistical test:** Wilcoxon signed-rank (paired, non-parametric) for pre/post comparison

---

## Implementation Notes

- Questions are short — no scenario images needed, pure text MCQ
- Can be embedded in a Google Form or built as a lightweight standalone page
- Shuffle choice order per student to prevent position bias
- For research: use the fixed 6-question set for statistical validity
- For teaching: rotate from the 18-question pool to keep sessions fresh
- Pre/post should use IDENTICAL questions (not parallel forms) — the point is to measure if answers change
