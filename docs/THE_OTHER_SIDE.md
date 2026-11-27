# THE OTHER SIDE — Kanon Implementasi Web

> *You are in the same place. But you are not in the same reality.*

Dokumen ini adalah versi **kanon internal** untuk implementasi. Story base dari user dipakai apa adanya; yang ditambahkan di sini hanya keputusan produksi supaya bisa dibangun sebagai game web.

---

## 1. Keputusan produksi

| Hal | Keputusan | Alasan |
| --- | --- | --- |
| Platform | Next.js 15 + Supabase Realtime (web) | Sudah ada, bisa deploy Vercel, lintas device. |
| Bentuk | Point-and-click 2.5D: latar painterly + hotspot + panel puzzle | Bukan first-person 3D; tidak pseudoklaim setara Unreal. |
| Target durasi | 60–90 menit untuk first play | Web co-op; 3–5 jam terlalu berat untuk sesi online tanpa voice built-in. |
| Bab | 6 bab + prolog + ending | Sesuai masterplan. |
| Puzzle | 2–3 lapis per bab,Total 14 puzzle + 6 optional | Mencegah "satu klik selesai". |
| Nada | **Balanced**: misteri, horor, dan tragedi Elias–Evelyn seimbang | Default dari opsi section 17. |
| Horor | Psychological + supernatural, tanpa creature chase | Sesuai prinsip "tidak bergantung jumpscare". |
| Pemain | Semi-defined: nama diungkap di Bab IV, tanpa dialog panjang | Twist nama di dokumen 1958 tetap Works. |
| Nama pemain | **Nora** (A, 1958) dan **Caleb** (B, 1998) | Nama baru, bukan dari karakter kanon lain. |
| Ending | Mixed: Good, Bad, Alternative, Secret | Sesuai masterplan. |
| Visual | AI painterly, palet hangat untuk 1958, dingin desaturasi untuk 1998, merah hanya untuk gangguan mesin | Pilihan user. |
| Audio | Web Audio synth: drone, statis radio, jam, langkah kaki, reversed tones | Tanpa aset audio eksternal. |

---

## 2. Timeline rahasia (kanon)

1. **1949** — Elias Voss mulai meneliti memori dan kesadaran.
2. **1953** — Mnemosyne Machine berhasil merekam fragmen ingatan lewat suara, gambar, dan benda emosional.
3. **1956** — Evelyn sakit; Elias takut kehilangan putrinya.
4. **1958** — Evelyn meninggal karena kecelakaan. Elias merekonstruksi ingatannya dengan mesin.
5. **1958** — Mesin menghasilkan memori yang tidak pernah dimasukkan. **The Other** mulai muncul.
6. **1958** — Elias dan beberapa staf hilang; rumah ditutup.
7. **1974** — Pemeriksaan pemerintah; peralatan disegel.
8. **1998** — Dua surat tanpa pengirim dikirim. Nora dan Caleb datang. Mereka terbagi ke dua lapisan: rekonstruksi 1958 dan rumah fisik 1998.

**Apa The Other sebenarnya:** gabungan dari ingatan Elias tentang Evelyn yang terus ia ubah-ubah + fragmen memori staf lain. Ia punya kenangan tentang hidup yang tidak pernah dijalaninya. Ia ingin diingat, bukan membunuh.

**Twist akhir:** tidak ada yang mengirim surat. Mesin membuatnya otomatis. Kunci yang dikirim adalah dua komponen aktivasi. Nama Nora dan Caleb sudah tertulis di dokumen 1958. Tidak dijelaskan sepenuhnya — sengaja.

---

## 3. Struktur bab

| Bab | Judul | Fokus puzzle | Horor kunci |
| --- | --- | --- | --- |
| 0 | The Letter | Radio, dua kunci, konfirmasi dua sisi | Surat tanpa nama pengirim |
| 1 | The Arrival | Listrik A/B + jam tiga jarum 11:58 (A baca ukiran, B hitung gigi) | Anak di tangga; hanya bisa dilihat B lewat cermin |
| 2 | The House That Remembers | Foto keluarga 4 vs 3 wajah, tanggal kalender, kontradiksi buku harian | Orang di meja makan yang wajahnya menyerupai pasangan |
| 3 | The Little Girl | Dua melodi nina-bobo; pilih yang asli; pindahkan boneka sesuai coretan | Evelyn lewat radio; bayangan cermin terlalu tinggi |
| 4 | The Experiment | 3 panel analog A + diagram rusak B; pulihkan 3 rekaman | The Other meniru suara pemain lewat radio |
| 5 | The Imitation | Dua transkrip percakapan; uji privat "apa yang hanya kau tahu" | The Other tampil sebagai salah satu pemain |
| 6 | The Last Memory | Dua panel akhir; matikan / pertahankan / pisahkan | The Other sebagai Evelyn: *"Will you remember me?"* |

### Contoh puzzle berlapis

**Bab I — Entrance Clock**
- A: jam utuh dengan ukiran di belakang: *"when the third hand rests on the broken tooth"*; jarum jam macet di 11.
- B: jam sama, roda gigi copot; ia harus menghitung gigi yang patah (mis. 58) dari tiga fragmen dan menyusunnya.
- A memasukkan menit dari hitungan B. B harus menyambung kabel agar jam A dapat daya.
- Kesalahan bukan mengulang dari nol: jam mundur 7 menit dan B melihat retakan baru di dinding (flag konsekuensi).

**Bab III — The Lullaby**
- A: kotak musik 9 tuts, bisa memutar urutan.
- B: dua notasi; satu dari buku cerita Evelyn, satu dari kertas yang muncul kemudian.
- Buku cerita (A) berkata: *"Ia selalu berakhir di La, tidak pernah di Si."* Salah satu notasi berakhir di Si → itu tiruan.
- Setelah melodi benar, A melihat Evelyn di cermin, B melihat bayangan jauh lebih tinggi.

**Bab V — Two Versions of You**
- Tiap pemain dapat transkrip "percakapan mereka" yang berisi satu detail privat (mis. warna kunci, jumlah gigi jam, nama di foto).
- Satu transkrip adalah tiruan: detailnya hampir benar tapi satu yang salah.
- Sistem memberi pertanyaan privat unik ke tiap pemain; jawaban hanya diketahui pemiliknya. Membandingkan jawaban mengungkap siapa yang ditiru.
- Optional: rekaman tersembunyi membuka secret ending.

---

## 4. Ending

| Ending | Syarat | Adegan akhir |
| --- | --- | --- |
| A — The Last Goodbye | Matikan mesin + sudah dengar rekaman terakhir Elias | The Other sebagai Evelyn bertanya "Will you remember me?"; matahari terbit; foto tanpa Evelyn. |
| B — A House That Never Forgets | Pertahankan mesin | Pintu kembali ke ruang pertama; foto baru menampilkan Nora & Caleb bersama Voss. |
| C — One Must Remain | Pisahkan realitas; satu pemain memilih tetap | Yang keluar melihat rumah terbakar; yang tertinggal melihat rumah utuh. |
| Secret — The First Memory | Semua rekaman tersembunyi + semua puzzle optional | Anak di depan mesin: *"You came back."* Hitam. |

Ending dihitung dari `state.finale.choice` + `state.secret.recordings.length` + `state.secret.optional.length`.

---

## 5. Model state (RoomState v2)

```ts
{
  v: 2,
  createdAt, chapter: 0..7,
  players: { A?, B? },
  ready: { A?, B? },
  advance: { A?: number, B?: number }, // nomor bab yang dikonfirmasi; idempotent
  puzzles: {
    [id]: { A?: unknown, B?: unknown, solved: boolean, attempts: number }
  },
  flags: Record<string, boolean>,      // konsekuensi lintas realitas, mis. "ch1_crack"
  found: { A: string[], B: string[] }, // clue/journal collected
  secret: { recordings: string[], optional: string[] },
  radio: { fake: boolean, seenBy: Role[] },
  finale: { choice?: "shutdown" | "preserve" | "split", stay?: Role },
  knock: number
}
```

Patch tetap memakai RPC `room_set_path` per-path. Tidak ada penulisan state penuh.

### Aturan sinkronisasi
- Aksi di 1958 yang berubah ke 1998 ditulis ke `flags`.
- 1998 membaca `flags` untuk membuka perubahan visual/mekanis.
- 1958 tidak langsung melihat ending; ia melihat konsekuensi lewat `flags` di Bab V.
- Transisi bab memakai `advance[role] = chapter` (angka) agar dua klien tidak bisa double-advance.

---

## 6. Aset & UI

- `public/art/*.png` — latar painterly generatif: dua era per ruangan, potret, laboratorium, memory space, entitas, inti mesin, ending.
- Komponen `Scene` menampilkan latar + vignette + grain + hotspot/overlay.
- `PuzzleWidget` data-driven untuk tipe: `clock`, `order`, `code`, `switch`, `choice`, `sequence`, `verify`.
- Teks narasi dan clue disimpan bilingual di `lib/story.ts` (`{ id, en }`), bukan di dictionary UI.
- `lib/i18n.ts` hanya untuk label UI generik.

---

## 7. Roadmap implementasi

1. ✅ Backup v1 + kanon desain.
2. 🔄 Generate aset painterly (batch 1: dua era ruangan utama; batch 2: lab/entitas/finale).
3. ⬜ Tulis `lib/types.ts` v2 + `lib/story.ts` (6 bab, clue, puzzle, ending, journal bilingual).
4. ⬜ Mesin puzzle + `PuzzleWidget` + `Scene`.
5. ⬜ Ganti Landing/Lobby/HUD/RoomClient untuk identitas THE OTHER SIDE.
6. ⬜ Horor scripted + audio events + radio palsu.
7. ⬜ Build, tes dua tab, tes semua ending.
8. ⬜ Update README + deploy Vercel (butuh kredensial/user).

---

## 8. Yang sengaja tidak dijanjikan

- Tidak ada first-person 3D, tidak ada voice chat bawaan, tidak ada voice cloning.
- Tidak ada 3–5 jam durasi; ini adaptasi web yang padat.
- Beberapa misteri sengaja tidak dijawab (sesuai permintaan masterplan).
