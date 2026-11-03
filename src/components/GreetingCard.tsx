"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { Gender } from "@/types/greeting-card";
import { formatCardName } from "@/lib/utils";

interface GreetingCardProps {
  fullName: string;
  gender?: Gender;
  templateUrl?: string;
  onImageLoad?: () => void;
  className?: string;
}

/**
 * Komponen inti Greeting Card PTPN Blood Heroes.
 * Mempertahankan 100% elemen grafis template resmi asli dan menambahkan teks
 * dinamis "Sdr. [Nama]" atau "Sdri. [Nama]" di posisi bawah tulisan "PAHLAWAN DONOR DARAH"
 * dan di atas kalimat "Setetes darah, sejuta harapan.".
 *
 * Menggunakan Container Queries (cqw) agar ukuran font tetap proporsional dan presisi
 * di layar smartphone maupun desktop tanpa distorsi.
 */
export const GreetingCard = forwardRef<HTMLDivElement, GreetingCardProps>(
  (
    {
      fullName,
      gender = "laki-laki",
      templateUrl = "/images/fallback-template.png",
      onImageLoad,
      className = "",
    },
    ref
  ) => {
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

    // Format teks tampilan sesuai jenis kelamin (Sdr. / Sdri.)
    const displayName = formatCardName(fullName, gender);
    const nameLength = displayName.length;

    // Kalkulasi ukuran teks proporsional dengan lebar kartu (cqw - container query width)
    // Menjamin teks selalu stabil dan tidak kekecilan di smartphone maupun kebesaran di desktop
    const getFontSizeStyle = () => {
      if (nameLength > 55) {
        return {
          fontSize: "clamp(9px, 1.45cqw, 22px)",
          lineHeight: 1.2,
        };
      }
      if (nameLength > 35) {
        return {
          fontSize: "clamp(10.5px, 1.75cqw, 26px)",
          lineHeight: 1.25,
        };
      }
      if (nameLength > 20) {
        return {
          fontSize: "clamp(11.5px, 1.95cqw, 29px)",
          lineHeight: 1.3,
        };
      }
      return {
        fontSize: "clamp(12.5px, 2.15cqw, 32px)",
        lineHeight: 1.35,
      };
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
          containerType: "inline-size",
        }}
      >
        {/* Template Image Asli Sebagai Background */}
        <div className="relative w-full h-full">
          {/* Menggunakan tag img standar agar kompatibel sempurna dengan canvas & peramban mobile */}
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
          {/* Posisi: Tepat DI BAWAH tulisan "PAHLAWAN DONOR DARAH" (~52.5%) dan DI ATAS "Setetes darah, sejuta harapan." (~64.5%) */}
          {/* Sumbu Horizontal: 53.5% agar presisi di tengah-tengah teks judul */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
            style={{
              left: "53.5%",
              top: "58.2%",
              width: "58%", // Batas lebar aman
              maxHeight: "8.5%",
            }}
          >
            <p
              data-card-name
              className="font-bold tracking-tight text-ptpn-maroon transition-all duration-300 font-montserrat"
              style={{
                fontFamily: 'var(--font-montserrat), "Poppins", "Montserrat", sans-serif',
                color: "#6B0F1A",
                textShadow:
                  "0 0 10px rgba(255, 255, 255, 0.95), 0 0 5px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(255, 255, 255, 0.8)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
                ...getFontSizeStyle(),
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
