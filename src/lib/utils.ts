import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Gender } from "@/types/greeting-card";

/**
 * Utility untuk menggabungkan class Tailwind CSS dengan rapi dan menghindari konflik
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validasi dan pembersihan (sanitize) input nama pengguna
 * - Menghilangkan spasi di awal dan akhir
 * - Mengubah multiple spaces menjadi single space
 * - Memastikan nama tidak kosong
 * - Membatasi panjang maksimal 80 karakter
 */
export function validateAndSanitizeName(name: string): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} {
  if (!name) {
    return {
      isValid: false,
      error: "Nama lengkap wajib diisi.",
      sanitized: "",
    };
  }

  // Bersihkan spasi berlebih di awal, akhir, dan antar kata
  const sanitized = name.trim().replace(/\s+/g, " ");

  if (sanitized.length === 0) {
    return {
      isValid: false,
      error: "Nama lengkap tidak boleh hanya berisi spasi.",
      sanitized: "",
    };
  }

  if (sanitized.length < 2) {
    return {
      isValid: false,
      error: "Nama minimal terdiri dari 2 karakter.",
      sanitized,
    };
  }

  if (sanitized.length > 80) {
    return {
      isValid: false,
      error: "Nama lengkap maksimal 80 karakter.",
      sanitized: sanitized.slice(0, 80),
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Menghasilkan nama file hasil download sesuai spesifikasi:
 * Format: PTPN-Blood-Heroes-[Nama-Pengguna].[ext]
 */
export function generateFileName(fullName: string, extension: "png" | "jpg"): string {
  // Ganti spasi atau karakter non-alfanumerik aman dengan tanda minus
  const safeName = fullName
    .trim()
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .replace(/\s+/g, "-");

  const finalName = safeName.length > 0 ? safeName : "Pahlawan";
  return `PTPN-Blood-Heroes-${finalName}.${extension}`;
}

/**
 * Format panggilan nama pada greeting card sesuai jenis kelamin:
 * - Perempuan: Sdri. [Nama Lengkap]
 * - Laki-laki: Sdr. [Nama Lengkap]
 */
export function formatCardName(fullName: string, gender?: Gender | string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "Pahlawan Donor Darah";

  const isFemale = gender === "perempuan";
  const prefix = isFemale ? "Sdri." : "Sdr.";
  return `${prefix} ${trimmed}`;
}

