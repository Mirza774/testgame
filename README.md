# THE OTHER SIDE

> *You are in the same place. But you are not in the same reality.*

Misteri horor psikologis co-op untuk **dua pemain**. Nora berada di rekonstruksi memori tahun **1958**; Caleb berada di rumah fisik tahun **1998**. Mereka berbagi tempat yang sama, bukan realitas yang sama. Satu-satunya jembatan adalah radio yang berderak — dan voice chat-mu sendiri.

Ini adalah **adaptasi web point-and-click 2.5D** dari story masterplan yang kamu berikan, bukan klaim setara UE5/Unity first-person 3D. Fokusnya: puzzle berlapis, konsekuensi lintas-waktu, dan ketidakpercayaan.

- 6 bab + prolog + finale + 4 ending (termasuk secret).
- 15 puzzle berlapis yang **wajib** melibatkan kedua pemain, plus 8 penemuan tersembunyi (5 rekaman + 3 detail tambahan).
- Konsekuensi nyata: salah menjawab dua kali di Bab I membuat retakan permanen di sisi 1998; kebohongan radio di Bab IV memicu peniruan di Bab V.
- ID / EN toggle kapan saja tanpa mengubah state.
- Supabase Realtime untuk lintas device; fallback lokal `localStorage` + `BroadcastChannel` untuk dua tab.
- Latar painterly AI di `public/art/*.jpg` + overlay interaktif dan audio Web Audio (tanpa aset komersial).

Cerita, nama, dan puzzle orisinal. Tidak menyalin *The Past Within*, *Tick Tock*, *Unsolved Case*, *Parallel Experiment*, atau properti Rusty Lake.

---

## 1. Jalankan lokal

Butuh Node.js 20+.

```powershell
cd C:\Skills\rumah-cermin
npm.cmd install
npm.cmd run dev
```

Buka `http://localhost:3000`. Jika port 3000 dipakai proses lama, Next akan memakai `3001` — perhatikan URL di terminal.

Tanpa env Supabase, game masuk **mode lokal**:

1. Tab 1: **Buka pintu** → pilih **NORA · 1958**.
2. Salin kode 5 karakter, buka di tab 2 → pilih **CALEB · 1998**.
3. Keduanya tekan **Angkat telepon**.
4. Pakai voice chat di aplikasi lain untuk mendeskripsikan petunjuk.

> Di mode lokal peran disimpan di `sessionStorage` supaya dua tab bisa memilih sisi berbeda. Kalau tab baru mewarisi peran dari tab pembuka (perilaku `window.open`), hapus `rc:role:KODE` di `sessionStorage` tab itu lalu reload.

Build produksi:

```powershell
npm.cmd run build
npm.cmd run start
```

---

## 2. Supabase Realtime

1. Buat project di [supabase.com](https://supabase.com).
2. SQL Editor → New query → jalankan seluruh [`supabase/schema.sql`](supabase/schema.sql).
   Skrip ini membuat tabel `rooms`, RLS, RPC `room_set_path`, dan mendaftarkan tabel ke `supabase_realtime`.
3. Project Settings → API: salin `Project URL` dan `anon public` key.
4. Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

5. Restart dev server. Banner di landing harus berubah dari **LOKAL** ke **TERSAMBUNG**.

Cek publication:

```sql
select * from pg_publication_tables
where pubname = 'supabase_realtime' and tablename = 'rooms';
```

Harus ada satu baris.

---

## 3. Deploy Vercel

1. Push folder ini ke GitHub.
2. [vercel.com/new](https://vercel.com/new) → import repo, preset **Next.js**.
3. Tambahkan env untuk Production/Preview/Development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. `NEXT_PUBLIC_*` ditanam saat build, jadi env baru butuh **Redeploy**.

Atau via CLI:

```powershell
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod
```

Kirim kode 5 karakter ke pasangan; mereka bisa main dari jaringan berbeda.

---

## 4. Alur game

| Bab | Judul | Inti puzzle | Teror |
| --- | --- | --- | --- |
| 0 | Surat tanpa pengirim | Radio, kop surat, cap pos | Kalimat surat berubah setiap dibaca |
| I | Kedatangan | Kunci VO/58, jam tiga jarum, goresan vs anak tangga | Anak hanya muncul di cermin |
| II | Rumah yang Mengingat | Foto 4 vs 3 wajah, tanggal berlingkari, meja makan | Wajah keempat menatap dari foto tergores |
| III | Anak Kecil Itu | Nina-bobo La vs Si, pita boneka, urutan panah | Bayangan cermin terlalu tinggi |
| IV | Percobaan | Urutan tuas, tiga tahun rekaman, suara tiruan | Radio memakai suara pemain |
| V | Peniruan | Pertanyaan privat, vote transkrip, siapa yang dipercaya | Salah satu pemain ditiru |
| VI | Memori Terakhir | Matikan / pertahankan / pisahkan | *“Will you remember me?”* |

Aturan penting:

- Setiap stage hanya bisa diselesaikan kalau **A dan B** mengirim jawaban yang benar.
- Informasi sengaja tidak simetris. Jangan pernah memberi jawaban langsung — ceritakan apa yang terbaca.
- Tombol `?` muncul setelah 2 kali salah: itu bukan jawaban, cuma pengingat samar.
- Dua kali salah pada stage bertanda konsekuensi memicu perubahan permanen di realitas lain.

Ending:

| Ending | Syarat |
| --- | --- |
| The Last Goodbye | Keduanya memilih **Matikan** |
| A House That Never Forgets | Keduanya memilih **Pertahankan** |
| One Must Remain | Salah satu / keduanya memilih **Pisahkan** |
| The First Memory | Semua 5 rekaman + 3 detail tambahan diketemukan kedua pemain (secret mengalahkan pilihan lain) |

Tombol header:

| Tombol | Fungsi |
| --- | --- |
| Buku | Journal berisi semua petunjuk, progres rahasia, dan penemuan yang sudah cocok |
| Tangan | Ketuk dinding; pasangan dapat notifikasi + suara |
| Speaker | Mute / unmute |
| ID / EN | Ganti bahasa |

---

## 5. Struktur proyek

```
app/
  page.tsx                 Landing
  room/[code]/page.tsx     Room (async params Next 15)
  layout.tsx, globals.css
components/
  Landing, Lobby, WaitingRoom, RoomClient, Screens
  Game, Journal, Atmosphere, PainterlyScene
  chapters/                Prologue, ChapterView, ChapterSolved, Finale, Ending
  ui/                      Icon, LangToggle, CodeCard
public/art/               living, hall, portrait, child, lab, memory, core,
                          sunrise, letter, the-other, caretaker, radio,
                          ending-burning, ending-whole (.jpg)
lib/
  types.ts                 RoomState v2
  game.ts                  seed, kode room, normalisasi state lama, helper
  story.ts                 6 bab, 15 stage, hidden items, ending, journal (ID/EN)
  i18n.ts                  label UI ID/EN
  store.ts                 Supabase + fallback lokal
  useRoom.ts               fetch, subscribe, patch optimistis
  audio.ts                 drone, statis, bisikan, mimic, retakan, heartbeat
  supabase.ts              client (null kalau env kosong)
supabase/schema.sql        tabel, RLS, RPC, realtime
docs/THE_OTHER_SIDE.md     kanon desain & roadmap
```

### Model sinkronisasi

Satu room = satu baris `rooms.state` (jsonb). Setiap aksi mengirim **patch path**, bukan seluruh state:

```ts
patch(["puzzles", "arrival-clock", "A"], "11");
// -> rpc('room_set_path', {
//      p_id: 'Z73CB',
//      p_path: ['puzzles','arrival-clock','A'],
//      p_value: '11'
//    })
```

`room_set_path` memakai `jsonb_set`, jadi dua pemain yang mengubah path berbeda tidak saling menimpa. Realtime memakai `postgres_changes` dengan filter `id=eq.KODE`. Mode lokal menulis `localStorage` lalu Siaran `BroadcastChannel`.

Room dengan `v: 1` (versi lama) otomatis dinormalisasi oleh `normalizeState()` menjadi `v: 2`; puzzle lama tidak terbawa. Kode lama tetap bisa dipakai tetapi akan mulai dari prolog baru.

---

## 6. Keamanan & perawatan

- Tanpa akun. Kode room satu-satunya rahasia; RLS sengaja terbuka untuk `anon`. Jangan simpan data pribadi.
- 5 karakter dari 32 simbol ≈ 33 juta kombinasi. Untuk publik besar, tambahkan rate limit/auth.
- Bersihkan room lama berkala:

```sql
delete from public.rooms where created_at < now() - interval '7 days';
```

- Voice chat tidak disediakan. Gunakan WhatsApp/Discord/telepon.

---

## 7. Troubleshooting

| Gejala | Solusi |
| --- | --- |
| Internal Server Error di `localhost:3000` | Proses dev lama masih memakai port 3000. Pakai URL port 3001 dari terminal, atau hentikan PID lama. |
| Banner **LOKAL** | Env Supabase kosong / dev server belum di-restart. |
| Pasangan tidak dapat update | Tabel `rooms` belum di publication Realtime. Jalankan ulang `schema.sql`. |
| Tab baru jadi NORA juga | `sessionStorage` diwariskan saat `window.open`. Hapus `rc:role:KODE` di tab itu lalu reload. |
| `npm` diblokir PowerShell | Pakai `npm.cmd`. |
| Suara tidak keluar | Browser butuh interaksi pertama. Klik di mana saja, cek tombol speaker. |
| Build gagal karena modul lama | File art lama sudah dihapus; jangan mengembalikan `components/art/{FishArt,SafeArt,MirrorArt,...}`. |

---

## 8. Catatan produksi

- Target sesi first-play yang realistis untuk adaptasi web: **60–90 menit**, bukan 3–5 jam masterplan UE5.
- Tidak ada jumpscare. Ketegangan datang dari informasi yang timpang, perubahan lingkungan, konsekuensi, dan suara yang mungkin bukan pasanganmu.
- Beberapa misteri sengaja dibiarkan tidak terjawab, sesuai masterplan.
