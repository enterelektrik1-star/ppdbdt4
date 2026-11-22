# PPDB Darut Taqwa 4

Aplikasi pendaftaran santri baru berbasis:
- Frontend: HTML, CSS, JavaScript
- Database: Google Sheets
- Backend database: Google Apps Script
- API proxy: Cloudflare Pages Functions
- Hosting/deployment: GitHub + Cloudflare Pages

## Fitur formulir
- Nama lengkap calon santri
- Tempat dan tanggal lahir
- Jenis kelamin
- Asal sekolah
- Pilihan kelas/jenjang
- Nama orang tua/wali
- Nomor WhatsApp
- Email (opsional)
- Alamat lengkap
- Catatan tambahan (opsional)
- Nomor registrasi otomatis dengan format `DT4-YYYYMMDD-XXXXXX`

## A. Menyiapkan Google Spreadsheet

1. Buka https://sheets.google.com dan buat spreadsheet baru, misalnya `Database PPDB Darut Taqwa 4`.
2. Salin ID spreadsheet dari URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Buka **Extensions → Apps Script**.
4. Hapus kode awal, lalu salin seluruh isi file `google-apps-script/Code.gs`.
5. Ganti `GANTI_DENGAN_ID_SPREADSHEET_ANDA` dengan ID spreadsheet milik Anda.
6. Pada **Project Settings**, atur zona waktu menjadi `Asia/Jakarta`.
7. Klik **Deploy → New deployment**.
8. Pilih jenis **Web app**.
9. Pilih **Execute as: Me** dan **Who has access: Anyone**.
10. Klik **Deploy**, berikan izin yang diminta, lalu salin URL Web App yang berakhiran `/exec`.

Sheet `Pendaftar` dan baris judul kolom akan dibuat otomatis saat pendaftaran pertama berhasil.

## B. Upload source code ke GitHub

1. Ekstrak ZIP ini di komputer.
2. Buka https://github.com/new lalu buat repository baru, misalnya `ppdb-darut-taqwa-4`.
3. Upload seluruh isi folder project ke root repository. Pastikan `index.html`, `assets`, `functions`, dan `google-apps-script` berada langsung di root repository, bukan di dalam folder bersarang.
4. Commit perubahan.

## C. Deploy ke Cloudflare Pages

1. Masuk ke https://dash.cloudflare.com.
2. Pilih **Workers & Pages → Create → Pages → Connect to Git** (label menu dapat berubah).
3. Hubungkan akun GitHub dan pilih repository `ppdb-darut-taqwa-4`.
4. Framework preset: **None**.
5. Build command: kosongkan.
6. Build output directory: `/` atau `.` (root repository).
7. Simpan dan deploy. Tunggu hingga deployment selesai dan URL `*.pages.dev` muncul.

## D. Hubungkan Cloudflare ke Google Sheets

1. Buka project Pages di dashboard Cloudflare.
2. Masuk ke **Settings → Variables and Secrets**.
3. Tambahkan variable:
   - Name: `APPS_SCRIPT_URL`
   - Value: URL Google Apps Script Web App yang berakhiran `/exec`
4. Simpan. Lakukan redeploy agar konfigurasi environment aktif pada deployment.
5. Buka URL Pages untuk menguji formulir.

Alur data: browser → `/api/register` (Cloudflare Pages Function) → Google Apps Script → Google Spreadsheet. URL Apps Script disimpan sebagai environment variable, bukan di kode browser.

## E. Uji sebelum dibagikan

1. Isi formulir dengan data uji yang bukan data pribadi orang lain.
2. Kirim dan pastikan halaman menampilkan nomor registrasi berformat `DT4-...`.
3. Periksa Google Spreadsheet, pastikan data masuk ke tab `Pendaftar`.
4. Coba juga validasi kolom wajib dan format email (jika email diisi).
5. Pastikan panitia dapat membuka spreadsheet dengan akun Google yang berwenang.

## F. Penyesuaian sebelum PPDB dibuka

- Periksa nama lembaga dan ejaan resmi pada `index.html`.
- Sesuaikan daftar pilihan kelas pada `<select id="classChoice">` di `index.html`.
- Sesuaikan isi kebijakan privasi, jadwal PPDB, biaya, dan kontak panitia sesuai ketentuan pesantren.
- Jika menambah/mengubah kolom formulir, perbarui validasi di `functions/api/register.js` dan `google-apps-script/Code.gs`.
- Setelah perubahan, push/commit ke GitHub. Cloudflare Pages akan otomatis deploy jika auto-deploy diaktifkan.

## Keamanan dan catatan penting

- Jangan menyimpan password, token, atau kredensial Google di frontend atau repository.
- Apps Script Web App perlu dapat diakses oleh Cloudflare (`Anyone`) agar endpoint publik dapat meneruskan data. Spreadsheet tetap dapat dibatasi hanya kepada pengelola.
- Endpoint pendaftaran dapat menerima kiriman publik. Sebelum dipakai secara luas, tambahkan proteksi spam/rate limiting atau CAPTCHA yang diverifikasi di server.
- Template ini belum memiliki login admin, unggah dokumen, pembayaran, atau halaman cek status. Panitia mengelola data melalui Google Sheets.
- Data tanggal lahir, alamat, dan nomor WhatsApp termasuk data pribadi. Batasi akses, tetapkan masa penyimpanan, dan berikan pemberitahuan privasi yang sesuai sebelum formulir dipublikasikan.
