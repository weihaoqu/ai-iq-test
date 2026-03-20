# Deferred Improvements — Future Passes

Issues identified by simulated test-takers, deferred for future iterations.

## B) Test Validity & Psychometrics (Future)
- Run item analysis on Google Sheets data: difficulty index + discrimination index per question
- Identify questions where most people score 4 (too easy) or 1 (too hard)
- Wilcoxon signed-rank test if used as pre/post in iticse
- Consider Rasch analysis for larger datasets

## Score-3 vs Score-4 Ambiguity (Medium Priority)
- **t05**: Vibe-coding (Bolt/Lovable) vs no-code (Wix) for zero coding experience — debatable ranking
- **v05**: "Directing AI" (C) vs "technical debt" (B) — both valid "surprising lessons," difference is subjective
- **e05**: Chain-of-thought (B) vs listing assumptions (D) — both valid strategies, partially addressed
- **t02**: Dedicated PDF tools (D) sometimes better than generic LLM upload (B) — debatable

## Content Gaps (Low Priority — for future question refresh)
- Bias/fairness in AI outputs — no question covers this
- Environmental cost of AI — energy, compute
- Accessibility concerns with AI tools
- AI and misinformation/deepfakes (beyond regulation)

## Datedness Risks (Track quarterly)
- t02: mentions Humata, Adobe AI Assistant — may become irrelevant
- t05: mentions Bolt, Lovable — very new tools, may change
- t07: mentions MCP — cutting edge, protocol may evolve
- s01: ChatGPT Team plan specifics may change

## CS Student Advantage
- Some questions (v03 API keys, h03 LLMs don't execute code, x04 architecture) are significantly easier for CS students
- Consider rebalancing if test is used with purely non-technical populations
- Quick mode should avoid selecting only CS-advantaged questions per dimension

## UX Improvements (Phase 1C)
- Add post-answer explanations (why each choice scores what it does)
- Show difficulty stats ("60% got this right") after answering
- Adaptive difficulty based on running score
- Progress feedback beyond progress bar

## Technical Improvements (Phase 1D)
- Externalize questions from index.html (load from JSON)
- Add analytics (time per question, completion rates, bounce rates)
- Certification validation URL
- Item analysis dashboard in Google Sheets
