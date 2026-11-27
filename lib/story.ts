import type { FinalChoice, Lang, RoomState, Role } from "./types";

export interface Localized {
  id: string;
  en: string;
}

export function L(id: string, en: string): Localized {
  return { id, en };
}

export function say(value: Localized, lang: Lang): string {
  return value[lang];
}

function clean(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function answers(...values: string[]): string[] {
  return values.map(clean);
}

export interface Option {
  value: string;
  label: Localized;
}

export interface Stage {
  id: string;
  chapter: number;
  title: Localized;
  introA: Localized[];
  introB: Localized[];
  clueA: Localized;
  clueB: Localized;
  hintA?: Localized;
  hintB?: Localized;
  labelA: Localized;
  labelB: Localized;
  answerA: string[];
  answerB: string[];
  optionsA?: Option[];
  optionsB?: Option[];
  solved: Localized;
  consequence?: string;
}

export interface HiddenItem {
  id: string;
  chapter: number;
  kind: "recording" | "optional";
  labelA: Localized;
  labelB: Localized;
  revealA: Localized;
  revealB: Localized;
}

/* -------------------------------------------------------------------------- */
/*                                Chapters                                    */
/* -------------------------------------------------------------------------- */

export interface ChapterInfo {
  chapter: number;
  kicker: Localized;
  title: Localized;
  scene: string;
  paragraphsB: Localized[];
  paragraphsA: Localized[];
}

export function chapterInfo(chapter: number): ChapterInfo | null {
  const data: Record<number, ChapterInfo> = {
    1: {
      chapter: 1,
      kicker: L("BAB I", "CHAPTER I"),
      title: L("Kedatangan", "The Arrival"),
      scene: "living",
      paragraphsB: [
        L(
          "Rumah itu berdiri di halaman yang tidak pernah dipangkas. Cat mengelupas, tapi kaca jendela masih utuh â€” seolah api memilih untuk tidak menyentuhnya.",
          "The house stands in a yard that was never mowed. Paint peels away, but the window glass is intact â€” as if the fire chose not to touch it.",
        ),
        L(
          "Kau berdiri di ruang tamu 1998. Di lantai, dua surat tanpa nama pengirim. Keduanya ditujukan untukmu.",
          "You stand in the 1998 living room. On the floor, two letters with no sender's name. Both are addressed to you.",
        ),
      ],
      paragraphsA: [
        L(
          "Kau berdiri di ruang yang sama, tapi tahun 1958. Perapian masih menyala. Di luar, hujan belum mulai.",
          "You stand in the same room, but in 1958. The fireplace is still lit. Outside, the rain has not begun yet.",
        ),
        L(
          "Di saku celemek Dr. Voss ada surat yang sama. Kau membacanya dua kali, dan dua kali kalimat terakhir berubah.",
          "In Dr. Voss's apron pocket is the same letter. You read it twice, and twice the last sentence changes.",
        ),
      ],
    },
    2: {
      chapter: 2,
      kicker: L("BAB II", "CHAPTER II"),
      title: L("Rumah yang Mengingat", "The House That Remembers"),
      scene: "portrait",
      paragraphsB: [
        L(
          "Lorong 1998 lebih panjang dari lorong 1958. Kau menghitung empat pintu, lalu lima, lalu empat lagi. Dindingnya bernapas.",
          "The 1998 hallway is longer than the 1958 hallway. You count four doors, then five, then four again. The walls are breathing.",
        ),
      ],
      paragraphsA: [
        L(
          "Foto keluarga itu baru saja dikembangkan. Tapi Voss bersikeras foto itu sudah ada sejak sepuluh tahun lalu.",
          "The family photograph has just been developed. But Voss insists it has existed for ten years already.",
        ),
      ],
    },
    3: {
      chapter: 3,
      kicker: L("BAB III", "CHAPTER III"),
      title: L("Anak Kecil Itu", "The Little Girl"),
      scene: "child",
      paragraphsB: [
        L(
          "Kamar ini tidak pernah kau masuki sebagai anak. Namun selimutnya masih berlipat seperti baru saja ditinggalkan.",
          "You never entered this room as a child. Yet the blanket is still folded as though it was just left.",
        ),
      ],
      paragraphsA: [
        L(
          "Evelyn duduk di pinggir tempat tidur, membelakangi cermin. Ia menyanyi dengan suara yang terlalu tua untuknya.",
          "Evelyn sits on the edge of the bed, her back to the mirror. She sings with a voice far too old for her.",
        ),
      ],
    },
    4: {
      chapter: 4,
      kicker: L("BAB IV", "CHAPTER IV"),
      title: L("Percobaan", "The Experiment"),
      scene: "lab",
      paragraphsB: [
        L(
          "Pintu bawah tanah terbuka dengan sendirinya. Di bawah, mesin itu masih berdengung â€” empat puluh tahun tanpa listrik.",
          "The basement door opens by itself. Below, the machine is still humming â€” forty years without power.",
        ),
      ],
      paragraphsA: [
        L(
          "Voss tidak ada di laboratorium. Rekaman berjalan sendiri, dan nada-nadanya sedikit lebih lambat dari ingatanmu.",
          "Voss is not in the laboratory. The recordings run by themselves, and the tones are slightly slower than you remember.",
        ),
      ],
    },
    5: {
      chapter: 5,
      kicker: L("BAB V", "CHAPTER V"),
      title: L("Peniruan", "The Imitation"),
      scene: "memory",
      paragraphsB: [
        L(
          "Ruang ini tidak punya sudut yang saling bertemu. Bayanganmu jatuh ke arah yang berlawanan dengan cahaya.",
          "No corner of this room meets another. Your shadow falls opposite the light.",
        ),
      ],
      paragraphsA: [
        L(
          "Suara pasanganmu datang dari dalam mesin. Ia mengatakan hal yang persis kau katakan tadi â€” tapi dengan jeda yang salah.",
          "Your partner's voice comes from inside the machine. It says exactly what you said a moment ago â€” with the wrong pause.",
        ),
      ],
    },
    6: {
      chapter: 6,
      kicker: L("BAB VI", "CHAPTER VI"),
      title: L("Memori Terakhir", "The Last Memory"),
      scene: "core",
      paragraphsB: [
        L(
          "Inti mesin berdenyut merah. Di dalamnya, sesuatu yang memakai wajah Evelyn menatapmu dan tidak berkedip.",
          "The machine's core pulses red. Inside it, something wearing Evelyn's face watches you without blinking.",
        ),
      ],
      paragraphsA: [
        L(
          "Dua panel kontrol berdiri berdampingan. Keduanya hanya bisa ditekan jika kalian berdua masih di sini.",
          "Two control panels stand side by side. Both can only be pressed if the two of you are still here.",
        ),
      ],
    },
  };
  return data[chapter] ?? null;
}

/* -------------------------------------------------------------------------- */
/*                                Stages                                      */
/* -------------------------------------------------------------------------- */

export function buildStages(state: RoomState): Stage[] {
  const { dialOrder, gearFragments, missingTeeth, fake } = state.seeds;
  const gearSum = gearFragments.reduce((total, value) => total + value, 0);
  const fakeLabel = fake === "A" ? "NORA" : "CALEB";

  return [
    {
      id: "arrival-letter",
      chapter: 1,
      title: L("Surat tanpa pengirim", "The letter with no sender"),
      introA: [
        L(
          "Kertasnya tebal, dengan kop timbul yang hampir tak terbaca. Di bawahnya ada kunci kuningan kecil.",
          "The paper is thick, with an embossed letterhead barely legible. Beneath it lies a small brass key.",
        ),
      ],
      introB: [
        L(
          "Surat yang sama. Cap posnya masih basah, padahal kertasnya sudah menguning tiga puluh tahun.",
          "The same letter. Its postmark is still wet, though the paper has yellowed for thirty years.",
        ),
      ],
      clueA: L(
        "Kop surat bertuliskan VOSS HOLOWAY. Ambil dua huruf pertama dari nama keluarga. Kunci yang menyertainya berwarna EMAS â€” kau akan butuh itu nanti.",
        "The letterhead reads VOSS HOLOWAY. Take the first two letters of the family name. The key beneath it is GOLD â€” you will need that later.",
      ),
      clueB: L(
        "Cap pos bertuliskan 19 Â· 58. Tulis dua angka terakhir dari tahun itu. Di pinggir cap ada goresan kecil: beberapa gigi jam patah, dan kau akan diminta mengingat jumlahnya nanti.",
        "The postmark reads 19 Â· 58. Write the last two digits of that year. At the edge of the stamp is a small scratch: several clock teeth are broken, and you will be asked to remember how many later.",
      ),
      hintA: L("Nama keluarga. Dua huruf pertama.", "Family name. First two letters."),
      hintB: L("Tahun. Dua digit terakhir.", "Year. Last two digits."),
      labelA: L("Dua huruf dari kop surat", "Two letters from the letterhead"),
      labelB: L("Dua angka dari cap pos", "Two digits from the postmark"),
      answerA: answers("VO", "V O"),
      answerB: answers("58"),
      solved: L(
        "Dua keping kunci berpindah ke telapak tanganmu. Pintu depan menggeser sedikit â€” cukup untuk membuatmu ragu apakah kau yang membukanya.",
        "Two halves of a key shift into your palm. The front door slides a little â€” just enough to make you wonder whether you opened it.",
      ),
    },
    {
      id: "arrival-clock",
      chapter: 1,
      title: L("Jam tiga jarum", "The clock with three hands"),
      introA: [
        L(
          "Jam di lorong memiliki tiga jarum. Jarum ketiga tidak pernah bergerak. Di belakangnya ada lempengan bertuliskan sesuatu.",
          "The hallway clock has three hands. The third has never moved. Behind it is a small engraved plate.",
        ),
      ],
      introB: [
        L(
          "Di sisimu, jam yang sama tinggal kerangka. Roda giginya berserakan di lantai, seolah ada yang sengaja memecahnya.",
          "On your side, the same clock is only a frame. Its gears are scattered on the floor, as though someone broke it on purpose.",
        ),
      ],
      clueA: L(
        "Ukiran itu berbunyi: â€œwhen the third hand rests on the broken toothâ€. Jarum pendek berhenti tepat di 11. Sampaikan angka itu ke pasanganmu.",
        "The engraving reads: â€œwhen the third hand rests on the broken toothâ€. The short hand is stopped at 11. Tell that number to your partner.",
      ),
      clueB: L(
        `Tiga pecahan roda gigi bertuliskan ${gearFragments[0]}, ${gearFragments[1]} dan ${gearFragments[2]} gigi. Jumlahkan ketiganya. Itulah posisi jarum ketiga.`,
        `Three gear fragments are marked ${gearFragments[0]}, ${gearFragments[1]} and ${gearFragments[2]} teeth. Add them together. That is where the third hand rests.`,
      ),
      hintA: L("Lihat jarum yang paling pendek.", "Look at the shortest hand."),
      hintB: L("Gunakan ketiga pecahan, bukan satu.", "Use all three fragments, not one."),
      labelA: L("Angka jam", "Hour"),
      labelB: L("Jumlah gigi", "Total teeth"),
      answerA: answers("11"),
      answerB: answers(String(gearSum)),
      solved: L(
        "Jarum ketiga berdentak. Di dinding 1998, retakan baru muncul dari titik tepat di belakang jam.",
        "The third hand clicks. On the 1998 wall, a new crack appears from the exact point behind the clock.",
      ),
      consequence: "crack",
    },
    {
      id: "arrival-child",
      chapter: 1,
      title: L("Anak di tangga", "The child on the stairs"),
      introA: [
        L(
          "Goresan di dinding lorong terlalu tinggi untuk anak kecil. Terlalu rendah untuk orang dewasa.",
          "The scratches on the hallway wall are too high for a child. Too low for an adult.",
        ),
      ],
      introB: [
        L(
          "Di cermin, seorang anak berdiri di tangga. Kau berbalik. Tangga di belakangmu kosong.",
          "In the mirror, a child stands on the stairs. You turn around. The stairs behind you are empty.",
        ),
      ],
      clueA: L(
        "Hitung goresan di dinding. Ada tujuh. Katakan jumlahnya pada pasanganmu, lalu dengarkan apa yang ia lihat.",
        "Count the scratches on the wall. There are seven. Tell your partner the number, then listen to what they see.",
      ),
      clueB: L(
        "Anak itu berdiri pada anak tangga ketujuh dari bawah. Jangan percaya bayangan yang lebih panjang dari tangga itu.",
        "The child stands on the seventh step from the bottom. Do not trust a shadow longer than the staircase.",
      ),
      hintA: L("Goresan, bukan anak tangga.", "Scratches, not steps."),
      hintB: L("Hitung dari bawah.", "Count from the bottom."),
      labelA: L("Jumlah goresan", "Number of scratches"),
      labelB: L("Anak tangga ke-", "Step number"),
      answerA: answers("7"),
      answerB: answers("7"),
      solved: L(
        "Kalian mengucapkan angka yang sama bersamaan. Cermin menjadi keruh, dan suara langkah kaki kecil berhenti tepat di belakangmu.",
        "You say the same number at the same time. The mirror clouds over, and small footsteps stop directly behind you.",
      ),
    },

    {
      id: "memory-portrait",
      chapter: 2,
      title: L("Empat wajah", "Four faces"),
      introA: [
        L(
          "Foto keluarga tergantung miring. Bingkainya baru, tapi kaca dalamnya sudah retak.",
          "The family portrait hangs crooked. Its frame is new, but the glass inside is cracked.",
        ),
      ],
      introB: [
        L(
          "Foto yang sama, belum tergantung. Voss baru saja menyerahkannya padamu â€” dan tangannya gemetar.",
          "The same photograph, not yet hung. Voss has just handed it to you â€” and his hands are shaking.",
        ),
      ],
      clueA: L(
        "Ada empat orang dalam foto. Seorang berdiri lebih jauh dari yang lain. Kartu di bawah bingkai menyebut perannya: PENGURUS RUMAH.",
        "There are four people in the photograph. One stands apart from the others. The card under the frame names their role: HOUSEKEEPER.",
      ),
      clueB: L(
        "Satu wajah tergores dengan pisau. Di balik goresan, tertulis tahun foto ini diambil: 1958.",
        "One face is scratched out with a knife. Beneath the scratch, the year the photo was taken is written: 1958.",
      ),
      hintA: L("Ia berdiri paling jauh.", "They stand furthest away."),
      hintB: L("Lihat yang hilang, bukan yang tersisa.", "Look at what is gone, not what remains."),
      labelA: L("Peran orang keempat", "Fourth person's role"),
      labelB: L("Tahun foto", "Year of the photograph"),
      answerA: answers("caretaker", "housekeeper", "pengurus rumah", "pengurus"),
      answerB: answers("1958"),
      solved: L(
        "Kacanya berderak. Orang keempat di foto kini memandang langsung ke arahmu, meski wajahnya tergores.",
        "The glass crackles. The fourth person in the photo now looks directly at you, though their face is scratched out.",
      ),
    },
    {
      id: "memory-calendar",
      chapter: 2,
      title: L("Tanggal yang dilingkari", "The circled dates"),
      introA: [
        L(
          "Kalender 1958 tergantung di dapur 1998. Tiga tanggal dilingkari dengan tinta merah yang masih basah.",
          "A 1958 calendar hangs in the 1998 kitchen. Three dates are circled in red ink that is still wet.",
        ),
      ],
      introB: [
        L(
          "Buku harian Voss terbuka. Ia hanya menulis pada tiga hari itu â€” dan selalu mengulang satu kata yang sama.",
          "Voss's diary lies open. He only wrote on those three days â€” and always repeated the same word.",
        ),
      ],
      clueA: L(
        "Tanggal yang dilingkari: 12, 19 dan 26. Bacakan berurutan kepada pasanganmu.",
        "The circled dates are 12, 19 and 26. Read them in order to your partner.",
      ),
      clueB: L(
        "Pada ketiga tanggal itu, Voss hanya menulis satu kata: BENANG. Ia menyebutnya â€˜benang merah yang mengikat ingatanâ€™.",
        "On those three dates, Voss wrote only one word: THREAD. He called it â€˜the red thread that ties memoryâ€™.",
      ),
      hintA: L("Tiga angka, urut dari kecil.", "Three numbers, ascending."),
      hintB: L("Satu kata yang diulang.", "One repeated word."),
      labelA: L("Tiga tanggal", "Three dates"),
      labelB: L("Kata yang diulang", "Repeated word"),
      answerA: answers("12 19 26", "12, 19, 26", "121926"),
      answerB: answers("thread", "benang", "benang merah", "red thread"),
      solved: L(
        "Benang merah muncul di lantai, menghubungkan ketiga tanggal itu ke pintu kamar Evelyn.",
        "A red thread appears on the floor, connecting the three dates to Evelyn's bedroom door.",
      ),
    },
    {
      id: "memory-dining",
      chapter: 2,
      title: L("Meja makan", "The dining table"),
      introA: [
        L(
          "Empat piring masih tersusun rapi. Satu kursi ditarik keluar, seolah baru saja ada yang berdiri.",
          "Four plates are still neatly arranged. One chair is pulled out, as though someone has just stood up.",
        ),
      ],
      introB: [
        L(
          "Di 1958, tiga piring. Kursi keempat kosong dan tidak pernah dipakai â€” tapi kartu namanya ada.",
          "In 1958, three plates. The fourth chair is empty and has never been used â€” yet its name card is there.",
        ),
      ],
      clueA: L(
        "Hitung kursi di meja 1998. Jawab dengan angka.",
        "Count the chairs at the 1998 table. Answer with a number.",
      ),
      clueB: L(
        "Kartu nama di kursi kosong bertuliskan EVELYN. Bacakan pada pasanganmu.",
        "The name card on the empty chair reads EVELYN. Read it to your partner.",
      ),
      hintA: L("Termasuk kursi yang ditarik.", "Include the pulled-out chair."),
      hintB: L("Nama anak Voss.", "Voss's daughter's name."),
      labelA: L("Jumlah kursi", "Number of chairs"),
      labelB: L("Nama di kartu", "Name on the card"),
      answerA: answers("4", "empat"),
      answerB: answers("evelyn"),
      solved: L(
        "Satu piring retak tanpa suara. Di 1958, kursi itu menggeser sendiri kembali ke meja.",
        "One plate cracks without a sound. In 1958, that chair slides itself back to the table.",
      ),
    },

    {
      id: "girl-lullaby",
      chapter: 3,
      title: L("Nina bobo yang salah", "The wrong lullaby"),
      introA: [
        L(
          "Kotak musik memiliki sembilan tuts. Tutupnya penuh debu, tapi ada sidik jari kecil yang baru.",
          "The music box has nine keys. Its lid is dusty, but there is a fresh small fingerprint.",
        ),
      ],
      introB: [
        L(
          "Dua lembar notasi ada di meja. Salah satunya ditulis Evelyn. Yang lain muncul setelah kau berkedip.",
          "Two sheets of notation lie on the table. One was written by Evelyn. The other appeared after you blinked.",
        ),
      ],
      clueA: L(
        "Buku cerita Evelyn berkata: â€œIa selalu berakhir di La, tidak pernah di Si.â€ Hitung juga tuts kotak musik.",
        "Evelyn's storybook says: â€œIt always ends on La, never on Si.â€ Also count the keys of the music box.",
      ),
      clueB: L(
        "Notasi pertama berakhir di Si. Notasi kedua berakhir di La. Pilih yang asli menurut buku cerita Evelyn.",
        "The first notation ends on Si. The second ends on La. Choose the one that matches Evelyn's storybook.",
      ),
      hintA: L("Sembilan tuts. Akhir nada La.", "Nine keys. Ends on La."),
      hintB: L("Yang berakhir di Si bukan miliknya.", "The one ending on Si is not hers."),
      labelA: L("Jumlah tuts", "Number of keys"),
      labelB: L("Nada terakhir yang benar", "Correct final note"),
      answerA: answers("9", "sembilan"),
      answerB: answers("la"),
      optionsB: [
        { value: "si", label: L("Si", "Si") },
        { value: "la", label: L("La", "La") },
      ],
      solved: L(
        "Kotak musik berputar. Di cermin, bayangan Evelyn lebih tinggi dua puluh sentimeter dari anak yang bernyanyi.",
        "The music box turns. In the mirror, Evelyn's shadow is twenty centimetres taller than the child singing.",
      ),
    },
    {
      id: "girl-doll",
      chapter: 3,
      title: L("Boneka dan coretan", "The doll and the scratches"),
      introA: [
        L(
          "Boneka itu berbaring di tempat tidur dengan tiga pita di rambutnya. Salah satu pita terikat terlalu ketat.",
          "The doll lies on the bed with three ribbons in its hair. One ribbon is tied far too tightly.",
        ),
      ],
      introB: [
        L(
          "Dinding kamar penuh panah. Ada yang menunjukkan kiri, kanan, lalu kiri lagi â€” berulang sampai lelah.",
          "The bedroom wall is covered in arrows. Some point left, right, then left again â€” repeated until they ran out of room.",
        ),
      ],
      clueA: L(
        "Hitung pita di rambut boneka. Jawab dengan angka.",
        "Count the ribbons in the doll's hair. Answer with a number.",
      ),
      clueB: L(
        "Urutan panah yang paling awal dan paling dalam: KIRI Â· KANAN Â· KIRI. Tuliskan huruf pertamanya.",
        "The earliest and deepest arrows read: LEFT Â· RIGHT Â· LEFT. Write their first letters.",
      ),
      hintA: L("Tiga, tapi jangan menebak.", "Three, but do not guess."),
      hintB: L("K K K dalam bahasa Indonesia.", "L R L in English."),
      labelA: L("Jumlah pita", "Number of ribbons"),
      labelB: L("Urutan panah", "Arrow sequence"),
      answerA: answers("3", "tiga"),
      answerB: answers("l r l", "k k k", "left right left", "kiri kanan kiri", "lrl", "kkk"),
      solved: L(
        "Boneka itu berkedip. Bukan matanya yang bergerak â€” tapi bayangannya.",
        "The doll blinks. It is not its eyes that move â€” but its shadow.",
      ),
    },
    {
      id: "girl-voice",
      chapter: 3,
      title: L("Suara di radio", "The voice on the radio"),
      introA: [
        L(
          "Cermin kamar memantulkan sosok di belakangmu. Ia lebih tinggi dari siapa pun yang pernah tinggal di rumah ini.",
          "The bedroom mirror reflects a figure behind you. It is taller than anyone who ever lived in this house.",
        ),
      ],
      introB: [
        L(
          "Radio berderak. Seorang anak berbisik: â€œJangan biarkan ia memakai wajahku.â€",
          "The radio crackles. A child whispers: â€œDon't let him wear my face.â€",
        ),
      ],
      clueA: L(
        "Bagaimana bayangan itu dibandingkan dengan Evelyn? Jawab: TINGGI atau PENDEK.",
        "How is that shadow compared with Evelyn? Answer: TALL or SHORT.",
      ),
      clueB: L(
        "Siapa yang menurut anak itu ingin memakai wajahnya? Jawab: YANG LAIN.",
        "Who does the child say wants to wear her face? Answer: THE OTHER.",
      ),
      hintA: L("Ia melebihi bingkai cermin.", "It overflows the mirror frame."),
      hintB: L("Bukan ibunya. Bukan Voss.", "Not her mother. Not Voss."),
      labelA: L("Perbandingan bayangan", "Shadow comparison"),
      labelB: L("Yang ingin memakai wajahnya", "Who wants her face"),
      answerA: answers("tall", "tinggi", "lebih tinggi"),
      answerB: answers("the other", "other", "yang lain", "dia"),
      optionsA: [
        { value: "tall", label: L("Lebih tinggi", "Taller") },
        { value: "short", label: L("Lebih pendek", "Shorter") },
      ],
      optionsB: [
        { value: "the other", label: L("Yang Lain", "The Other") },
        { value: "evelyn", label: L("Evelyn", "Evelyn") },
      ],
      solved: L(
        "Radio mati. Di cermin, bayangan tinggi itu mengangkat tangan â€” mengikuti gerakanmu, setengah detik terlambat.",
        "The radio dies. In the mirror, the tall shadow raises a hand â€” following your movement, half a second late.",
      ),
    },

    {
      id: "experiment-dials",
      chapter: 4,
      title: L("Tiga panel analog", "Three analog panels"),
      introA: [
        L(
          "Tiga tuas di panel 1958. Semua bisa digeser, tapi hanya satu urutan yang membuat mesin bernyanyi.",
          "Three levers on the 1958 panel. All can be moved, but only one sequence makes the machine sing.",
        ),
      ],
      introB: [
        L(
          "Skema di 1998 robek. Urutan tuasnya hilang, tapi kabel yang putus masih menyala merah.",
          "The 1998 schematic is torn. The lever order is gone, but the severed wire still glows red.",
        ),
      ],
      clueA: L(
        `Nomor tuas dari kiri ke kanan: ${dialOrder[0]} Â· ${dialOrder[1]} Â· ${dialOrder[2]}. Tuliskan angka-angkanya berurutan.`,
        `Lever numbers from left to right: ${dialOrder[0]} Â· ${dialOrder[1]} Â· ${dialOrder[2]}. Write the numbers in order.`,
      ),
      clueB: L(
        "Kabel yang putus berwarna MERAH. Kabel itu menghubungkan panel 1958 ke intake memori.",
        "The severed wire is RED. It connects the 1958 panel to the memory intake.",
      ),
      hintA: L("Baca dari kiri.", "Read from the left."),
      hintB: L("Warna, bukan angka.", "A colour, not a number."),
      labelA: L("Urutan tuas", "Lever order"),
      labelB: L("Warna kabel", "Wire colour"),
      answerA: answers(dialOrder.join(" "), dialOrder.join(""), dialOrder.join(",")),
      answerB: answers("red", "merah"),
      solved: L(
        "Panel berdengung. Di lantai, bayangan kalian berdua jadi satu â€” lalu terpisah lagi dengan terlalu cepat.",
        "The panel hums. On the floor, both your shadows become one â€” then separate again far too quickly.",
      ),
    },
    {
      id: "experiment-records",
      chapter: 4,
      title: L("Rekaman yang dipulihkan", "The restored recordings"),
      introA: [
        L(
          "Tiga rol pita berlabel tahun. Dua label sudah memudar, satu masih terbaca.",
          "Three tape reels are labelled with years. Two labels have faded, one is still legible.",
        ),
      ],
      introB: [
        L(
          "Di sisi 1998, tiga rol kosong. Suara yang keluar bukan dari pita mana pun.",
          "On the 1998 side, three empty reels. The voice coming out is not on any of them.",
        ),
      ],
      clueA: L(
        "Tahun-tahannya, berurutan: 1949 Â· 1953 Â· 1958. Tuliskan ketiganya.",
        "The years, in order: 1949 Â· 1953 Â· 1958. Write all three.",
      ),
      clueB: L(
        "Di bagian bawah skema ada tanda tangan: ELIAS VOSS. Tuliskan nama depannya.",
        "At the bottom of the schematic is a signature: ELIAS VOSS. Write his first name.",
      ),
      hintA: L("Tiga tahun, urut.", "Three years, ascending."),
      hintB: L("Nama depan peneliti.", "The researcher's first name."),
      labelA: L("Tiga tahun", "Three years"),
      labelB: L("Nama depan", "First name"),
      answerA: answers("1949 1953 1958", "1949,1953,1958", "194919531958"),
      answerB: answers("elias"),
      solved: L(
        "Rekaman 1958 berisi suara anak kecil yang tidak pernah kau kenal â€” menyebut namamu dengan benar.",
        "The 1958 recording holds the voice of a child you never knew â€” saying your name correctly.",
      ),
      consequence: "names",
    },
    {
      id: "experiment-mimic",
      chapter: 4,
      title: L("Suara yang meniru", "The mimicking voice"),
      introA: [
        L(
          "Radio di 1998 mengulang kalimatmu kata demi kata. Kau belum mengucapkannya.",
          "The 1998 radio repeats your sentence word for word. You have not said it yet.",
        ),
      ],
      introB: [
        L(
          "Di balik kaca mesin, sesuatu berdiri terlalu tinggi. Ia memakai wajah yang kau kenal.",
          "Behind the machine's glass stands something far too tall. It wears a face you know.",
        ),
      ],
      clueA: L(
        "Apa suara di radio itu? Jawab: TIRUAN.",
        "What is the voice on the radio? Answer: IMITATION.",
      ),
      clueB: L(
        "Apa yang ada di balik kaca? Jawab: YANG LAIN.",
        "What stands behind the glass? Answer: THE OTHER.",
      ),
      hintA: L("Ia bukan pasanganmu.", "It is not your partner."),
      hintB: L("Ia ingin diingat.", "It wants to be remembered."),
      labelA: L("Suara di radio", "Voice on the radio"),
      labelB: L("Sosok di balik kaca", "Figure behind the glass"),
      answerA: answers("tiruan", "palsu", "fake", "imitation"),
      answerB: answers("the other", "other", "yang lain"),
      optionsA: [
        { value: "fake", label: L("Tiruan", "Imitation") },
        { value: "partner", label: L("Pasanganku", "My partner") },
      ],
      optionsB: [
        { value: "the other", label: L("Yang Lain", "The Other") },
        { value: "voss", label: L("Voss", "Voss") },
      ],
      solved: L(
        "Radio mengeluarkan satu napas panjang, lalu diam. Kalian berdua tahu: salah satu dari kalian baru saja didengar.",
        "The radio lets out one long breath, then falls silent. You both know: one of you has just been overheard.",
      ),
      consequence: "fakeRadio",
    },

    {
      id: "imitation-private",
      chapter: 5,
      title: L("Dua versi dirimu", "Two versions of you"),
      introA: [
        L(
          "Transkrip percakapanmu tergeletak di meja. Kau membacanya, dan satu kalimat terasa asing.",
          "A transcript of your conversation lies on the table. You read it, and one sentence feels foreign.",
        ),
      ],
      introB: [
        L(
          "Transkripmu juga ada. Keduanya terlihat sama â€” sampai kau memeriksa detail yang hanya kau yang tahu.",
          "Your transcript is here too. They look identical â€” until you check the detail only you could know.",
        ),
      ],
      clueA:
        fake === "A"
          ? L(
              "Transkripmu menyebut kunci PERAK. Jawab pertanyaan privatmu: warna kunci yang benar?",
              "Your transcript mentions a SILVER key. Answer your private question: what colour was the real key?",
            )
          : L(
              "Transkripmu menyebut kunci EMAS. Jawab pertanyaan privatmu: warna kunci yang benar?",
              "Your transcript mentions a GOLD key. Answer your private question: what colour was the real key?",
            ),
      clueB: L(
        `Transkripmu menyebut ${fake === "B" ? "empat" : "tiga"} gigi patah. Jawab pertanyaan privatmu: berapa gigi patah yang sebenarnya?`,
        `Your transcript mentions ${fake === "B" ? "four" : "three"} broken teeth. Answer your private question: how many teeth were really broken?`,
      ),
      hintA: L("Kunci di surat pertama.", "The key in the first letter."),
      hintB: L("Catatan di cap pos.", "The note on the postmark."),
      labelA: L("Warna kunci yang benar", "The real key colour"),
      labelB: L("Jumlah gigi patah", "Number of broken teeth"),
      answerA: answers("gold", "emas", "kuning"),
      answerB: answers(String(state.seeds.missingTeeth)),
      solved: L(
        "Kalian berdua menjawab tanpa saling melihat. Jawaban kalian cocok â€” tapi salah satu transkrip tetap berbohong.",
        "You both answer without looking at each other. Your answers agree â€” yet one transcript is still lying.",
      ),
    },
    {
      id: "imitation-vote",
      chapter: 5,
      title: L("Manusia yang mana", "Which one is human"),
      introA: [
        L(
          "Dua transkrip berdiri bersebelahan. Salah satunya ditulis oleh sesuatu yang hanya pernah mendengar ceritamu.",
          "Two transcripts stand side by side. One was written by something that has only ever heard your story.",
        ),
      ],
      introB: [
        L(
          "Kau tidak boleh memberi tahu pasanganmu sebelum memilih. Kalau kau bicara, suaramu bisa dipakai lagi.",
          "You must not tell your partner before choosing. If you speak, your voice may be used again.",
        ),
      ],
      clueA: L(
        `Transkrip siapa yang tiruan? Transkripmu menyebut ${fake === "A" ? "perak" : "emas"}. Transkrip pasanganmu menyebut angka yang ${fake === "B" ? "salah" : "benar"}. Pilih A untuk Nora, B untuk Caleb.`,
        `Whose transcript is the imitation? Your transcript says ${fake === "A" ? "silver" : "gold"}. Your partner's transcript gives a ${fake === "B" ? "wrong" : "correct"} number. Choose A for Nora, B for Caleb.`,
      ),
      clueB: L(
        `Transkrip siapa yang tiruan? Transkripmu menyebut ${fake === "B" ? "empat" : "tiga"} gigi. Transkrip pasanganmu menyebut warna yang ${fake === "A" ? "salah" : "benar"}. Pilih A untuk Nora, B untuk Caleb.`,
        `Whose transcript is the imitation? Your transcript says ${fake === "B" ? "four" : "three"} teeth. Your partner's transcript gives a ${fake === "A" ? "wrong" : "correct"} colour. Choose A for Nora, B for Caleb.`,
      ),
      hintA: L("Detail yang berubah adalah milikmu.", "The changed detail is yours."),
      hintB: L("Detail yang berubah adalah milikmu.", "The changed detail is yours."),
      labelA: L("Transkrip tiruan", "Imitated transcript"),
      labelB: L("Transkrip tiruan", "Imitated transcript"),
      answerA: answers(fake),
      answerB: answers(fake),
      optionsA: [
        { value: "A", label: L("Nora", "Nora") },
        { value: "B", label: L("Caleb", "Caleb") },
      ],
      optionsB: [
        { value: "A", label: L("Nora", "Nora") },
        { value: "B", label: L("Caleb", "Caleb") },
      ],
      solved: L(
        `Kalian menunjuk transkrip yang sama. ${fakeLabel} mundur selangkah â€” dan sosok di cermin ikut mundur, meski ${fakeLabel} tidak bercermin.`,
        `You both point at the same transcript. ${fakeLabel} steps back â€” and the figure in the mirror steps back too, though ${fakeLabel} is not looking into it.`,
      ),
    },
    {
      id: "imitation-trust",
      chapter: 5,
      title: L("Siapa yang kau dengar", "Who you listen to"),
      introA: [
        L(
          "Sosok itu sekarang memakai wajah pasanganmu. Ia memanggilmu dengan nama yang benar.",
          "The figure now wears your partner's face. It calls you by your real name.",
        ),
      ],
      introB: [
        L(
          "Di radio, suaramu sendiri menyuruhmu untuk membuka panel terakhir sendirian.",
          "On the radio, your own voice tells you to open the final panel alone.",
        ),
      ],
      clueA: L(
        "Siapa yang masih boleh kau percaya? Jawab: PASANGAN.",
        "Who can you still trust? Answer: PARTNER.",
      ),
      clueB: L(
        "Siapa yang masih boleh kau percaya? Jawab: PASANGAN.",
        "Who can you still trust? Answer: PARTNER.",
      ),
      hintA: L("Bukan suara yang paling mirip.", "Not the voice that sounds most familiar."),
      hintB: L("Bukan suaramu sendiri.", "Not your own voice."),
      labelA: L("Keputusanmu", "Your decision"),
      labelB: L("Keputusanmu", "Your decision"),
      answerA: answers("partner", "pasangan"),
      answerB: answers("partner", "pasangan"),
      optionsA: [
        { value: "partner", label: L("Pasangan", "Partner") },
        { value: "voice", label: L("Suara", "The voice") },
      ],
      optionsB: [
        { value: "partner", label: L("Pasangan", "Partner") },
        { value: "voice", label: L("Suara", "The voice") },
      ],
      solved: L(
        "Kalian berdua memalingkan muka. Saat kalian menoleh lagi, sosok itu sudah berdiri di antara kalian â€” dan tidak ada yang tahu siapa yang bergerak lebih dulu.",
        "You both look away. When you look back, the figure stands between you â€” and neither of you knows who moved first.",
      ),
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*                            Hidden discoveries                              */
/* -------------------------------------------------------------------------- */

export const HIDDEN: HiddenItem[] = [
  {
    id: "rec-elias-1949",
    chapter: 2,
    kind: "recording",
    labelA: L("Laci dapur yang tidak seharusnya terbuka", "A kitchen drawer that should not open"),
    labelB: L("Rol pita di balik kalender", "A tape reel behind the calendar"),
    revealA: L(
      "REKAMAN 1949 â€” â€œAku mulai dengan satu pertanyaan: apakah ingatan bisa disimpan di luar kepala?â€",
      "RECORDING 1949 â€” â€œI began with one question: can memory be kept outside the head?â€",
    ),
    revealB: L(
      "Suaranya muda. Ia belum takut pada apa pun.",
      "His voice is young. He is afraid of nothing yet.",
    ),
  },
  {
    id: "opt-ash-name",
    chapter: 2,
    kind: "optional",
    labelA: L("Abu di perapian", "Ash in the fireplace"),
    labelB: L("Nama di balik foto", "A name behind the photo"),
    revealA: L("Sebuah inisial terukir di abu: E.V.", "An initial is etched in the ash: E.V."),
    revealB: L("Foto itu ditandai â€˜untuk E, selamanyaâ€™.", "The photo is marked â€˜for E, alwaysâ€™."),
  },
  {
    id: "rec-evelyn-1953",
    chapter: 3,
    kind: "recording",
    labelA: L("Kotak mainan di bawah tempat tidur", "A toy box under the bed"),
    labelB: L("Kertas yang muncul di saku", "Paper that appears in your pocket"),
    revealA: L(
      "REKAMAN 1953 â€” â€œAyah merekam suaraku lagi. Kali ini aku tidak boleh bernyanyi.â€",
      "RECORDING 1953 â€” â€œFather recorded my voice again. This time I was not allowed to sing.â€",
    ),
    revealB: L(
      "Di kertas itu tertulis: â€˜Jangan biarkan dia belajar caraku tertawa.â€™",
      "On the paper: â€˜Do not let him learn the way I laugh.â€™",
    ),
  },
  {
    id: "opt-ribbon-knot",
    chapter: 3,
    kind: "optional",
    labelA: L("Pita yang terlalu ketat", "The ribbon tied too tightly"),
    labelB: L("Goresan di kepala tempat tidur", "Scratches on the headboard"),
    revealA: L("Pita itu diikat oleh tangan kiri.", "The ribbon was tied by a left hand."),
    revealB: L("Goresan itu mengulang: â€˜aku yang mengikatnyaâ€™.", "The scratches repeat: â€˜I tied itâ€™."),
  },
  {
    id: "rec-staff-1956",
    chapter: 4,
    kind: "recording",
    labelA: L("Panel ketiga yang tidak disebut", "The third panel nobody mentioned"),
    labelB: L("Kabel merah di lantai", "The red wire on the floor"),
    revealA: L(
      "REKAMAN 1956 â€” â€œStaf mulai melapor. Mereka mengingat hari yang tidak pernah mereka jalani.â€",
      "RECORDING 1956 â€” â€œThe staff began reporting. They remember days they never lived.â€",
    ),
    revealB: L(
      "Kabel itu hangat. Ia tidak terhubung ke sumber mana pun.",
      "The wire is warm. It connects to nothing.",
    ),
  },
  {
    id: "opt-black-reel",
    chapter: 4,
    kind: "optional",
    labelA: L("Rol pita hitam", "The black tape reel"),
    labelB: L("Angka di dinding laboratorium", "Numbers on the lab wall"),
    revealA: L("Rol itu berisi tiga detik keheningan.", "The reel holds three seconds of silence."),
    revealB: L("Angka itu adalah tanggal kematian Evelyn.", "The numbers are the date of Evelyn's death."),
  },
  {
    id: "rec-mother-final",
    chapter: 5,
    kind: "recording",
    labelA: L("Suara di balik cermin", "A voice behind the mirror"),
    labelB: L("Transkrip ketiga", "A third transcript"),
    revealA: L(
      "REKAMAN TERAKHIR â€” â€œElias, kau tidak sedang menyelamatkanku. Kau sedang menggantiku.â€",
      "FINAL RECORDING â€” â€œElias, you are not saving me. You are replacing me.â€",
    ),
    revealB: L(
      "Transkrip ketiga hanya berisi satu baris: â€˜Apakah aku pernah benar-benar punya nama?â€™",
      "The third transcript holds one line: â€˜Did I ever really have a name?â€™",
    ),
  },
  {
    id: "opt-name-in-document",
    chapter: 5,
    kind: "optional",
    labelA: L("Dokumen 1958 di saku jaket", "The 1958 document in your coat"),
    labelB: L("Daftar staf yang terakhir", "The last staff roster"),
    revealA: L("Dokumen itu mencantumkan nama NORA dan CALEB.", "The document lists the names NORA and CALEB."),
    revealB: L("Daftar staf ditutup dengan tulisan: â€˜keduanya sudah datangâ€™.", "The roster ends with: â€˜both have arrivedâ€™."),
  },
];

export function hiddenForChapter(chapter: number): HiddenItem[] {
  return HIDDEN.filter((item) => item.chapter === chapter);
}

/* -------------------------------------------------------------------------- */
/*                                Finale                                      */
/* -------------------------------------------------------------------------- */

export const FINAL_CHOICES: Array<{
  value: FinalChoice;
  label: Localized;
  description: Localized;
}> = [
  {
    value: "shutdown",
    label: L("Matikan", "Shut it down"),
    description: L(
      "Biarkan memori berhenti. Bahkan jika itu berarti kehilangan Evelyn untuk kedua kalinya.",
      "Let the memory stop. Even if it means losing Evelyn a second time.",
    ),
  },
  {
    value: "preserve",
    label: L("Pertahankan", "Preserve it"),
    description: L(
      "Biarkan rumah terus mengingat. Bahkan jika yang diingat bukan lagi Evelyn.",
      "Let the house keep remembering. Even if what it remembers is no longer Evelyn.",
    ),
  },
  {
    value: "split",
    label: L("Pisahkan", "Separate them"),
    description: L(
      "Satu kembali, satu tinggal. Jangan pernah memberi tahu yang mana.",
      "One returns, one stays. Never tell which one.",
    ),
  },
];

export function finalePrompt(role: Role): Localized {
  return role === "A"
    ? L(
        "Yang Lain bertanya dengan suara Evelyn: â€œApakah kau akan mengingatku?â€ Tanganmu ada di panel utama. Pilihlah â€” pasanganmu memegang panel yang satu lagi.",
        "The Other asks in Evelyn's voice: â€œWill you remember me?â€ Your hand is on the main panel. Choose â€” your partner holds the other panel.",
      )
    : L(
        "Mesin menawarkan satu memori terakhir: kau berdiri di lorong ini bersama Evelyn, tahun 1958. Kau tahu itu bukan kau. Tetap pilihlah.",
        "The machine offers one last memory: you stand in this hallway with Evelyn, in 1958. You know it is not you. Choose anyway.",
      );
}

/* -------------------------------------------------------------------------- */
/*                                Endings                                     */
/* -------------------------------------------------------------------------- */

export interface EndingContent {
  id: string;
  title: Localized;
  paragraphs: Localized[];
  art: string;
}

export function resolveEnding(state: RoomState): EndingContent {
  const secretComplete =
    state.secret.recordings.length === 5 && state.secret.optional.length === 3;
  const a = state.finale.choice?.A;
  const b = state.finale.choice?.B;

  if (secretComplete) {
    return {
      id: "first-memory",
      art: "memory",
      title: L("Memori Pertama", "The First Memory"),
      paragraphs: [
        L(
          "Panel terakhir tidak mati. Ia membuka satu ruangan lagi â€” ruangan yang tidak pernah ada di rumah ini.",
          "The last panel does not go dark. It opens one more room â€” a room that was never in this house.",
        ),
        L(
          "Seorang anak duduk di depan mesin, memakai wajah yang kau kenal lebih baik daripada wajahmu sendiri. Ia berkata: â€œKau kembali.â€",
          "A child sits before the machine, wearing a face you know better than your own. It says: â€œYou came back.â€",
        ),
        L("Hitam.", "Black."),
      ],
    };
  }

  if (a === "shutdown" && b === "shutdown") {
    return {
      id: "goodbye",
      art: "sunrise",
      title: L("Selamat Tinggal Terakhir", "The Last Goodbye"),
      paragraphs: [
        L(
          "Evelyn menatapmu dari dalam kaca. â€œApakah kau akan mengingatku?â€ Kau menjawab ya, lalu menekan tuas terakhir.",
          "Evelyn watches you from inside the glass. â€œWill you remember me?â€ You say yes, then pull the final lever.",
        ),
        L(
          "Mesin menghela napas panjang. Di foto yang kau bawa keluar, hanya tersisa tiga wajah.",
          "The machine exhales. In the photograph you carry out, only three faces remain.",
        ),
        L(
          "Matahari terbit di atas Hollow House. Untuk pertama kalinya, rumah itu tidak memantulkan bayangan.",
          "The sun rises over Hollow House. For the first time, the house casts no shadow.",
        ),
      ],
    };
  }

  if (a === "preserve" && b === "preserve") {
    return {
      id: "never-forgets",
      art: "memory",
      title: L("Rumah yang Tidak Pernah Lupa", "A House That Never Forgets"),
      paragraphs: [
        L(
          "Kalian membiarkan mesin tetap menyala. Pintu depan terbuka, dan kau kembali ke ruang pertama â€” tapi suratnya sudah ditulis dengan tanganmu sendiri.",
          "You leave the machine running. The front door opens, and you return to the first room â€” but the letter is now in your own handwriting.",
        ),
        L(
          "Foto baru tergantung di dinding: Voss, Evelyn, pengurus rumah, kalian berdua. Semua tersenyum. Tidak ada yang menatap kamera.",
          "A new photograph hangs on the wall: Voss, Evelyn, the housekeeper, and the two of you. Everyone smiles. Nobody looks at the camera.",
        ),
      ],
    };
  }

  const stay: Role =
    a === "preserve" ? "A" : b === "preserve" ? "B" : a === "split" ? "A" : "B";

  return {
    id: "one-remains",
    art: stay === "A" ? "sunrise" : "memory",
    title: L("Satu Harus Tinggal", "One Must Remain"),
    paragraphs: [
      L(
        "Kalian memilih memisahkan dua realitas. Pintu hanya cukup untuk satu orang.",
        "You choose to separate the two realities. The door is only wide enough for one.",
      ),
      stay === "A"
        ? L(
            "Nora keluar dan melihat rumah itu terbakar. Caleb tetap di dalam, dan melihat rumah itu utuh â€” dengan dua bayangan di setiap jendela.",
            "Nora walks out and sees the house burning. Caleb stays inside, and sees the house whole â€” with two shadows in every window.",
          )
        : L(
            "Caleb keluar dan melihat rumah itu terbakar. Nora tetap di dalam, dan melihat rumah itu utuh â€” dengan dua bayangan di setiap jendela.",
            "Caleb walks out and sees the house burning. Nora stays inside, and sees the house whole â€” with two shadows in every window.",
          ),
      L(
        "Di jalan, kau tidak pernah bisa menjelaskan mengapa bayangan pasanganmu selalu berjalan setengah langkah di depanmu.",
        "On the road, you can never explain why your partner's shadow always walks half a step ahead of you.",
      ),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*                                Journal                                     */
/* -------------------------------------------------------------------------- */

export function journalEntries(
  lang: Lang,
  role: Role,
  state: RoomState,
): Array<{ chapter: number; title: string; lines: string[]; result?: string }> {
  const entries: Array<{
    chapter: number;
    title: string;
    lines: string[];
    result?: string;
  }> = [];

  for (let chapter = 1; chapter <= Math.min(state.chapter, 6); chapter += 1) {
    const info = chapterInfo(chapter);
    if (!info) continue;
    const stages = buildStages(state).filter((stage) => stage.chapter === chapter);
    const lines: string[] = [];
    const results: string[] = [];

    for (const stage of stages) {
      lines.push(say(stage.title, lang));
      const clue = role === "A" ? stage.clueA : stage.clueB;
      const answer = state.puzzles[stage.id]?.[role];
      if (answer) lines.push(`Â· ${say(clue, lang)} â†’ ${answer}`);
      else lines.push(`Â· ${say(clue, lang)}`);
      if (state.puzzles[stage.id]?.solved) {
        results.push(say(stage.title, lang));
      }
    }

    entries.push({
      chapter,
      title: say(info.title, lang),
      lines,
      result:
        results.length > 0
          ? `${results.length}/${stages.length}`
          : undefined,
    });
  }

  return entries;
}
