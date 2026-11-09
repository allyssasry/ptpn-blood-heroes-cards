import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FFF8F8]">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-6">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#6B0F1A] text-white font-medium hover:bg-[#4A0810] transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
