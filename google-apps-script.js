/**
 * AI IQ Test — Google Apps Script
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (this will be your data store)
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire file into Code.gs (replace any existing code)
 * 4. Click "Deploy" → "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy" and copy the URL
 * 9. Paste that URL into index.html (replace YOUR_GOOGLE_SCRIPT_URL)
 *
 * SHEETS AUTO-CREATED:
 *   "Responses"  — all individual submissions with per-question scores
 *   "Summary"    — auto-updated aggregate stats (N, means, medians, SD per dimension)
 *   "Rubric"     — scoring reference (auto-generated once)
 *
 * SCORING:
 *   45 questions × 1-4 pts = 45-180
 *   Novice (45-79), Apprentice (80-114), Practitioner (115-149), Master (150-180)
 *
 * 8 DIMENSIONS:
 *   foundations, problemFraming, toolSelection, promptEngineering,
 *   criticalEvaluation, ethicsSafety, humanCollab, vibeCoding
 */

// ─── Column definitions ─────────────────────────────────────────────────
var RESPONSE_HEADERS = [
  'participant_id', 'timestamp', 'date', 'ai_experience',
  'total_score', 'level',
  'dim_foundations', 'dim_problemFraming', 'dim_toolSelection',
  'dim_promptEngineering', 'dim_criticalEvaluation', 'dim_ethicsSafety',
  'dim_humanCollab', 'dim_vibeCoding',
  // Per-question scores (45 questions)
  'f01_score', 'f01_choice', 'f02_score', 'f02_choice', 'f03_score', 'f03_choice',
  'f04_score', 'f04_choice', 'f05_score', 'f05_choice',
  'p01_score', 'p01_choice', 'p02_score', 'p02_choice', 'p03_score', 'p03_choice',
  'p04_score', 'p04_choice', 'p05_score', 'p05_choice',
  't01_score', 't01_choice', 't02_score', 't02_choice', 't03_score', 't03_choice',
  't04_score', 't04_choice', 't05_score', 't05_choice',
  'e01_score', 'e01_choice', 'e02_score', 'e02_choice', 'e03_score', 'e03_choice',
  'e04_score', 'e04_choice', 'e05_score', 'e05_choice',
  'c01_score', 'c01_choice', 'c02_score', 'c02_choice', 'c03_score', 'c03_choice',
  'c04_score', 'c04_choice', 'c05_score', 'c05_choice',
  's01_score', 's01_choice', 's02_score', 's02_choice', 's03_score', 's03_choice',
  's04_score', 's04_choice', 's05_score', 's05_choice',
  'h01_score', 'h01_choice', 'h02_score', 'h02_choice', 'h03_score', 'h03_choice',
  'h04_score', 'h04_choice', 'h05_score', 'h05_choice',
  'v01_score', 'v01_choice', 'v02_score', 'v02_choice', 'v03_score', 'v03_choice',
  'v04_score', 'v04_choice', 'v05_score', 'v05_choice',
  'x01_score', 'x01_choice', 'x02_score', 'x02_choice', 'x03_score', 'x03_choice',
  'x04_score', 'x04_choice', 'x05_score', 'x05_choice',
  'analysis'
];

// Question IDs in order (must match questions.json)
var QUESTION_IDS = [
  'f01','f02','f03','f04','f05',
  'p01','p02','p03','p04','p05',
  't01','t02','t03','t04','t05',
  'e01','e02','e03','e04','e05',
  'c01','c02','c03','c04','c05',
  's01','s02','s03','s04','s05',
  'h01','h02','h03','h04','h05',
  'v01','v02','v03','v04','v05',
  'x01','x02','x03','x04','x05'
];

// ─── Extract date from ISO timestamp ─────────────────────────────────────
function extractDate(isoString) {
  if (!isoString) return '';
  return String(isoString).substring(0, 10);
}

// ─── POST handler ───────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var date = extractDate(data.timestamp);

    var sheet = getOrCreateSheet(ss, 'Responses', RESPONSE_HEADERS);

    // Build row
    var row = [
      data.participant_id,
      data.timestamp,
      date,
      data.ai_experience || '',
      data.total_score,
      data.level
    ];

    // Dimension scores
    var dims = ['foundations','problemFraming','toolSelection','promptEngineering',
                'criticalEvaluation','ethicsSafety','humanCollab','vibeCoding'];
    dims.forEach(function(d) {
      row.push(data['dim_' + d] || 0);
    });

    // Per-question scores and choices
    QUESTION_IDS.forEach(function(qid) {
      row.push(data[qid + '_score'] || 0);
      row.push(data[qid + '_choice'] || '');
    });

    // Analysis text
    row.push(data.analysis || '');

    sheet.appendRow(row);

    // Update summary stats
    updateSummary(ss);

    // Ensure rubric exists
    ensureRubricSheet(ss);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── GET handler (health check) ─────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'AI IQ Test endpoint is active. Use POST to submit data.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Sheet helpers ──────────────────────────────────────────────────────
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ─── Summary statistics ─────────────────────────────────────────────────
function updateSummary(ss) {
  var respSheet = ss.getSheetByName('Responses');
  if (!respSheet || respSheet.getLastRow() < 2) return;

  var summarySheet = ss.getSheetByName('Summary');
  if (!summarySheet) {
    summarySheet = ss.insertSheet('Summary');
  } else {
    summarySheet.clearContents();
  }

  var r = respSheet.getLastRow();

  // Header
  summarySheet.appendRow(['AI IQ Test — Summary Statistics']);
  summarySheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  summarySheet.appendRow(['Auto-updated on each submission. N = ' + (r - 1)]);
  summarySheet.appendRow([]);

  // Overall scores
  summarySheet.appendRow(['OVERALL SCORES']);
  summarySheet.getRange(summarySheet.getLastRow(), 1).setFontWeight('bold');
  summarySheet.appendRow(['Metric', 'Value']);
  summarySheet.getRange(summarySheet.getLastRow(), 1, 1, 2).setFontWeight('bold');
  summarySheet.appendRow(['Mean', '=AVERAGE(Responses!E2:E' + r + ')']);
  summarySheet.appendRow(['Median', '=MEDIAN(Responses!E2:E' + r + ')']);
  summarySheet.appendRow(['Std Dev', '=STDEV(Responses!E2:E' + r + ')']);
  summarySheet.appendRow(['Min', '=MIN(Responses!E2:E' + r + ')']);
  summarySheet.appendRow(['Max', '=MAX(Responses!E2:E' + r + ')']);
  summarySheet.appendRow([]);

  // Level distribution
  summarySheet.appendRow(['LEVEL DISTRIBUTION']);
  summarySheet.getRange(summarySheet.getLastRow(), 1).setFontWeight('bold');
  summarySheet.appendRow(['Level', 'Count', 'Percentage']);
  summarySheet.getRange(summarySheet.getLastRow(), 1, 1, 3).setFontWeight('bold');
  var levels = ['Novice', 'Apprentice', 'Practitioner', 'Master'];
  levels.forEach(function(lev) {
    summarySheet.appendRow([
      lev,
      '=COUNTIF(Responses!F2:F' + r + ',"*' + lev + '*")',
      '=IFERROR(COUNTIF(Responses!F2:F' + r + ',"*' + lev + '*")/' + (r - 1) + ',0)'
    ]);
  });
  summarySheet.appendRow([]);

  // Per-dimension stats
  summarySheet.appendRow(['DIMENSION SCORES']);
  summarySheet.getRange(summarySheet.getLastRow(), 1).setFontWeight('bold');
  summarySheet.appendRow(['Dimension', 'Mean', 'Median', 'Std Dev', 'Min', 'Max']);
  summarySheet.getRange(summarySheet.getLastRow(), 1, 1, 6).setFontWeight('bold');

  // Columns G through N are dim scores (cols 7-14)
  var dimNames = ['Foundations', 'Problem Framing', 'Tool Selection', 'Prompt Engineering',
                  'Critical Evaluation', 'Ethics & Safety', 'Human Collaboration', 'Vibe Coding'];
  var dimCols = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  for (var i = 0; i < dimNames.length; i++) {
    var col = dimCols[i];
    summarySheet.appendRow([
      dimNames[i],
      '=AVERAGE(Responses!' + col + '2:' + col + r + ')',
      '=MEDIAN(Responses!' + col + '2:' + col + r + ')',
      '=STDEV(Responses!' + col + '2:' + col + r + ')',
      '=MIN(Responses!' + col + '2:' + col + r + ')',
      '=MAX(Responses!' + col + '2:' + col + r + ')'
    ]);
  }
  summarySheet.appendRow([]);

  // AI experience breakdown
  summarySheet.appendRow(['SCORES BY AI EXPERIENCE']);
  summarySheet.getRange(summarySheet.getLastRow(), 1).setFontWeight('bold');
  summarySheet.appendRow(['Experience', 'N', 'Mean Score', 'Median Score']);
  summarySheet.getRange(summarySheet.getLastRow(), 1, 1, 4).setFontWeight('bold');
  var experiences = ['Never used AI', 'Tried it a few times', 'Use it monthly', 'Use it weekly', 'Use it daily', 'AI professional'];
  experiences.forEach(function(exp) {
    summarySheet.appendRow([
      exp,
      '=COUNTIF(Responses!D2:D' + r + ',"' + exp + '")',
      '=IFERROR(AVERAGEIF(Responses!D2:D' + r + ',"' + exp + '",Responses!E2:E' + r + '),"N/A")',
      '=IFERROR(MEDIAN(IF(Responses!D2:D' + r + '="' + exp + '",Responses!E2:E' + r + ')),"N/A")'
    ]);
  });

  summarySheet.setColumnWidth(1, 220);
  summarySheet.setColumnWidth(2, 120);
  summarySheet.setColumnWidth(3, 120);
  summarySheet.setColumnWidth(4, 120);
}

// ─── Rubric reference sheet ─────────────────────────────────────────────
function ensureRubricSheet(ss) {
  if (ss.getSheetByName('Rubric')) return;
  var sheet = ss.insertSheet('Rubric');

  sheet.appendRow(['AI IQ Test — Scoring Rubric']);
  sheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  sheet.appendRow([]);

  sheet.appendRow(['MASTERY LEVELS']);
  sheet.getRange(sheet.getLastRow(), 1).setFontWeight('bold');
  sheet.appendRow(['Score Range', 'Level', 'Description']);
  sheet.getRange(sheet.getLastRow(), 1, 1, 3).setFontWeight('bold');
  sheet.appendRow(['45-79', 'Novice', 'Limited AI understanding. Treats AI as magic. Needs foundational literacy.']);
  sheet.appendRow(['80-114', 'Apprentice', 'Basic awareness but gaps in practical skills. Learning to work with AI.']);
  sheet.appendRow(['115-149', 'Practitioner', 'Solid AI competence. Can work effectively with AI tools in most contexts.']);
  sheet.appendRow(['150-180', 'Master', 'Expert-level AI fluency. Understands limitations, optimizes workflows, leads AI adoption.']);
  sheet.appendRow([]);

  sheet.appendRow(['DIMENSIONS (8)']);
  sheet.getRange(sheet.getLastRow(), 1).setFontWeight('bold');
  sheet.appendRow(['Dimension', 'Questions', 'What it Measures']);
  sheet.getRange(sheet.getLastRow(), 1, 1, 3).setFontWeight('bold');
  sheet.appendRow(['AI Foundations', 'f01-f05, x01', 'Understanding how AI works, training, limitations']);
  sheet.appendRow(['Problem Framing', 'p01-p05', 'Breaking down tasks for AI, context management']);
  sheet.appendRow(['Tool Selection', 't01-t05, x04', 'Choosing the right AI tool for the job']);
  sheet.appendRow(['Prompt Engineering', 'e01-e05, x03', 'Writing effective prompts, iterating']);
  sheet.appendRow(['Critical Evaluation', 'c01-c05, x02', 'Verifying AI output, spotting hallucinations']);
  sheet.appendRow(['Ethics & Safety', 's01-s05', 'Data privacy, bias awareness, responsible use']);
  sheet.appendRow(['AI-Human Collaboration', 'h01-h05', 'Working with AI as a partner, not an oracle']);
  sheet.appendRow(['Vibe Coding & AI Creation', 'v01-v05, x05', 'Building with AI, deployment, debugging']);
  sheet.appendRow([]);

  sheet.appendRow(['SCORING']);
  sheet.getRange(sheet.getLastRow(), 1).setFontWeight('bold');
  sheet.appendRow(['Each question has 4 choices scored 1-4. Score 4 = expert-level AI literacy.']);
  sheet.appendRow(['Total: 45 questions x 4 max = 180 points.']);
  sheet.appendRow(['Some questions are "wisdom traps" where general professional instinct gives a suboptimal answer.']);

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 500);
}
