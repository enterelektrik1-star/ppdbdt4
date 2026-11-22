export async function onRequestPost({ request, env }) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  try {
    if (!env.APPS_SCRIPT_URL) {
      return Response.json({ success: false, message: "Server PPDB belum dikonfigurasi. Hubungi panitia." }, { status: 500, headers });
    }
    const data = await request.json();
    const required = ["studentName", "birthPlace", "birthDate", "gender", "school", "classChoice", "parentName", "phone", "address"];
    for (const key of required) {
      if (!String(data[key] || "").trim()) {
        return Response.json({ success: false, message: "Mohon lengkapi semua kolom wajib." }, { status: 400, headers });
      }
    }
const email = String(data.email ?? "").trim();

if (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return Response.json({
    success: false,
    message: "Format email tidak valid. Periksa alamat email Anda."
  }, { status: 400, headers });
}

// Simpan email yang sudah dibersihkan dari spasi
data.email = email;
    
    const upstream = await fetch(env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "follow"
    });
    const result = await upstream.json();
    if (!upstream.ok || !result.success) {
      return Response.json({ success: false, message: result.message || "Database PPDB tidak dapat menyimpan data." }, { status: 502, headers });
    }
    return Response.json(result, { status: 200, headers });
  } catch (error) {
    return Response.json({ success: false, message: "Terjadi kesalahan pada server. Silakan coba kembali." }, { status: 500, headers });
  }
}
