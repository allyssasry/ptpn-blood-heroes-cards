"use client";

import React, { useState } from "react";
import { Download, Edit3, PlusCircle, Check, Loader2 } from "lucide-react";
import { DownloadFormat } from "@/types/greeting-card";

interface DownloadButtonsProps {
  onDownload: (format: DownloadFormat) => Promise<void>;
  onEditName: () => void;
  onReset: () => void;
  isDownloading?: boolean;
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  onDownload,
  onEditName,
  onReset,
  isDownloading = false,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<DownloadFormat | null>(null);
  const [downloadSuccessFormat, setDownloadSuccessFormat] = useState<DownloadFormat | null>(null);

  const handleDownloadClick = async (format: DownloadFormat) => {
    if (isDownloading || downloadingFormat) return;

    try {
      setDownloadingFormat(format);
      await onDownload(format);
      setDownloadSuccessFormat(format);
      setTimeout(() => {
        setDownloadSuccessFormat(null);
      }, 3000);
    } catch (err) {
      console.error("Gagal mendownload kartu:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Baris Tombol Download Utama (PNG & JPG) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Tombol Download PNG (Kualitas Maksimal) */}
        <button
          type="button"
          onClick={() => handleDownloadClick("png")}
          disabled={isDownloading || downloadingFormat !== null}
          className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-medium text-white shadow-md bg-ptpn-maroon hover:bg-ptpn-maroonDark active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
        >
          {downloadingFormat === "png" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses PNG (1504×1007)...</span>
            </>
          ) : downloadSuccessFormat === "png" ? (
            <>
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base leading-tight">
                  Download PNG
                </div>
                <div className="text-[11px] text-rose-200">Kualitas Tinggi (1504 × 1007)</div>
              </div>
            </>
          )}
        </button>

        {/* Tombol Download JPG (Ukuran Lebih Ringan) */}
        <button
          type="button"
          onClick={() => handleDownloadClick("jpg")}
          disabled={isDownloading || downloadingFormat !== null}
          className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-medium text-white shadow-md bg-ptpn-blood hover:bg-ptpn-crimson active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
        >
          {downloadingFormat === "jpg" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses JPG...</span>
            </>
          ) : downloadSuccessFormat === "jpg" ? (
            <>
              <Check className="w-5 h-5 text-emerald-300" />
              <span>Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base leading-tight">
                  Download JPG
                </div>
                <div className="text-[11px] text-rose-200">Format Kompak & Siap Dibagikan</div>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Baris Tombol Aksi Tambahan: Edit Nama & Buat Baru */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onEditName}
          disabled={isDownloading || downloadingFormat !== null}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-60"
        >
          <Edit3 className="w-4 h-4 text-ptpn-maroon" />
          <span>Edit Feedback & Nama</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={isDownloading || downloadingFormat !== null}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium text-ptpn-blood bg-ptpn-roseSoft/60 border border-ptpn-pinkSoft hover:bg-ptpn-roseSoft active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-60"
        >
          <PlusCircle className="w-4 h-4 text-ptpn-blood" />
          <span>Buat Greeting Card Baru</span>
        </button>
      </div>
    </div>
  );
};

export default DownloadButtons;

