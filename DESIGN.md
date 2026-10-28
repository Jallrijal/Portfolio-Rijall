# DESIGN.md — Portfolio Rijal

Sistem desain untuk seluruh halaman: `index.html`, `login.html`, `cms.html`.
Semua UI baru **wajib** mengikuti dokumen ini agar tampilan konsisten.

Karakter: **editorial minimalis**. Tipografi besar sebagai elemen utama, banyak ruang napas, satu warna aksen, garis tipis sebagai pemisah, animasi halus yang bermakna. Bukan kartu-kartu bergradient.

## 1. File & tanggung jawab

| File | Fungsi |
|---|---|
| `css/site.css` | Satu-satunya stylesheet untuk `index.html`. Berisi token dan semua komponen. |
| `css/admin.css` | Skin untuk `login.html` dan `cms.html`. Memetakan token lama `style.css` ke palet baru. Dimuat **setelah** `style.css` dan style inline. |
| `css/style.css` | Warisan lama. Dipakai CMS untuk struktur dasar. Jangan dipakai untuk halaman baru. |
| `js/render.js` | Markup section. Class di sini adalah kontrak dengan CSS dan GSAP. |
| `js/main.js` | Interaksi dan animasi GSAP. |

Halaman baru: pakai `site.css` untuk halaman publik, `admin.css` (setelah `style.css`) untuk halaman admin.

## 2. Token

Semua warna lewat CSS variable. **Jangan menulis hex langsung di komponen.**

### Warna

| Token | Terang | Gelap | Pakai untuk |
|---|---|---|---|
| `--bg` | `#f3f0e9` | `#0d0d0c` | Latar halaman |
| `--ink` | `#111110` | `#f1eee6` | Teks utama, garis tegas |
| `--ink-2` | `#44433f` | `#b4b1a8` | Teks isi, deskripsi |
| `--ink-3` | `#75736c` | `#85827a` | Label, meta, placeholder |
| `--rule` | `#d9d5ca` | `#262623` | Garis pemisah tipis |
| `--fill` | `#e8e4d9` | `#171715` | Latar kotak gambar, hover baris |
| `--accent` / `--brand` | `#2f5d46` | `#8cc3a3` | Satu-satunya warna aksen (hijau sage) |
| `--on-brand` | `#f3f0e9` | `#0e1a13` | Teks di atas latar aksen |
| `--accent-ink` | `#f3f0e9` | `#0e1a13` | Teks di atas tombol aksen |
| `--inv-*` | kebalikan tema | kebalikan tema | Section kontras (Tools) |

Aturan warna:
- **Satu aksen saja.** Mengganti aksen = ubah `--accent`, `--brand`, `--on-brand`, `--accent-ink` di `site.css` dan padanannya di `admin.css`.
- Aksen dipakai sedikit: nomor section, link aktif, hover, blok warna besar (pita, Contact, panel login). Bukan untuk semua tombol.
- Tidak ada gradient, glow, bayangan tebal, atau blur dekoratif.
- Kedua tema (terang dan gelap) wajib bekerja. Tema disimpan di `localStorage['theme']`, default `light`, diterapkan lewat `data-theme` di `<html>`.

### Tipografi

| Peran | Font | Catatan |
|---|---|---|
| Display / judul | **Instrument Serif** (400, ada italic) | Judul besar, angka, nama, kutipan |
| Teks / UI | **Geist** (400, 500, 600) | Isi, label, tombol, navigasi |

Skala (`clamp`, fluid):

| Token | Ukuran | Pakai untuk |
|---|---|---|
| `--t-sm` | 13–14px | Label, meta, tombol |
| `--t-md` | 16–17px | Teks isi |
| `--t-lg` | 20–26px | Sub-judul, peran italic |
| `--t-xl` | 28–44px | Judul kartu, kalimat pembuka |
| `--t-2xl` | 44–104px | Judul section |
| `--t-hero` | 60–240px | Nama di hero saja |

Aturan:
- Judul pakai serif, `letter-spacing` negatif (`-0.02em` sampai `-0.035em`), `line-height` rapat (0.85–1.1).
- Label kecil pakai sans, huruf kapital, `letter-spacing: 0.08em`.
- Teks isi maksimal 40–60 karakter per baris (`max-width` dalam `ch`).
- Tidak menambah font ketiga.

### Spasi, radius, gerak

- Gutter: `--gutter` (`clamp(1.25rem, 4vw, 3.5rem)`). Lebar maksimum `--max: 90rem`.
- Jarak antar section: `clamp(5rem, 11vw, 10rem)`.
- Radius: gambar `2px`; tombol, chip, stiker `999px` (pil). Tidak ada sudut membulat sedang (8–16px) pada kartu.
- Easing standar: `--ease: cubic-bezier(0.22, 0.8, 0.2, 1)`. Durasi hover 0.3–0.5s, reveal 0.8–1.3s.

## 3. Prinsip tata letak

1. **Garis, bukan kartu.** Pisahkan konten dengan garis 1px (`--rule`) dan jarak. Kartu berbingkai dan berbayangan dihindari.
2. **Daftar baris** untuk koleksi (Tools, Experience, Contact): satu baris per item, garis di bawahnya, hover menggeser isi.
3. **Hierarki lewat ukuran.** Satu elemen sangat besar per layar, sisanya kecil. Jangan banyak ukuran menengah.
4. **Nomor section** otomatis lewat CSS counter (`01 /`, `(01)`). Jangan ditulis manual.
5. **Ritme warna:** section bergantian terang → kontras (Tools, `--inv-*`) → terang → aksen (Contact). Maksimal dua blok warna penuh.
6. **Hindari "AI slop":** ikon dalam kotak berwarna, deretan 3 kartu identik, gradient ungu/biru, glow, emoji sebagai hiasan, teks "Welcome to".
7. Gambar memakai placeholder (`picsum.photos`, `?grayscale`) sampai ada foto asli. Foto hero dibuat duotone (`background: var(--brand)` + `mix-blend-mode: multiply`).

## 4. Komponen

### Navbar
- `position: fixed`, transparan; solid + blur setelah scroll 40px; sembunyi saat scroll turun, muncul saat scroll naik.
- Link bernomor (`01`–`06`) lewat CSS counter, hover **teks bergulir** (struktur `.nav-label > span[data-text]`), link aktif berwarna aksen.
- Garis progres scroll di dasar navbar (`.nav-progress`, variabel `--progress`).
- Mobile (≤48rem): menu layar penuh, link serif besar, terbuka dengan `clip-path`.

### Tombol
- Pil. `.btn-primary` berlatar `--ink`, `.btn-secondary` hanya garis. Hover: warna aksen naik dari bawah (`::before` + `translateY`).
- Tombol utama dan navbar bersifat **magnetik** (GSAP, hanya perangkat dengan kursor).

### Hero
- Nama serif raksasa dengan `mix-blend-mode: difference` di atas foto duotone.
- Aksesori: badge berputar "OPEN FOR WORK", dua stiker miring, jam WIB, garis kolom latar.

### Pita (marquee)
- Dua pita miring bersilangan, arah berlawanan. Berhenti saat di-hover. Hormati `prefers-reduced-motion`.

### Baris Tools / Experience / Contact
- Garis atas `--ink`, garis antar baris `--rule`. Hover: isi bergeser ke kanan (`padding-left`), judul berubah warna aksen. Contact: latar aksen naik dari bawah.

### Projects
- Dua kolom selang-seling kiri/kanan. Kartu **menumpuk** (`position: sticky`) di layar lebar, menjadi statis di bawah 62rem.
- Nomor `01`, `02`... lewat CSS counter. Kursor kustom "Lihat" di atas gambar.

### Admin (login & CMS)
- Login: layar terbagi dua. Kiri blok aksen dengan tulisan serif besar, kanan form dengan input bergaris bawah.
- CMS: sidebar blok kontras (`--side-*`), menu aktif berbentuk pil beraksen, kartu hanya berbingkai tipis, tombol pil, judul panel serif.

## 5. Animasi (GSAP)

Prinsip: animasi **menjelaskan** (urutan masuk, hierarki), tidak sekadar hiasan.

| Efek | Dipakai pada |
|---|---|
| Teks naik dari balik topeng (`overflow: hidden`) | Nama hero (per huruf), judul section |
| Fade-up kecil (`y: 12–28`) | Teks pendukung, baris daftar (stagger 0.08) |
| Reveal gambar `clip-path: inset(100% 0 0 0)` → penuh + zoom-out | Gambar proyek, foto hero |
| Scrub mengikuti scroll | Paragraf pembuka About (kata demi kata), parallax foto |
| Count-up | Angka statistik |

Aturan:
- `once: true` untuk reveal; `clearProps` setelah selesai.
- Semua animasi dilewati bila `prefers-reduced-motion: reduce`. Konten harus tetap terbaca tanpa JS animasi.
- Animasi dipasang ulang di `initGsapAnimations()` setiap `portfolio:rendered` (konten dirender dari localStorage). Jangan menambah listener yang tidak bisa dibersihkan.

## 6. Kontrak class (jangan diubah sembarangan)

`render.js` menghasilkan markup; `site.css` dan `main.js` bergantung pada class ini: `.site-header`, `.nav-link`, `.nav-label`, `.hero-*`, `.spin-badge`, `.sticker`, `.bands`, `.marquee*`, `.about-*`, `.tool-card`, `.project-card`, `.timeline-item`, `.contact-item-card`, `.section-title`, `.section-header`. Mengubah nama = ubah CSS dan JS sekaligus.

## 7. Checklist sebelum menambah UI

- [ ] Hanya memakai token (`var(--…)`), tanpa hex baru.
- [ ] Font hanya Instrument Serif dan Geist.
- [ ] Bekerja di tema terang dan gelap.
- [ ] Rapi di lebar 375px (tanpa scroll horizontal).
- [ ] Fokus keyboard terlihat (`:focus-visible`), kontras teks cukup.
- [ ] Animasi mati saat `prefers-reduced-motion`.
- [ ] Tidak ada gradient, glow, kartu berbayangan, atau ikon dalam kotak berwarna.
- [ ] Tampak serasi bila dibandingkan dengan section yang sudah ada.
