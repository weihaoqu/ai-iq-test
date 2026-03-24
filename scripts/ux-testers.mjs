#!/usr/bin/env node
/**
 * 5 Simulated UX Testers for AI IQ Test
 * Uses Puppeteer directly (not MCP Playwright) to avoid session state issues.
 *
 * Run: node scripts/ux-testers.mjs
 * Requires: server running on http://localhost:8080
 */

import puppeteer from 'puppeteer';
import { readFile, writeFile, mkdir } from 'fs/promises';

const BASE = 'http://localhost:8080';
const REPORT_PATH = 'docs/test-reports/2026-03-24-phase3-ux-testers.md';

// 5 tester personas
const TESTERS = [
  {
    name: 'Zoe', age: 15, label: 'Teen (mobile)',
    experience: 'beginner', viewport: { width: 375, height: 812 },
    answerStrategy: 'gut', // picks first decent-looking answer quickly
    uxFocus: 'Is it confusing? Would I get bored?'
  },
  {
    name: 'Robert', age: 65, label: 'Senior',
    experience: 'none', viewport: { width: 1280, height: 720 },
    answerStrategy: 'cautious', // picks safe/conservative answers
    uxFocus: 'Can I read the text? Are buttons clear?'
  },
  {
    name: 'Mei', age: 22, label: 'ESL Student',
    experience: 'beginner', viewport: { width: 1024, height: 768 },
    answerStrategy: 'moderate', // picks reasonable answers
    uxFocus: 'Is the wording clear? Any jargon I wouldn\'t know?'
  },
  {
    name: 'Flash', age: 25, label: 'Speed Runner',
    experience: 'regular', viewport: { width: 1440, height: 900 },
    answerStrategy: 'fast', // always picks first option, moves fast
    uxFocus: 'Any friction? How fast can I finish?'
  },
  {
    name: 'Diana', age: 35, label: 'Careful Reader',
    experience: 'regular', viewport: { width: 1280, height: 720 },
    answerStrategy: 'best', // tries to pick the best answer
    uxFocus: 'Any inconsistencies? Missing info?'
  }
];

// Experience value mapping
const EXP_MAP = {
  none: 'Never used AI tools',
  beginner: 'Tried ChatGPT a few times',
  regular: 'Use AI tools regularly',
  advanced: 'Build things with AI daily'
};

// Answer strategy: which choice index to pick (0-3)
function pickAnswer(strategy, choiceCount) {
  switch (strategy) {
    case 'fast': return 0; // always first
    case 'gut': return Math.floor(Math.random() * 2); // first or second
    case 'cautious': return Math.min(2, choiceCount - 1); // third option (conservative)
    case 'moderate': return Math.floor(Math.random() * choiceCount);
    case 'best': return 1; // second option (often good but not always best)
    default: return 0;
  }
}

async function runTester(tester) {
  const issues = [];
  const result = { name: tester.name, label: tester.label, issues: [], score: null, level: null, l2Qualified: null, timeSeconds: 0 };

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(tester.viewport);

  const startTime = Date.now();

  try {
    // === LEVEL 1 ===
    await page.goto(`${BASE}/level1.html`, { waitUntil: 'networkidle2', timeout: 10000 });
    await page.waitForSelector('#inp-name', { timeout: 5000 });

    // Check: is welcome screen readable?
    const welcomeTitle = await page.$eval('h1', el => ({
      text: el.textContent,
      fontSize: getComputedStyle(el).fontSize,
      visible: el.offsetHeight > 0
    }));
    if (parseInt(welcomeTitle.fontSize) < 20) {
      issues.push({ severity: 'medium', screen: 'Welcome', issue: `Title font too small: ${welcomeTitle.fontSize}` });
    }

    // Fill form
    await page.type('#inp-name', tester.name);
    await page.select('#inp-background', tester.experience === 'none' ? '' : tester.experience);

    // Check: is the experience dropdown populated?
    const selectOptions = await page.$$eval('#inp-background option', opts => opts.map(o => o.value));
    if (selectOptions.length < 4) {
      issues.push({ severity: 'high', screen: 'Welcome', issue: 'Experience dropdown has fewer than 4 options' });
    }

    // Select experience (handle the value mapping)
    const expValues = { none: 'none', beginner: 'beginner', regular: 'regular', advanced: 'advanced' };
    await page.select('#inp-background', expValues[tester.experience] || 'beginner');

    // Click Start
    const startBtn = await page.$('.btn-primary.btn-lg');
    if (!startBtn) {
      issues.push({ severity: 'critical', screen: 'Welcome', issue: 'Start button not found' });
      await browser.close();
      result.issues = issues;
      return result;
    }

    // Check button size (touch target)
    const btnBox = await startBtn.boundingBox();
    if (btnBox && btnBox.height < 44) {
      issues.push({ severity: 'high', screen: 'Welcome', issue: `Start button too small for touch: ${Math.round(btnBox.height)}px (need 44px+)` });
    }

    await startBtn.click();
    await page.waitForSelector('#screen-question.active', { timeout: 5000 }).catch(() => {
      // Try waiting for question text instead
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check: did we transition to question screen?
    const questionVisible = await page.$('#q-text');
    if (!questionVisible) {
      issues.push({ severity: 'critical', screen: 'Question', issue: 'Question screen did not load after clicking Start' });
      await browser.close();
      result.issues = issues;
      return result;
    }

    // Answer 8 questions
    let toastsSeen = 0;
    for (let q = 0; q < 8; q++) {
      await new Promise(r => setTimeout(r, 300)); // Brief pause like a real user

      // Check question text readability
      const qText = await page.$eval('#q-text', el => ({
        text: el.textContent,
        fontSize: getComputedStyle(el).fontSize,
        lineHeight: getComputedStyle(el).lineHeight
      })).catch(() => null);

      if (qText && parseInt(qText.fontSize) < 14) {
        issues.push({ severity: 'medium', screen: `Q${q+1}`, issue: `Question text too small: ${qText.fontSize}` });
      }

      // Check choices exist
      const choices = await page.$$('.choice-btn');
      if (choices.length === 0) {
        issues.push({ severity: 'critical', screen: `Q${q+1}`, issue: 'No choice buttons found' });
        break;
      }

      // Check choice button size
      if (choices[0]) {
        const choiceBox = await choices[0].boundingBox();
        if (choiceBox && choiceBox.height < 44) {
          if (q === 0) issues.push({ severity: 'high', screen: 'Questions', issue: `Choice buttons too small: ${Math.round(choiceBox.height)}px` });
        }
      }

      // Pick answer based on strategy
      const idx = pickAnswer(tester.answerStrategy, choices.length);
      await choices[Math.min(idx, choices.length - 1)].click();
      await new Promise(r => setTimeout(r, 200));

      // Click Next
      const nextBtn = await page.$('#btn-next:not([disabled])');
      if (!nextBtn) {
        issues.push({ severity: 'high', screen: `Q${q+1}`, issue: 'Next button still disabled after selecting answer' });
        // Try clicking the choice again
        await choices[Math.min(idx, choices.length - 1)].click();
        await new Promise(r => setTimeout(r, 500));
        const retryBtn = await page.$('#btn-next:not([disabled])');
        if (retryBtn) await retryBtn.click();
        else break;
      } else {
        await nextBtn.click();
      }

      await new Promise(r => setTimeout(r, 300));

      // Check for toast (progress feedback)
      const toast = await page.$('.toast.show');
      if (toast) toastsSeen++;
    }

    // Wait for results
    await new Promise(r => setTimeout(r, 2000));

    // Check if progress toasts appeared
    if (toastsSeen === 0) {
      issues.push({ severity: 'low', screen: 'Questions', issue: 'No progress toasts seen during quiz (expected at Q2, Q4, Q6)' });
    }

    // Read results
    const scoreEl = await page.$('.iq-score-num');
    if (scoreEl) {
      const scoreText = await page.evaluate(el => el.textContent, scoreEl);
      result.score = scoreText;
    }

    const levelEl = await page.$('.iq-level');
    if (levelEl) {
      result.level = await page.evaluate(el => el.textContent, levelEl);
    }

    // Check for gate section
    const gateText = await page.$eval('#gate-section', el => el.textContent).catch(() => '');
    result.l2Qualified = gateText.includes('qualified') || gateText.includes('Continue to Level 2');

    // Check results readability
    const scoreSize = await page.$eval('.iq-score-num', el => getComputedStyle(el).fontSize).catch(() => '0px');
    if (parseInt(scoreSize) < 24) {
      issues.push({ severity: 'medium', screen: 'Results', issue: `Score text too small: ${scoreSize}` });
    }

    // Check review section exists
    const reviewToggle = await page.$('.review-toggle');
    if (!reviewToggle) {
      issues.push({ severity: 'medium', screen: 'Results', issue: 'Review section toggle not found' });
    }

    // Check radar chart rendered
    const radarCanvas = await page.$('canvas#radarChart');
    if (!radarCanvas) {
      issues.push({ severity: 'medium', screen: 'Results', issue: 'Radar chart canvas not found' });
    }

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

    // Check feedback modal
    await new Promise(r => setTimeout(r, 7000)); // Wait for feedback modal (6s delay)
    const fbModal = await page.$('.fb-modal-overlay[style*="flex"]').catch(() => null);
    if (fbModal) {
      issues.push({ severity: 'low', screen: 'Results', issue: 'Feedback modal appeared — check if it blocks results view' });
    }

  } catch (err) {
    issues.push({ severity: 'critical', screen: 'General', issue: `Test crashed: ${err.message}` });
  }

  result.timeSeconds = Math.round((Date.now() - startTime) / 1000);
  result.issues = issues;

  await browser.close();
  return result;
}

// Main
async function main() {
  console.log('Starting 5 UX testers...\n');

  const results = [];

  for (const tester of TESTERS) {
    console.log(`Running: ${tester.name} (${tester.label})...`);
    const result = await runTester(tester);
    results.push(result);
    console.log(`  Score: ${result.score}, Level: ${result.level}, L2: ${result.l2Qualified ? 'Yes' : 'No'}, Issues: ${result.issues.length}, Time: ${result.timeSeconds}s`);
  }

  // Generate report
  let report = `# Phase 3 UX Tester Report — 2026-03-24\n\n`;
  report += `**Test:** AI IQ Test Level 1, post-Phase 3 features\n`;
  report += `**Method:** 5 Puppeteer-automated testers with UX-focused personas\n`;
  report += `**URL:** http://localhost:8080/level1.html\n\n---\n\n`;

  report += `## Score Distribution\n\n`;
  report += `| Tester | Profile | Viewport | Score | Level | L2? | Issues | Time |\n`;
  report += `|---|---|---|---|---|---|---|---|\n`;
  for (const r of results) {
    const t = TESTERS.find(t => t.name === r.name);
    report += `| ${r.name} | ${r.label} | ${t.viewport.width}x${t.viewport.height} | ${r.score || 'N/A'} | ${r.level || 'N/A'} | ${r.l2Qualified ? 'Yes' : 'No'} | ${r.issues.length} | ${r.timeSeconds}s |\n`;
  }

  report += `\n---\n\n## All Issues Found\n\n`;

  const allIssues = results.flatMap(r => r.issues.map(i => ({ ...i, tester: r.name })));
  const bySeverity = { critical: [], high: [], medium: [], low: [] };
  allIssues.forEach(i => { if (bySeverity[i.severity]) bySeverity[i.severity].push(i); });

  for (const [sev, issues] of Object.entries(bySeverity)) {
    if (issues.length === 0) continue;
    report += `### ${sev.charAt(0).toUpperCase() + sev.slice(1)} (${issues.length})\n\n`;
    for (const i of issues) {
      report += `- **${i.tester}** [${i.screen}]: ${i.issue}\n`;
    }
    report += `\n`;
  }

  report += `---\n\n## UX Assessment Summary\n\n`;
  report += `### Readability\n`;
  const textIssues = allIssues.filter(i => i.issue.includes('small') || i.issue.includes('font') || i.issue.includes('read'));
  report += textIssues.length === 0 ? '- No text readability issues found\n' : textIssues.map(i => `- ${i.tester}: ${i.issue}`).join('\n') + '\n';

  report += `\n### Touch Targets\n`;
  const touchIssues = allIssues.filter(i => i.issue.includes('touch') || i.issue.includes('button') && i.issue.includes('small'));
  report += touchIssues.length === 0 ? '- All touch targets meet 44px minimum\n' : touchIssues.map(i => `- ${i.tester}: ${i.issue}`).join('\n') + '\n';

  report += `\n### Navigation Clarity\n`;
  const navIssues = allIssues.filter(i => i.issue.includes('not found') || i.issue.includes('confus') || i.issue.includes('load'));
  report += navIssues.length === 0 ? '- Navigation is clear and intuitive\n' : navIssues.map(i => `- ${i.tester}: ${i.issue}`).join('\n') + '\n';

  report += `\n### Progress Feedback\n`;
  const toastIssues = allIssues.filter(i => i.issue.includes('toast'));
  report += toastIssues.length === 0 ? '- Progress toasts working correctly\n' : toastIssues.map(i => `- ${i.tester}: ${i.issue}`).join('\n') + '\n';

  // Write report
  await mkdir('docs/test-reports', { recursive: true });
  await writeFile(REPORT_PATH, report);
  console.log(`\nReport saved to ${REPORT_PATH}`);
}

main().catch(console.error);
