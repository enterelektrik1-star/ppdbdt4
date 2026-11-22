const form = document.getElementById("registration-form");
const button = document.getElementById("submit-button");
const message = document.getElementById("form-message");
const successPanel = document.getElementById("success-panel");
const registrationNumber = document.getElementById("registration-number");
document.getElementById("year").textContent = new Date().getFullYear();

// Batasi tanggal lahir agar tidak berada di masa depan.
document.getElementById("birthDate").max = new Date().toISOString().split("T")[0];

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `form-message ${type}`;
}
function clearMessage() {
  message.textContent = "";
  message.className = "form-message";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());
  button.disabled = true;
  button.querySelector("span:first-child").textContent = "Mengirim pendaftaran...";
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Pendaftaran belum berhasil. Silakan coba kembali.");
    }
    registrationNumber.textContent = result.registrationId;
    form.hidden = true;
    document.querySelector(".form-heading").hidden = true;
    successPanel.hidden = false;
    window.scrollTo({ top: document.querySelector(".form-card").offsetTop - 20, behavior: "smooth" });
  } catch (error) {
    showMessage(error.message || "Terjadi kendala koneksi. Periksa internet lalu coba kembali.");
  } finally {
    button.disabled = false;
    button.querySelector("span:first-child").textContent = "Kirim formulir pendaftaran";
  }
});

document.getElementById("copy-button").addEventListener("click", async () => {
  const value = registrationNumber.textContent;
  try {
    await navigator.clipboard.writeText(value);
    document.getElementById("copy-button").querySelector("span:first-child").textContent = "Berhasil disalin!";
  } catch {
    showMessage("Salin nomor registrasi secara manual: " + value, "info");
  }
});
document.getElementById("new-registration").addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  document.querySelector(".form-heading").hidden = false;
  successPanel.hidden = true;
  clearMessage();
  document.getElementById("copy-button").querySelector("span:first-child").textContent = "Salin nomor registrasi";
});
