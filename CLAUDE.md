# CLAUDE.md

Portfolio statis (HTML, CSS, JS tanpa build) dengan halaman publik, login, dan CMS.

## Desain

Semua perubahan UI **wajib** mengikuti [DESIGN.md](./DESIGN.md): token warna, font
(Instrument Serif + Geist), komponen, animasi, dan checklist. Skill
`portfolio-design` di `.claude/skills/portfolio-design/` merangkum aturan yang sama.

- Halaman publik (`index.html`): `css/site.css`
- Login dan CMS: `css/style.css` lalu `css/admin.css`
- Markup section ada di `js/render.js`, animasi di `js/main.js`
- Jangan menulis hex warna baru; pakai token `var(--...)`
- Perbarui `DESIGN.md` bila menambah token atau komponen baru

## Menjalankan

Jangan membuka `index.html` langsung (`file://`); modul ES dan `fetch` diblokir browser.
Jalankan `jalankan.bat`, atau `python -m http.server 5000`, lalu buka http://localhost:5000.

## Data

Konten dibaca dari `data/seed.json` (tidak ada di Git) atau dari localStorage yang diisi lewat CMS.
