/**
 * AI IQ Test — Google Apps Script
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script → paste this into Code.gs
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the URL → paste into index.html
 *
 * IMPORTANT: After ANY code changes, you must:
 *   Deploy → Manage deployments → Edit → Version: New version → Deploy
 */

// ─── POST handler ───────────────────────────────────────────────────────
function doPost(e) {
  try {
    var raw = '';

    // Try multiple ways to get the JSON payload
    // Form POST sends data as e.parameter.payload — try this FIRST
    if (e && e.parameter && e.parameter.payload) {
      raw = e.parameter.payload;
    } else if (e && e.parameters && e.parameters.payload) {
      raw = e.parameters.payload[0];
    } else if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }

    if (!raw) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: 'No data received', keys: e ? Object.keys(e) : 'no event' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var date = data.timestamp ? String(data.timestamp).substring(0, 10) : '';

    // Handle feedback submissions
    if (data.feedback_type) {
      var fbSheet = ss.getSheetByName('Feedback');
      if (!fbSheet) {
        fbSheet = ss.insertSheet('Feedback');
        fbSheet.appendRow(['participant_id', 'participant_name', 'timestamp', 'feedback_type', 'feedback_rating', 'feedback_comment', 'test_mode']);
        fbSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
        fbSheet.setFrozenRows(1);
      }
      fbSheet.appendRow([
        data.participant_id || '',
        data.participant_name || '',
        data.timestamp || '',
        data.feedback_type || '',
        data.feedback_rating || '',
        data.feedback_comment || '',
        data.test_mode || ''
      ]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', type: 'feedback' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Route adaptive mode to its own sheet
    if (data.test_mode === 'adaptive') {
      return handleAdaptive(ss, data, date);
    }

    // Get or create Responses sheet (original full/quick mode)
    var sheet = ss.getSheetByName('Responses');
    if (!sheet) {
      sheet = ss.insertSheet('Responses');
      var headers = [
        'participant_id', 'participant_name', 'timestamp', 'date', 'ai_experience',
        'total_score', 'level', 'duration_seconds', 'test_mode', 'percentage',
        'dim_foundations', 'dim_problemFraming', 'dim_toolSelection',
        'dim_promptEngineering', 'dim_criticalEvaluation', 'dim_ethicsSafety',
        'dim_humanCollab', 'dim_vibeCoding'
      ];
      // Add per-question headers
      var qids = [
        'f02','f04','f06','f07','f08','x01',
        'p01','p02','p04','p05','p06','p07',
        't01','t02','t05','t06','t07','x04',
        'e01','e02','e03','e04','e05','x03',
        'c01','c02','c03','c04','c05','x02',
        's01','s02','s03','s04','s05','s06',
        'h01','h02','h03','h04','h05','h06',
        'v01','v02','v03','v04','v05','x05'
      ];
      qids.forEach(function(qid) {
        headers.push(qid + '_score');
        headers.push(qid + '_choice');
      });
      headers.push('analysis');
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Build row
    var row = [
      data.participant_id || '',
      data.participant_name || '',
      data.timestamp || '',
      date,
      data.ai_experience || '',
      data.total_score || 0,
      data.level || '',
      data.duration_seconds || 0,
      data.test_mode || 'full',
      data.percentage || 0
    ];

    // Dimension scores
    ['foundations','problemFraming','toolSelection','promptEngineering',
     'criticalEvaluation','ethicsSafety','humanCollab','vibeCoding'].forEach(function(d) {
      row.push(data['dim_' + d] || 0);
    });

    // Per-question scores and choices
    ['f02','f04','f06','f07','f08','x01',
     'p01','p02','p04','p05','p06','p07',
     't01','t02','t05','t06','t07','x04',
     'e01','e02','e03','e04','e05','x03',
     'c01','c02','c03','c04','c05','x02',
     's01','s02','s03','s04','s05','s06',
     'h01','h02','h03','h04','h05','h06',
     'v01','v02','v03','v04','v05','x05'].forEach(function(qid) {
      row.push(data[qid + '_score'] || 0);
      row.push(data[qid + '_choice'] || '');
    });

    row.push(data.analysis || '');

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', id: data.participant_id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Adaptive Mode handler ──────────────────────────────────────────────
function handleAdaptive(ss, data, date) {
  var sheet = ss.getSheetByName('Adaptive');
  if (!sheet) {
    sheet = ss.insertSheet('Adaptive');
    var headers = [
      'participant_id', 'participant_name', 'timestamp', 'date', 'ai_experience',
      'test_mode', 'level', 'total_score', 'percentage', 'result_level',
      'duration_seconds',
      'dim_foundations', 'dim_problemFraming', 'dim_toolSelection',
      'dim_promptEngineering', 'dim_criticalEvaluation', 'dim_ethicsSafety',
      'dim_humanCollab', 'dim_vibeCoding',
      // Boss challenge fields (L3 only)
      'boss_scenario', 'boss_planning_rating', 'boss_execution_rating',
      'boss_reflection_rating', 'boss_result',
      // Flexible per-question data (JSON blob)
      'question_data'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Collect per-question data into a JSON blob instead of fixed columns
  // (adaptive mode has variable questions per session)
  var questionData = {};
  var skipKeys = {
    'participant_id':1, 'participant_name':1, 'timestamp':1, 'ai_experience':1,
    'test_mode':1, 'level':1, 'total_score':1, 'percentage':1, 'result_level':1,
    'duration_seconds':1, 'boss_scenario':1, 'boss_planning_rating':1,
    'boss_execution_rating':1, 'boss_reflection_rating':1, 'boss_result':1
  };
  var dimKeys = {};
  ['foundations','problemFraming','toolSelection','promptEngineering',
   'criticalEvaluation','ethicsSafety','humanCollab','vibeCoding'].forEach(function(d) {
    dimKeys['dim_' + d] = 1;
  });
  for (var key in data) {
    if (!skipKeys[key] && !dimKeys[key] && key !== 'timestamp') {
      questionData[key] = data[key];
    }
  }

  var row = [
    data.participant_id || '',
    data.participant_name || '',
    data.timestamp || '',
    date,
    data.ai_experience || '',
    data.test_mode || 'adaptive',
    data.level || '',
    data.total_score || 0,
    data.percentage || 0,
    data.result_level || '',
    data.duration_seconds || 0
  ];

  // Dimension scores
  ['foundations','problemFraming','toolSelection','promptEngineering',
   'criticalEvaluation','ethicsSafety','humanCollab','vibeCoding'].forEach(function(d) {
    row.push(data['dim_' + d] || 0);
  });

  // Boss challenge fields
  row.push(data.boss_scenario || '');
  row.push(data.boss_planning_rating || '');
  row.push(data.boss_execution_rating || '');
  row.push(data.boss_reflection_rating || '');
  row.push(data.boss_result || '');

  // Per-question data as JSON blob
  row.push(JSON.stringify(questionData));

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', type: 'adaptive', level: data.level, id: data.participant_id }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── GET handler (health check + test) ──────────────────────────────────
function doGet(e) {
  // If ?test=1, insert a test row
  if (e && e.parameter && e.parameter.test === '1') {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName('Responses');
      if (!sheet) {
        // Create with same full headers as doPost
        sheet = ss.insertSheet('Responses');
        var headers = [
          'participant_id', 'participant_name', 'timestamp', 'date', 'ai_experience',
          'total_score', 'level', 'duration_seconds', 'test_mode', 'percentage',
          'dim_foundations', 'dim_problemFraming', 'dim_toolSelection',
          'dim_promptEngineering', 'dim_criticalEvaluation', 'dim_ethicsSafety',
          'dim_humanCollab', 'dim_vibeCoding'
        ];
        var qids = [
          'f02','f04','f06','f07','f08','x01',
          'p01','p02','p04','p05','p06','p07',
          't01','t02','t05','t06','t07','x04',
          'e01','e02','e03','e04','e05','x03',
          'c01','c02','c03','c04','c05','x02',
          's01','s02','s03','s04','s05','s06',
          'h01','h02','h03','h04','h05','h06',
          'v01','v02','v03','v04','v05','x05'
        ];
        qids.forEach(function(qid) { headers.push(qid + '_score'); headers.push(qid + '_choice'); });
        headers.push('analysis');
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
      sheet.appendRow(['GET_TEST', '', new Date().toISOString(), '', 'test', 0, 'test', 0]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', message: 'Test row added!' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'AI IQ Test endpoint is active. Use POST to submit data. Add ?test=1 to insert a test row.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
