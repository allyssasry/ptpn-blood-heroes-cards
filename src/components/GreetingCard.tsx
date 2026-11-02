"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";

interface GreetingCardProps {
  fullName: string;
  templateUrl?: string;
  onImageLoad?: () => void;
  className?: string;
}

/**
 * Komponen inti Greeting Card PTPN Blood Heroes.
 * Mempertahankan 100% elemen grafis template resmi asli dan menambahkan teks
 * dinamis "Dear [Nama Pengguna]," di posisi tengah kartu secara proporsional.
 */
export const GreetingCard = forwardRef<HTMLDivElement, GreetingCardProps>(
  ({ fullName, templateUrl = "/images/fallback-template.png", onImageLoad, className = "" }, ref) => {
    const [imgSrc, setImgSrc] = useState<string>(templateUrl || "/images/fallback-template.png");
    const imageElementRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      setImgSrc(templateUrl || "/images/fallback-template.png");
    }, [templateUrl]);

    // Jika gambar sudah selesai dimuat dari cache peramban
    useEffect(() => {
      if (
        imageElementRef.current &&
        imageElementRef.current.complete &&
        imageElementRef.current.naturalWidth > 0
      ) {
        onImageLoad?.();
      }
    }, [imgSrc, onImageLoad]);

    // Format teks tampilan
    const displayName = fullName.trim() ? `Dear ${fullName.trim()},` : "Dear Pahlawan Donor Darah,";
    const nameLength = displayName.length;

    // Kalkulasi ukuran teks adaptif agar tidak bertabrakan dengan elemen lain
    const getFontSizeClasses = () => {
      if (nameLength > 55) {
        return "text-[10px] sm:text-xs md:text-sm lg:text-[15px] leading-tight";
      }
      if (nameLength > 35) {
        return "text-xs sm:text-sm md:text-base lg:text-lg leading-tight";
      }
      if (nameLength > 20) {
        return "text-sm sm:text-base md:text-lg lg:text-xl leading-snug";
      }
      return "text-base sm:text-lg md:text-xl lg:text-2xl leading-normal";
    };

    const handleImageError = () => {
      console.warn("Template gagal dimuat dari remote URL, otomatis beralih ke template lokal.");
      if (imgSrc !== "/images/fallback-template.png") {
        setImgSrc("/images/fallback-template.png");
      }
    };

    const handleImageSuccess = () => {
      onImageLoad?.();
    };

    return (
      <div
        ref={ref}
        id="greeting-card-element"
        className={`relative w-full overflow-hidden bg-white select-none ${className}`}
        style={{
          aspectRatio: "1504 / 1007",
        }}
      >
        {/* Template Image Asli Sebagai Background */}
        <div className="relative w-full h-full">
          {/* Menggunakan tag img standar agar kompatibel sempurna dengan html-to-image & canvas */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageElementRef}
            src={imgSrc}
            alt="PTPN Blood Heroes Greeting Card Template"
            className="w-full h-full object-cover block"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
            loading="eager"
            decoding="sync"
            crossOrigin="anonymous"
            onLoad={handleImageSuccess}
            onError={handleImageError}
          />

          {/* Area Teks Dinamis Personalisasi Nama */}
          {/* Posisi: Di atas tulisan "Terima Kasih" (~47%) dan di bawah pita "Care in Action" (~33%) */}
          {/* Sumbu Horizontal diselaraskan ke 53.5% agar presisi di tengah "Care in Action" dan "Terima Kasih" */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            style={{
              left: "53.5%",
              top: "39.8%",
              width: "56%", // Batas lebar aman agar tidak menabrak lereng bukit di kiri & ornamen hati di kanan
              maxHeight: "10%",
            }}
          >
            <p
              data-card-name
              className={`font-bold tracking-normal text-ptpn-maroon transition-all duration-300 font-serif ${getFontSizeClasses()}`}
              style={{
                color: "#6B0F1A",
                textShadow:
                  "0 0 10px rgba(255, 255, 255, 0.95), 0 0 5px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(255, 255, 255, 0.8)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {displayName}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

GreetingCard.displayName = "GreetingCard";
export default GreetingCard;
