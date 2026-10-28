---
name: portfolio-design
description: Gunakan saat membuat, mengubah, atau meninjau UI apa pun di proyek Portfolio Rijal (index.html, login.html, cms.html, css/site.css, css/admin.css, js/render.js, js/main.js) agar tampilan tetap konsisten dengan sistem desain editorial minimalis. Berlaku untuk section baru, komponen, halaman, warna, font, dan animasi.
---

# Portfolio Design — aturan konsistensi

Sumber kebenaran: **`DESIGN.md`** di root proyek. Baca file itu dulu sebelum menulis UI.

## Ringkasan wajib

- **Gaya:** editorial minimalis. Tipografi besar, ruang napas, garis tipis `1px`, satu aksen. Bukan kartu berbayangan atau gradient.
- **Font:** Instrument Serif (judul, angka) + Geist (teks, UI). Tidak ada font lain.
- **Warna:** hanya lewat token `var(--bg|ink|ink-2|ink-3|rule|fill|accent|brand|on-brand|inv-*)`. Satu aksen (hijau sage). Tidak menulis hex baru. Tema terang dan gelap harus sama-sama jalan.
- **Bentuk:** gambar radius 2px, tombol/chip/stiker pil (999px). Tidak ada kartu 8–16px.
- **Layout:** daftar baris bergaris untuk koleksi, judul section serif besar, nomor section lewat CSS counter, hover menggeser isi.
- **Animasi:** GSAP, bermakna (mask reveal, fade-up kecil, clip-path gambar, scrub). Wajib dimatikan di `prefers-reduced-motion`.
- **Halaman admin:** pakai `css/admin.css` setelah `style.css`; token lama dipetakan ke palet yang sama.
- **Hindari:** gradient, glow, ikon dalam kotak berwarna, tiga kartu identik, emoji hiasan, teks klise.

## Alur kerja

1. Baca `DESIGN.md` (token, komponen, kontrak class).
2. Cari komponen yang sudah ada dan perluas, jangan membuat gaya baru yang bersaing.
3. Tulis CSS di `css/site.css` (publik) atau `css/admin.css` (admin). Markup di `js/render.js`, animasi di `js/main.js`.
4. Uji tema terang + gelap, lebar 375px dan desktop, dan reduced-motion.
5. Jika menambah token atau komponen baru, **perbarui `DESIGN.md`** pada perubahan yang sama.
