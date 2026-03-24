# AI IQ Test — Phase 2 Adaptive Mode: Stitch UI Spec

Use this document to generate the UI screens for the Phase 2 Adaptive Test Mode. The app is a web-based AI literacy assessment with a deep space / glassmorphism visual theme.

---

## Design System

### Color Palette
- **Background:** `#06080f` (near-black deep blue)
- **Elevated surface:** `#0c1222`
- **Card backgrounds:** `rgba(12, 18, 40, 0.45)` with `backdrop-filter: blur(24px) saturate(180%)`
- **Primary blue:** `#2563eb` (buttons, links, active states)
- **Primary light:** `#60a5fa` (hover states, secondary text)
- **Accent amber:** `#f59e0b` (selected states, highlights, calls-to-action)
- **Cyan:** `#22d3ee` (progress indicators, glow accents)
- **Text:** `#e2e8f0` (primary), `#7c8ea3` (dim), `#5b6b82` (muted)
- **Borders:** `rgba(37, 99, 235, 0.12)` default, `rgba(96, 165, 250, 0.5)` active

### Dimension Colors (8 total)
- AI Foundations: `#60a5fa` (blue)
- Problem Framing: `#f472b6` (pink)
- Tool Selection: `#f59e0b` (amber)
- Prompt Engineering: `#34d399` (green)
- Critical Evaluation: `#fb923c` (orange)
- Ethics & Safety: `#a78bfa` (purple)
- Human Collaboration: `#38bdf8` (sky blue)
- AI-Assisted Building: `#f97316` (deep orange)

### Typography
- **Headings:** "Outfit", sans-serif — weights 700-900, tight letter-spacing (-0.02em)
- **Body:** "Outfit", sans-serif — weight 400-500
- **Monospace accents:** "Space Mono", monospace — stats, scores, labels

### Component Styles
- **Cards:** Glassmorphism — dark translucent bg, blur backdrop, subtle border glow, rounded corners (20px)
- **Buttons (primary):** Gradient `linear-gradient(135deg, #1d4ed8, #2563eb)`, white text, blue glow shadow
- **Buttons (outline):** Transparent bg, subtle border, primary-light text
- **Inputs:** Dark bg `#0c1222`, subtle border, amber focus ring
- **Badges:** Pill-shaped, uppercase, small text, backdrop blur
- **Animations:** Subtle — fadeUp on screen entry, scale on button press, glow pulse on highlights

### Layout
- Max width: 640px, centered
- Full viewport height with flex column layout
- Consistent padding: 20px on container, 24px inside cards
- Mobile-first, responsive down to 375px

---

## Screen 1: Landing Page (index.html)

### Purpose
Mode selection hub. Shows 3 test mode cards + existing sharing/returning-user banner.

### Layout
- Top: Animated logo/badge "AI IQ TEST" with glow pulse
- Below logo: Subtitle "What's Your AI Intelligence?"
- Middle: 8 dimension pills (colored, rounded, staggered animation)
- Stats row: "48 Questions · 8 Dimensions · ~10 min"

### Mode Selection Cards (3 cards in vertical stack)

**Card 1: Full Assessment**
- Icon: Brain/chart icon
- Title: "Full Assessment"
- Subtitle: "48 questions · ~10 min · Detailed analysis"
- Accent color: Primary blue
- CTA: "Start Full Test →"
- Links to existing full test flow

**Card 2: Adaptive Assessment** (NEW — hero card, slightly larger)
- Icon: Lightning bolt or level-up icon
- Title: "Adaptive Assessment"
- Subtitle: "3 levels · Adapts to your skills · Unlock the Boss Challenge"
- Accent color: Cyan/amber gradient
- Badge: "NEW" pill in amber
- CTA: "Begin Level 1 →"
- Visual: 3 small level indicators (L1 ○ → L2 ○ → L3 ○) showing progression
- Links to level1.html

**Card 3: Boss Challenge** (NEW — locked/unlocked state)
- Icon: Trophy/crown icon
- Default state (locked):
  - Greyed out / dimmed card
  - Lock icon overlay
  - Text: "Complete Adaptive Assessment at Practitioner level to unlock"
  - Not clickable
- Unlocked state:
  - Full color with amber glow border
  - Badge: "UNLOCKED" pill in amber
  - Title: "Boss Challenge"
  - Subtitle: "Multi-step case study · Pass/fail · Earn your badge"
  - CTA: "Accept Challenge →"
  - Links to level3.html

### Bottom
- Footer links: About, methodology, credits

---

## Screen 2: Level 1 — Welcome (level1.html)

### Purpose
Collect participant name and experience level before starting the quick scan.

### Layout
- Header: "Level 1: Quick Scan" with level indicator (L1 ● → L2 ○ → L3 ○)
- Subtitle: "16 questions · ~4 minutes · Test your AI foundations"
- Glass card containing:
  - Input field: "Your name" (text input)
  - Dropdown: "AI Experience Level" (Never used AI / Tried a few times / Use regularly / Use daily for work)
  - Primary button: "Start Quick Scan →"
- Animated background (subtle shader)

---

## Screen 3: Level 1 — MCQ Question (level1.html)

### Purpose
Standard multiple-choice question screen (same as existing, extracted).

### Layout
- Top bar:
  - Left: "Level 1" label + current question counter "Q 3/16"
  - Right: Timer "02:34"
- Progress bar: Gradient fill with glowing dot at end
- Progress dots: 16 dots, filled = answered, current = cyan glow
- Glass card:
  - Scenario image (16:10 aspect ratio, rounded corners)
  - Question text (1.05rem, 500 weight)
- 4 choice buttons (vertical stack):
  - Each: Letter badge (A/B/C/D) + choice text
  - Default: Dark bg, subtle border
  - Hover: Blue glow outline
  - Selected: Amber border, amber letter badge, subtle amber bg
- Navigation row:
  - Left: "← Back" outline button (hidden on Q1)
  - Right: "Next →" primary button (disabled until selection)

### Interactions
- Click choice → selects it (amber highlight)
- Click Next → advance (fadeUp transition)
- Keyboard: 1-4 to select, Enter to advance, Backspace to go back

---

## Screen 4: Level 1 — Results & Gate (level1.html)

### Purpose
Show L1 results and gate to Level 2.

### Layout
- Header: "Level 1 Complete" with checkmark
- Level indicator: L1 ✓ → L2 ○ → L3 ○

**Score Section (glass card):**
- Large animated score number (percentage, e.g., "78%")
- Level badge below score (color-coded pill):
  - Novice: gray
  - Apprentice: blue
  - Practitioner: amber
  - Master: cyan with glow
- Time taken: "Completed in 3:42"

**Radar Chart (glass card):**
- 8-axis spider/radar chart
- One axis per dimension, labeled with dimension name + color
- Filled polygon with glow effect
- Dimension labels around the outside

**Dimension Breakdown (glass card):**
- 8 rows, one per dimension:
  - Dimension name (colored dot) + score bar + "X/8" label
  - Animated bar fill on load

**Gate Section:**

*If Apprentice+:*
- Glass card with cyan/amber gradient border
- "You've qualified for Level 2!"
- "Level 2 adapts to your results — focusing on your developing areas with new question formats."
- Primary button (large): "Continue to Level 2 →"
- Outline button: "Review Answers" (expandable section)

*If Novice:*
- Glass card with subtle red/orange border
- "You need Apprentice level to advance"
- "Score 57%+ to unlock Level 2. Focus on [weakest 2-3 dimensions]."
- Primary button: "Try Again"
- Outline button: "Review Answers"

---

## Screen 5: Level 2 — Transition (level2.html)

### Purpose
Brief intro before Level 2 questions begin. Explains new formats.

### Layout
- Level indicator: L1 ✓ → L2 ● → L3 ○
- Header: "Level 2: Deep Dive"
- Subtitle: "Adapted to your Level 1 results"

**What to Expect (glass card):**
- 3 format preview items (icon + label + one-line description):
  - 🔢 Ranking — "Drag to order approaches from best to worst"
  - ☑️ Multi-Select — "Choose all answers that apply"
  - ✍️ Free Response — "Write your approach, then self-assess"
- "~12 questions · ~8 minutes"

**Focus Areas (glass card):**
- "Based on your Level 1 results, we're testing deeper on:"
- 3-4 dimension pills (weakest dimensions, colored)
- "+ verifying:" 1-2 dimension pills (strongest)

- Primary button: "Start Level 2 →"

---

## Screen 6: Level 2 — Ranking Question (level2.html)

### Purpose
New question format: drag-to-reorder.

### Layout
- Top bar: "Level 2" + "Q 2/12" + Timer
- Progress bar + dots
- Glass card:
  - Question text: "Rank these 4 approaches from best (top) to worst (bottom) for [scenario]:"
- Draggable list (4 items, vertical):
  - Each item: Drag handle (≡ icon) + rank number (1-4, auto-updating) + item text
  - Default: Dark bg, subtle border
  - Dragging: Elevated with blue glow, slight scale up
  - Drop target: Subtle line indicator between items
  - On mobile: Tap item → tap position to swap (alternative to drag)
- Navigation row: Back + Next

### After Submit — Self-Assessment Overlay
- Slide-up panel (glass card):
  - "Here's the recommended order:" — shows correct ranking with brief explanation per item
  - Separator line
  - "How well did your ranking match?"
  - 4 radio-style buttons (horizontal):
    - "Way off (1)" / "Partially right (2)" / "Close (3)" / "Nailed it (4)"
  - "Continue →" button

---

## Screen 7: Level 2 — Multi-Select Question (level2.html)

### Purpose
New question format: select all that apply.

### Layout
- Top bar + progress (same pattern)
- Glass card:
  - Question text: "Select ALL that apply: [scenario question]"
- Checkbox list (5-6 items, vertical):
  - Each item: Custom checkbox (square, rounded corners) + item text
  - Unchecked: Dark bg, subtle border
  - Checked: Amber checkbox fill with checkmark, subtle amber bg tint
  - Hover: Blue glow outline
- Counter: "X selected" below the list
- Navigation row: Back + Submit (primary, replaces Next)

### After Submit — Self-Assessment Overlay
- Same slide-up panel pattern as ranking
- "Correct answers:" — shows correct set with green checkmarks, wrong items with red X
- "How accurate was your selection?" — 4-point scale
- "Continue →"

---

## Screen 8: Level 2 — Free-Text Question (level2.html)

### Purpose
New question format: open response with rubric self-assessment.

### Layout
- Top bar + progress
- Glass card:
  - Question text: "Describe how you would approach [scenario]. Consider [specific constraints]."
- Textarea:
  - Dark bg, subtle border, 5 rows default (expandable)
  - Placeholder: "Write your approach here..."
  - Character indicator below: "~200-500 characters recommended" (soft guideline, not enforced)
  - Amber focus border
- Navigation row: Back + Submit

### After Submit — Rubric Self-Assessment Overlay
- Slide-up panel (larger, scrollable):
  - "Compare your answer to these levels:"
  - 4 rubric cards stacked vertically, each a mini glass card:
    - **Expert (4):** Description + exemplar snippet
    - **Proficient (3):** Description + exemplar snippet
    - **Developing (2):** Description + exemplar snippet
    - **Novice (1):** Description + exemplar snippet
  - Each card is selectable (tap to select as your self-rating)
  - Selected card: Amber border + "Your rating" badge
  - Active rubric card has a subtle expand to show full exemplar
- "Continue →" button (disabled until rating selected)

---

## Screen 9: Level 2 — Results & Gate (level2.html)

### Purpose
Show combined L1+L2 results and gate to Level 3.

### Layout
- Level indicator: L1 ✓ → L2 ✓ → L3 ○ (or L3 🔓 if unlocked)
- Header: "Level 2 Complete"

**Combined Score (glass card):**
- Large score (percentage)
- Level badge
- Improvement indicator: "↑ 12% from Level 1" (or ↓ if lower)
- Time: "Level 2 completed in 7:23"

**Overlaid Radar Chart (glass card):**
- Two polygons on same 8-axis chart:
  - L1 polygon: Dimmed/translucent (blue, 30% opacity)
  - L2 polygon: Bright (cyan/amber, full opacity)
  - Legend: "Level 1" vs "Level 2"
- Visual shows growth in weak areas

**Dimension Breakdown (glass card):**
- 8 rows with dual bars:
  - L1 bar (dimmed) + L2 bar (bright) side by side
  - Shows per-dimension improvement

**Gate Section:**

*If Practitioner+:*
- Celebratory glass card with amber glow, subtle confetti/particle animation
- "Boss Challenge Unlocked! 🏆"
- "You've proven broad AI literacy. The Boss Challenge tests how you apply it to a real-world project."
- Primary button (large, gradient): "Return to Home" (saves unlock to localStorage)
- Subtitle: "Access Boss Challenge from the home screen anytime"

*If below Practitioner:*
- Encouraging glass card
- "Almost there — Practitioner level needed"
- Weakest areas highlighted with tips
- "Retry Level 2" button + "Return to Home" outline button

---

## Screen 10: Level 3 — Briefing (level3.html)

### Purpose
Set the scene for the Boss Challenge case study.

### Layout
- Level indicator: L1 ✓ → L2 ✓ → L3 ●
- Header: "Boss Challenge" with trophy icon
- Phase indicator: ● Briefing → ○ Planning → ○ Execution → ○ Reflection

**Scenario Card (large glass card):**
- Scenario title: e.g., "AI-Powered Clinic Support"
- Scenario illustration (full-width, atmospheric, 16:9)
- Scenario text (2-3 paragraphs, well-formatted):
  - The situation, the constraints, the goal
  - Key details: budget, timeline, data sensitivity, team size
- "Key constraints" callout box (subtle different bg):
  - Bullet list of 3-5 constraints
- Primary button: "Begin Planning →"
- Note: "Read carefully — you'll reference this throughout the challenge"

---

## Screen 11: Level 3 — Planning Phase (level3.html)

### Purpose
First active phase: free-text planning response.

### Layout
- Phase indicator: ✓ Briefing → ● Planning → ○ Execution → ○ Reflection
- Header: "Phase 1: Planning"
- Scenario summary card (collapsed, expandable — quick reference to briefing)

**Prompt (glass card):**
- "Outline your approach to this project:"
- Sub-prompts (guiding bullets, dimmed text):
  - "Which AI tools or services would you use?"
  - "How would you handle the data sensitivity concerns?"
  - "What are the biggest risks and how would you mitigate them?"
  - "What's your timeline breakdown?"

**Textarea:**
- Large (8 rows min), dark bg, amber focus
- Character indicator

**Submit → Self-Assessment:**
- Same rubric overlay pattern as Level 2 free-text
- 4-level rubric specific to planning quality
- "Continue to Execution →"

---

## Screen 12: Level 3 — Execution Phase (level3.html)

### Purpose
2-3 practical sub-tasks building on the scenario.

### Layout
- Phase indicator: ✓ Briefing → ✓ Planning → ● Execution → ○ Reflection
- Header: "Phase 2: Execution"
- Sub-phase dots: ● ○ ○ (for 3 sub-tasks)

**Sub-task 1: Ranking**
- Same layout as Level 2 ranking question
- Context: Scenario-specific (e.g., "Prioritize these implementation steps")
- Self-assessment after submit

**Sub-task 2: Multi-Select**
- Same layout as Level 2 multi-select
- Context: Scenario-specific (e.g., "Which data practices apply?")
- Self-assessment after submit

**Sub-task 3: Decision Point (Free-text)**
- "A problem has emerged: [scenario twist]. What do you do?"
- Same free-text + rubric pattern
- Self-assessment after submit

Each sub-task transitions with fadeUp animation.

---

## Screen 13: Level 3 — Reflection Phase (level3.html)

### Purpose
Final phase: metacognitive reflection.

### Layout
- Phase indicator: ✓ Briefing → ✓ Planning → ✓ Execution → ● Reflection
- Header: "Phase 3: Reflection"

**Prompt (glass card):**
- "Look back at your entire approach:"
- Sub-prompts:
  - "What would you do differently if you started over?"
  - "What's the biggest risk you didn't fully address?"
  - "What did this challenge reveal about your AI knowledge?"

**Textarea + Self-Assessment** (same pattern)

**Submit button:** "Complete Boss Challenge →"

---

## Screen 14: Level 3 — Result (level3.html)

### Purpose
Pass/fail outcome with badge and journey summary.

### Layout — Pass
- Large centered trophy/badge animation (scale-in + glow)
- "Boss Challenge Complete!"
- Badge: "AI PRACTITIONER — BOSS LEVEL" (amber/cyan gradient, glow)
- Glass card — Phase scores (visual only, no number):
  - 4 phase dots: ✓ ✓ ✓ ✓ (green) or ✓ ✓ ✗ ✓ (mixed)
  - "Planning: Strong · Execution: Strong · Reflection: Excellent"

**Journey Summary (glass card):**
- Visual timeline:
  - L1: "Quick Scan — 78% Apprentice" (blue dot)
  - L2: "Deep Dive — 82% Practitioner" (cyan dot)
  - L3: "Boss Challenge — Passed" (amber star)
- Connecting line between dots

**Actions:**
- "Download Certificate" (primary button)
- "Download Report" (outline button)
- "Share Result" (share button with gradient)
- "Return Home" (text link)

### Layout — Fail
- Encouraging illustration (not a big red X — more like "almost there")
- "Not quite — but you're close"
- Glass card showing phase-by-phase feedback:
  - Which phases were strong vs. need improvement
  - Specific tips per weak phase
- "Try Again" primary button (assigns different scenario if available)
- "Return Home" outline button

---

## Shared Components

### Level Indicator (appears on all Level screens)
- Horizontal row of 3 circles connected by lines:
  - L1 ○ ── L2 ○ ── L3 ○
  - States: empty (○), active/current (● with glow), completed (✓ filled)
  - Labels below: "Quick Scan" / "Deep Dive" / "Boss Challenge"

### Self-Assessment Overlay
- Slides up from bottom (mobile-friendly)
- Glass card with higher blur
- Semi-transparent dark backdrop behind
- Close/dismiss not available — must complete assessment
- Consistent across all question types

### Feedback Modal (after final results on each level)
- Same as existing: 3-state face animation slider
- Bad / Not Bad / Good
- Optional comment textarea
- Submit button

### Responsive Behavior
- Desktop: 640px centered, comfortable spacing
- Tablet: Same layout, touch-friendly targets
- Mobile (375px+): Stacked layout, larger touch targets (min 44px), reduced padding (16px)
- Draggable list on mobile: Alternative tap-to-swap mode alongside drag
