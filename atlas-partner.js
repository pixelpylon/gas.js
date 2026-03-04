// admin email to receive notifications
const ADMIN_EMAIL = Session.getEffectiveUser().getEmail();
const SPREADSHEET_ID = '1aBrA024qHdyq-ly5aL7JHi61AfUvc8ZsRVgYMS6IvfE';
const SHEET_NAME = 'Submissions';
const HEADERS = ['Timestamp', 'Type', 'Name', 'Email', 'Source'];

// handle post request
function doPost(e) {
  // connect to spreadsheet
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // write headers on first use
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  // write submission to sheet
  const p = e.parameter || {};
  sheet.appendRow([
    p.timestamp || new Date().toISOString(),
    p.type || '',
    p.name || '',
    p.email || '',
    p.source || ''
  ]);

  // send email notification
  const emailBody = `new partner form submission:
  
type: ${p.type || ''}
name: ${p.name || ''}
email: ${p.email || ''}
source: ${p.source || ''}`;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'new partner form submission',
    body: emailBody
  });

  // return success response
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// optional: quick test — run manually in the editor to verify sheet access
function _test() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  Logger.log('connected to sheet: ' + sheet.getName());
}