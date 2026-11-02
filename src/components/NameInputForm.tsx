"use client";

import React, { useState } from "react";
import { User, Sparkles, Heart, AlertCircle } from "lucide-react";
import { validateAndSanitizeName } from "@/lib/utils";

interface NameInputFormProps {
  initialName?: string;
  onSubmit: (sanitizedName: string) => void;
  isLoading?: boolean;
}

export const NameInputForm: React.FC<NameInputFormProps> = ({
  initialName = "",
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialName);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, error, sanitized } = validateAndSanitizeName(name);

    if (!isValid) {
      setErrorMessage(error || "Silakan masukkan nama lengkap Anda.");
      return;
    }

    setErrorMessage(null);
    onSubmit(sanitized);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 80) {
      setName(val);
      if (errorMessage) setErrorMessage(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-ptpn-pinkSoft/60 p-6 sm:p-8 transition-all hover:shadow-2xl">
      {/* Header Form */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ptpn-roseSoft border border-ptpn-pinkSoft text-ptpn-maroon text-xs sm:text-sm font-medium tracking-wide">
          <Heart className="w-4 h-4 text-ptpn-blood fill-ptpn-blood animate-pulse" />
          <span>PTPN Blood Heroes • Care in Action</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-gray-900 tracking-tight">
          A Special Appreciation for You
        </h1>

        <p className="text-base sm:text-lg font-medium text-ptpn-blood">
          Setetes Darah, Sejuta Harapan.
        </p>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Terima kasih telah menjadi bagian dari aksi kepedulian dan berbagi kehidupan bersama{" "}
          <span className="font-semibold text-gray-800">PTPN Blood Heroes</span>.
        </p>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-800"
            >
              Nama Lengkap
            </label>
            <span className="text-xs text-gray-400">
              {name.length}/80 karakter
            </span>
          </div>

          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User className="h-5 w-5 text-ptpn-maroon/60" />
            </div>

            <input
              type="text"
              id="fullName"
              name="fullName"
              value={name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              autoComplete="name"
              maxLength={80}
              className={`block w-full pl-11 pr-4 py-3 sm:py-3.5 text-gray-900 text-sm sm:text-base rounded-xl border bg-gray-50/50 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                errorMessage
                  ? "border-red-400 focus:ring-red-400/30"
                  : "border-gray-200 focus:border-ptpn-maroon focus:ring-ptpn-blood/20"
              }`}
            />
          </div>

          {/* Pesan Validasi Error */}
          {errorMessage && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-red-600 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium text-white shadow-lg bg-gradient-to-r from-ptpn-maroon to-ptpn-blood hover:from-ptpn-maroonDark hover:to-ptpn-crimson transition-all duration-300 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyiapkan Greeting Card...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm sm:text-base font-semibold tracking-wide">
                Lihat Greeting Card
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer Info Tambahan */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
        <span>PT Perkebunan Nusantara III (Persero)</span>
        <span>•</span>
        <span>6 November 2026</span>
      </div>
    </div>
  );
};

export default NameInputForm;

