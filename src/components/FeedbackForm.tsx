"use client";

import React, { useState } from "react";
import { User, Heart, AlertCircle, Sparkles, Send, MessageSquareHeart, GripHorizontal, Building2 } from "lucide-react";
import { Gender, EventFeedbackData } from "@/types/greeting-card";
import { validateAndSanitizeName } from "@/lib/utils";

export const WORK_REGIONS = [
  "PT Perkebunan Nusantara I (HO)",
  "PT Perkebunan Nusantara I (Reg 1)",
  "PT Perkebunan Nusantara I (Reg 2)",
  "PT Perkebunan Nusantara I (Reg 3)",
  "PT Perkebunan Nusantara I (Reg 5)",
  "PT Perkebunan Nusantara I (Reg 7)",
  "PT Perkebunan Nusantara I (Reg 8)",
  "PT Perkebunan Nusantara III",
  "PT. Sinergi Gula Nusantara",
  "PT Perkebunan Nusantara IV (HO)",
  "PT Perkebunan Nusantara IV (Reg 1)",
  "PT Perkebunan Nusantara IV (Reg 2)",
  "PT Perkebunan Nusantara IV (Reg 3)",
  "PT Perkebunan Nusantara IV (Reg 4)",
  "PT Perkebunan Nusantara IV (Reg 5)",
  "PT Perkebunan Nusantara IV (Reg 6)",
  "PT Perkebunan Nusantara IV (Reg 7)",
  "Lainnya",
] as const;

interface FeedbackFormProps {
  initialRating?: number | null;
  initialCritique?: string;
  initialName?: string;
  initialGender?: Gender;
  initialWorkRegion?: string;
  onSubmit: (data: EventFeedbackData) => Promise<void> | void;
  isLoading?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  initialRating = null,
  initialCritique = "",
  initialName = "",
  initialGender = "laki-laki",
  initialWorkRegion = "",
  onSubmit,
  isLoading = false,
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [critique, setCritique] = useState<string>(initialCritique);
  const [fullName, setFullName] = useState<string>(initialName);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [workRegion, setWorkRegion] = useState<string>(initialWorkRegion);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validasi Nama Lengkap
    const { isValid, error, sanitized } = validateAndSanitizeName(fullName);
    if (!isValid) {
      setErrorMessage(error || "Silakan masukkan nama lengkap Anda untuk kartu apresiasi.");
      const element = document.getElementById("question-recipient");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2. Validasi Jenis Kelamin
    if (!gender) {
      setErrorMessage("Silakan pilih jenis kelamin.");
      const element = document.getElementById("question-recipient");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 3. Validasi Wilayah Kerja
    if (!workRegion) {
      setErrorMessage("Silakan pilih wilayah kerja Anda.");
      const element = document.getElementById("question-recipient");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 4. Validasi Rating Kepuasan
    if (!rating) {
      setErrorMessage("Silakan pilih skala kepuasan Anda (angka 1 - 10).");
      const element = document.getElementById("question-rating");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 5. Validasi Kritik & Saran
    if (!critique.trim()) {
      setErrorMessage("Silakan isi kritik dan saran Anda untuk acara donor darah hari ini.");
      const element = document.getElementById("question-critique");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        satisfactionRating: rating,
        critiqueAndSuggestions: critique.trim(),
        fullName: sanitized,
        gender,
        workRegion,
        eventName: "PTPN Blood Heroes",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-fadeIn">
      {/* Alert Error jika ada field yang belum diisi */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 shadow-sm sticky top-20 z-20 backdrop-blur-md">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Mohon lengkapi formulir:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* CARD 1: HEADER FORM (Google Form Style dengan Top Accent Maroon) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/90 overflow-hidden relative">
        {/* Accent Bar Atas Khas Form Berwarna Maroon PTPN */}
        <div className="h-3 w-full bg-gradient-to-r from-ptpn-maroon via-ptpn-blood to-ptpn-maroon" />

        <div className="p-6 sm:p-8 space-y-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-montserrat font-bold text-gray-900 tracking-tight">
              FEEDBACK PTPN BLOOD HEROES
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Silakan lengkapi data penerima dan berikan penilaian serta masukan Anda terkait acara hari ini. Setelah mengirimkan formulir, Greeting Card apresiasi resmi Anda otomatis siap untuk diunduh.
            </p>
          </div>
        </div>
      </div>

      {/* FORM UTAMA */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* CARD 2: DATA PENERIMA GREETING CARD (POSISI DI ATAS) */}
        <div
          id="question-recipient"
          className="bg-white rounded-2xl shadow-sm border border-gray-200/90 p-6 space-y-5 hover:border-gray-300 transition-all"
        >
          <div className="border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-ptpn-maroon font-semibold text-sm sm:text-base">
              <MessageSquareHeart className="w-5 h-5 text-ptpn-blood" />
              <span>Data Penerima Greeting Card</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Nama ini akan dicetak langsung secara otomatis pada kartu apresiasi resmi Anda.
            </p>
          </div>

          {/* Input Nama Lengkap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="fullNameInput"
                className="block text-sm font-medium text-gray-900"
              >
                Nama Lengkap
                <span className="text-red-500 font-bold ml-1">*</span>
              </label>
              <span className="text-xs text-gray-400">
                {fullName.length}/80 karakter
              </span>
            </div>

            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="h-5 w-5 text-ptpn-maroon/60" />
              </div>
              <input
                type="text"
                id="fullNameInput"
                name="fullName"
                value={fullName}
                onChange={(e) => {
                  if (e.target.value.length <= 80) {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }
                }}
                placeholder="Masukkan Nama Lengkap"
                className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ptpn-maroon/20 focus:border-ptpn-maroon transition-all bg-gray-50/50 focus:bg-white"
                maxLength={80}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Pilihan Jenis Kelamin */}
          <div className="space-y-2">
            <label
              htmlFor="genderSelect"
              className="block text-sm font-medium text-gray-900"
            >
              Jenis Kelamin
              <span className="text-red-500 font-bold ml-1">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <select
                id="genderSelect"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ptpn-maroon/20 focus:border-ptpn-maroon transition-all bg-gray-50/50 focus:bg-white cursor-pointer"
                required
              >
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Dropdown Wilayah Kerja */}
          <div className="space-y-2">
            <label
              htmlFor="workRegionSelect"
              className="block text-sm font-medium text-gray-900"
            >
              Wilayah Kerja
              <span className="text-red-500 font-bold ml-1">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Building2 className="h-5 w-5 text-ptpn-maroon/60" />
              </div>
              <select
                id="workRegionSelect"
                name="workRegion"
                value={workRegion}
                onChange={(e) => {
                  setWorkRegion(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ptpn-maroon/20 focus:border-ptpn-maroon transition-all bg-gray-50/50 focus:bg-white cursor-pointer"
                required
              >
                <option value="" disabled>-- Pilih Wilayah Kerja --</option>
                {WORK_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CARD 3: PERTANYAAN 1 - SKALA KEPUASAN (1 - 10) */}
        <div
          id="question-rating"
          className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${!rating && errorMessage?.includes("skala kepuasan")
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200/90 hover:border-gray-300"
            }`}
        >
          <div className="space-y-4">
            <label className="block text-sm sm:text-base font-medium text-gray-900 leading-snug">
              Seberapa puas Anda terkait dengan acara donor darah hari ini?
              <span className="text-red-500 font-bold ml-1">*</span>
            </label>

            {/* Skala Rating 1 sampai 10 (Responsive Radio Row) */}
            <div className="pt-2">
              <div className="overflow-x-auto pb-3 -mx-2 px-2 scrollbar-none">
                <div className="min-w-[520px] sm:min-w-0 flex items-center justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium shrink-0 w-24 text-left">
                    Sangat Tidak Puas
                  </span>

                  <div className="flex items-center justify-between flex-1 px-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = rating === num;
                      return (
                        <label
                          key={num}
                          className="flex flex-col items-center gap-2 cursor-pointer group py-1 px-1.5"
                          onClick={() => {
                            setRating(num);
                            if (errorMessage) setErrorMessage(null);
                          }}
                        >
                          <span
                            className={`text-xs sm:text-sm font-semibold transition-colors ${isSelected ? "text-ptpn-maroon scale-110" : "text-gray-600 group-hover:text-gray-900"
                              }`}
                          >
                            {num}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                              ? "border-ptpn-maroon bg-ptpn-maroon/10"
                              : "border-gray-300 group-hover:border-gray-400 bg-white"
                              }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-ptpn-maroon" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="satisfactionRating"
                            value={num}
                            checked={isSelected}
                            onChange={() => {
                              setRating(num);
                              if (errorMessage) setErrorMessage(null);
                            }}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>

                  <span className="text-xs sm:text-sm text-gray-500 font-medium shrink-0 w-24 text-right">
                    Sangat Puas
                  </span>
                </div>
              </div>

              {/* Status Pilihan Terpilih */}
              {rating !== null && (
                <div className="mt-3 text-center text-xs font-semibold text-ptpn-maroon bg-rose-50/80 py-1.5 px-3 rounded-lg border border-rose-100/60 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nilai yang Anda pilih: <strong>{rating} dari 10</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 4: PERTANYAAN 2 - KRITIK & SARAN */}
        <div
          id="question-critique"
          className={`bg-white rounded-2xl shadow-sm border p-6 transition-all relative ${!critique.trim() && errorMessage?.includes("kritik dan saran")
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200/90 hover:border-gray-300"
            }`}
        >
          {/* Ikon Drag Handle Google Form */}
          <div className="flex justify-center -mt-3 mb-2 text-gray-300">
            <GripHorizontal className="w-5 h-5" />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="critiqueInput"
              className="block text-sm sm:text-base font-medium text-gray-900 leading-snug"
            >
              Berikan kritik dan saran untuk acara donor darah hari ini
              <span className="text-red-500 font-bold ml-1">*</span>
            </label>

            <div>
              <textarea
                id="critiqueInput"
                name="critique"
                rows={3}
                value={critique}
                onChange={(e) => {
                  setCritique(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Teks jawaban panjang"
                className="w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent border-0 border-b border-gray-300 focus:border-ptpn-maroon focus:ring-0 px-1 py-2.5 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white shadow-lg bg-gradient-to-r from-ptpn-maroon via-ptpn-blood to-ptpn-crimson hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base sm:text-lg group"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan Feedback & Menyiapkan Kartu...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Kirim Feedback & Dapatkan Greeting Card</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
