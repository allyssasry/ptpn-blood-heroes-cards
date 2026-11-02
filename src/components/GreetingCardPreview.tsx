"use client";

import React, { useRef, useState, useEffect } from "react";
import GreetingCard from "./GreetingCard";
import DownloadButtons from "./DownloadButtons";
import { exportCardAsImage } from "@/lib/image-generator";
import { generateFileName } from "@/lib/utils";
import { DownloadFormat, GreetingCardSetting } from "@/types/greeting-card";
import { AlertCircle, CheckCircle2, ShieldCheck, Calendar, Sparkles } from "lucide-react";

interface GreetingCardPreviewProps {
  fullName: string;
  config: GreetingCardSetting | null;
  onEditName: () => void;
  onReset: () => void;
}

export const GreetingCardPreview: React.FC<GreetingCardPreviewProps> = ({
  fullName,
  config,
  onEditName,
  onReset,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Path template gambar: dari konfigurasi Supabase atau fallback lokal
  const templateUrl = config?.template_image_path || "/images/fallback-template.png";

  // Jaminan pengaman agar skeleton loader tidak pernah menggantung jika gambar cepat ter-cache
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImageReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async (format: DownloadFormat) => {
    if (!cardRef.current) return;

    try {
      setIsDownloading(true);
      setDownloadNotice(null);

      const fileName = generateFileName(fullName, format);

      // Ekspor kartu dengan resolusi tinggi (pixelRatio = 2) dan ukuran asli 1504 x 1007
      await exportCardAsImage(cardRef.current, format, fileName, {
        pixelRatio: 2,
        quality: 1.0,
      });

      setDownloadNotice(`Greeting Card berhasil disimpan sebagai "${fileName}".`);
      setTimeout(() => setDownloadNotice(null), 5000);
    } catch (err: unknown) {
      console.error("Kesalahan proses ekspor kartu:", err);
      setDownloadNotice(
        "Terjadi kendala saat mengunduh gambar. Silakan gunakan peramban modern atau coba lagi."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Kartu Header Status Apresiasi */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Greeting Card Siap Diunduh</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
          Kartu Apresiasi PTPN Blood Heroes
        </h2>
        <p className="text-sm text-gray-600">
          Dipersembahkan untuk <span className="font-bold text-ptpn-maroon">{fullName}</span> atas
          kontribusi mulia bagi sesama.
        </p>
      </div>

      {/* Kontainer Preview Kartu */}
      <div className="relative group">
        <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden border-2 border-white/80 ring-1 ring-black/5 bg-gray-100">
          {/* Skeleton / Loader saat gambar belum selesai dimuat */}
          {!isImageReady && !imageError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <div className="w-10 h-10 border-4 border-ptpn-maroon/20 border-t-ptpn-maroon rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium">Memuat template kartu...</p>
            </div>
          )}

          {/* Pesan Error jika template gagal dimuat */}
          {imageError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-50 p-6 text-center text-red-700">
              <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
              <p className="font-semibold text-base">Gagal memuat template greeting card</p>
              <p className="text-xs text-red-600 mt-1 max-w-md">
                Terjadi kendala saat mengambil gambar dari server. Silakan refresh halaman atau periksa koneksi internet Anda.
              </p>
            </div>
          )}

          {/* Elemen Greeting Card Asli yang dirender & diekspor */}
          <GreetingCard
            ref={cardRef}
            fullName={fullName}
            templateUrl={templateUrl}
            onImageLoad={() => setIsImageReady(true)}
            className="w-full"
          />
        </div>

        {/* Badge Dimensi Asli */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400 px-2">
          <span>Rasio Resmi Acara: 1504 × 1007 px</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            High Resolution Ready (2x)
          </span>
        </div>
      </div>

      {/* Notifikasi Sukses / Error Download */}
      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm text-center flex items-center justify-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Panel Tombol Download & Navigasi */}
      <DownloadButtons
        onDownload={handleDownload}
        onEditName={onEditName}
        onReset={onReset}
        isDownloading={isDownloading}
      />

      {/* Informasi Metadata Acara dari Supabase */}
      <div className="mt-8 pt-6 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 bg-white/60 p-4 rounded-xl border border-gray-100">
        <div className="flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-ptpn-maroon mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-700 block">Jadwal Acara Donor Darah</span>
            <span>{config?.event_date || "6 November 2026"}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-700 block">Keamanan & Privasi Data</span>
            <span>Nama diproses langsung di peramban Anda dan tidak disimpan ke server.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingCardPreview;

