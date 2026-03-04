// admin email to receive notifications
const ADMIN_EMAIL = Session.getEffectiveUser().getEmail();
const SPREADSHEET_ID = '11uS02egal1cP3KYhcRoBJ_c3qsYqRWKMjwi_U7nwr9c';

// setup form endpoint
function doGet() {
  return ContentService
    .createTextOutput('Atlas Destinations — form endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// handle post request from form
function doPost(e) {
  const p = (e && e.parameter) ? e.parameter : {};

  // open sheet and set up headers
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Contact') || ss.insertSheet('Contact');
  const headers = ['Timestamp', 'Name', 'Email', 'Website of Interest', 'Message'];

  // write headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }

  // write submission to sheet
  sheet.appendRow([
    p.timestamp || new Date().toISOString(),
    p.name || '',
    p.email || '',
    p.domain || '',
    p.message || ''
  ]);

  // send email notification
  const emailBody = `new contact form submission:
  
name: ${p.name || ''}
email: ${p.email || ''}
website: ${p.domain || ''}
message: ${p.message || ''}`;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'new contact form submission',
    body: emailBody
  });

  // return success response
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// run manually to test
function _test() {
  doPost({
    parameter: {
      type: 'contact',
      name: 'Test User',
      email: 'test@example.com',
      domain: 'example.com',
      message: 'this is a test submission.',
      timestamp: new Date().toISOString()
    }
  });
  Logger.log('test row written — check the contact tab and email.');
}