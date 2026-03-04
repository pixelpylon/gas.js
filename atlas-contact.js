const SPREADSHEET_ID = '11uS02egal1cP3KYhcRoBJ_c3qsYqRWKMjwi_U7nwr9c';

function doGet() {
  return ContentService
    .createTextOutput('Atlas Destinations — form endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const p = (e && e.parameter) ? e.parameter : {};

  const ss      = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet   = ss.getSheetByName('Contact') || ss.insertSheet('Contact');
  const headers = ['Timestamp', 'Name', 'Email', 'Website of Interest', 'Message'];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  sheet.appendRow([
    p.timestamp || new Date().toISOString(),
    p.name      || '',
    p.email     || '',
    p.domain    || '',
    p.message   || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run manually in the editor to write a test row
function _test() {
  doPost({
    parameter: {
      type:      'contact',
      name:      'Test User',
      email:     'test@example.com',
      domain:    'example.com',
      message:   'This is a test submission.',
      timestamp: new Date().toISOString()
    }
  });
  Logger.log('Test row written — check the Contact tab.');
}