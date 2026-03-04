const SPREADSHEET_ID = '1aBrA024qHdyq-ly5aL7JHi61AfUvc8ZsRVgYMS6IvfE';
const SHEET_NAME     = 'Submissions';
const HEADERS        = ['Timestamp', 'Type', 'Name', 'Email', 'Source'];

function doPost(e) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Write headers on first use
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  const p = e.parameter || {};
  sheet.appendRow([
    p.timestamp || new Date().toISOString(),
    p.type      || '',
    p.name      || '',
    p.email     || '',
    p.source    || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: quick test — run manually in the editor to verify sheet access
function _test() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  Logger.log('Connected to sheet: ' + sheet.getName());
}