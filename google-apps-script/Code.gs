/*
 * PPDB DARUT TAQWA 4 - GOOGLE APPS SCRIPT
 * 1. Buat Google Spreadsheet, salin ID dari URL.
 * 2. Isi SPREADSHEET_ID di bawah.
 * 3. Deploy sebagai Web App: Execute as Me, Who has access: Anyone.
 */
const SPREADSHEET_ID = "GANTI_DENGAN_ID_SPREADSHEET_ANDA";
const SHEET_NAME = "Pendaftar";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const required = ["studentName", "birthPlace", "birthDate", "gender", "school", "classChoice", "parentName", "phone", "address"];
    for (const key of required) {
      if (!String(data[key] || "").trim()) return output({ success: false, message: "Data wajib belum lengkap." });
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(String(data.email))) {
      return output({ success: false, message: "Format email tidak valid." });
    }

    lock.waitLock(20000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        const headers = [
          "Waktu Pendaftaran", "Nomor Registrasi", "Nama Calon Santri", "Tempat Lahir",
          "Tanggal Lahir", "Jenis Kelamin", "Asal Sekolah", "Pilihan Kelas",
          "Nama Orang Tua/Wali", "Nomor WhatsApp", "Email", "Alamat", "Catatan", "Status"
        ];
        sheet.appendRow(headers);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#124b36").setFontColor("#ffffff");
      }

      const now = new Date();
      const datePart = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd");
      const registrationId = "DT4-" + datePart + "-" + Utilities.getUuid().slice(0, 6).toUpperCase();
      sheet.appendRow([
        now, safeCell(registrationId), safeCell(data.studentName), safeCell(data.birthPlace),
        safeCell(data.birthDate), safeCell(data.gender), safeCell(data.school), safeCell(data.classChoice),
        safeCell(data.parentName), safeCell(data.phone), safeCell(data.email || ""),
        safeCell(data.address), safeCell(data.notes || ""), "Menunggu verifikasi"
      ]);
      return output({ success: true, registrationId: registrationId });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return output({ success: false, message: "Gagal menyimpan data pendaftaran." });
  }
}

function safeCell(value) {
  const text = String(value == null ? "" : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function output(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
