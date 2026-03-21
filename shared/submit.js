// ─── Google Sheets Submission ────────────────────────────────────────────
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSnBFnM8Q29m7hoRbpHmhYo85_ZXkTR1qcp1n7Q_kXOLBzJClWw0qgHAyrrK017TVJPQ/exec';

function submitToSheets(payload) {
  // Always backup locally first
  const backupKey = 'ai_iq_' + (payload.test_mode || 'unknown') + '_' + (payload.participant_id || Date.now());
  try { localStorage.setItem(backupKey, JSON.stringify(payload)); } catch(e) {}

  // Use hidden iframe + form POST — most reliable method for cross-origin Apps Script
  // This avoids all CORS/redirect issues because the browser handles the form natively
  let iframe = document.getElementById('_submit_frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = '_submit_frame'; iframe.name = '_submit_frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  const form = document.createElement('form');
  form.method = 'POST'; form.action = GOOGLE_SCRIPT_URL;
  form.target = '_submit_frame'; form.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'hidden'; input.name = 'payload'; input.value = JSON.stringify(payload);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 2000);
  showToast('Results saved!');
  console.log('AI IQ data submitted via form POST');
}
