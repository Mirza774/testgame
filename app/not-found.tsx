import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="kicker mb-4">404</div>
      <h1 className="font-display text-4xl text-bone">Pintu ini tidak ada.</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/45">
        Ruangan yang kau cari sudah ditelan rumah. Kembali ke depan, lalu buat
        atau masukkan kode rumah yang benar.
      </p>
      <Link href="/" className="btn btn-primary mt-7">
        Kembali ke depan
      </Link>
    </main>
  );
}
