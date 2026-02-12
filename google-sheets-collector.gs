/*
 * Exemple de Google Apps Script qui écrit les réponses dans une feuille Google Sheets.
 *
 * 1. Crée une feuille et note l'ID (present dans l'URL: https://docs.google.com/spreadsheets/d/ID/edit).
 * 2. Crée un projet Apps Script lié (Extensions → Apps Script).
 * 3. Colle ce script, remplace SHEET_ID et éventuellement SHEET_NAME.
 * 4. Déploie comme application web (Exécuter en tant que : Moi ; Qui a accès : Toute personne, même anonyme).
 * 5. Récupère l'URL du déploiement et colle-la dans config.txt comme collector_endpoint.
 */

// Ce script est prêt à écrire dans la feuille partagée fournie (si tu n'as pas de copie, crée-en une).
const SHEET_ID = '10v131_vrtgxOotywspDvjD1kZyqZ4LCslu9gCc8htjM';
const SHEET_NAME = 'Club Collect';

function ensureSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'OfferId', 'Periode', 'Mention', 'MentionType', 'IP']);
  }
  return sheet;
}

function doPost(e) {
  let spreadsheet;
  try {
    spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  } catch (err) {
    return jsonResponse({ accepted: false, message: 'Unable to open spreadsheet. Check SHEET_ID and permissions.' });
  }
  const sheet = ensureSheet(spreadsheet);

  let payload = {};
  try {
    payload = JSON.parse(e.postData.contents || '{}');
  } catch (err) {
    return jsonResponse({ accepted: false, message: 'invalid json' });
  }

  const row = [
    new Date().toISOString(),
    payload.offerId || '',
    payload.periode || '',
    payload.mention || 'non',
    payload.mentionType || '',
    payload.ip || ''
  ];

  sheet.appendRow(row);
  return jsonResponse({ accepted: true });
}

function doGet() {
  return jsonResponse({ accepted: true, message: 'Collector ready' });
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
