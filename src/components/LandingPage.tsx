"use client";

import React, { useState, useEffect } from "react";
import NameInputForm from "./NameInputForm";
import GreetingCardPreview from "./GreetingCardPreview";
import { GreetingCardSetting } from "@/types/greeting-card";
import { Heart, Award, Shield, Sparkles } from "lucide-react";

export const LandingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"input" | "preview">("input");
  const [fullName, setFullName] = useState<string>("");
  const [config, setConfig] = useState<GreetingCardSetting | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);
  const [configSource, setConfigSource] = useState<"supabase" | "fallback">("fallback");

  // Mengambil konfigurasi acara dari API Route Supabase saat komponen pertama kali dimuat
  useEffect(() => {
    async function fetchConfig() {
      try {
        setIsLoadingConfig(true);
        const res = await fetch("/api/greeting-card-config");
        const json = await res.json();

        if (json.success && json.data) {
          setConfig(json.data);
          setConfigSource(json.source || "supabase");
        }
      } catch (err) {
        console.warn("Gagal memuat konfigurasi dari API, menggunakan default fallback:", err);
      } finally {
        setIsLoadingConfig(false);
      }
    }

    fetchConfig();
  }, []);

  const handleNameSubmit = (sanitizedName: string) => {
    setFullName(sanitizedName);
    setCurrentStep("preview");
    // Scroll lembut ke atas untuk melihat preview kartu
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditName = () => {
    setCurrentStep("input");
  };

  const handleReset = () => {
    setFullName("");
    setCurrentStep("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F8] via-[#FFF1F2] to-[#FCE7EC] text-gray-800 flex flex-col justify-between selection:bg-ptpn-maroon selection:text-white">
      {/* Background Decorative Blur Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar / Branding */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-rose-100/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Brand Acara */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-ptpn-maroon to-ptpn-blood flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-serif font-bold text-base sm:text-lg text-ptpn-maroon block leading-tight">
                PTPN Blood Heroes
              </span>
              <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                Care in Action • PT Perkebunan Nusantara III (Persero)
              </span>
            </div>
          </div>

          {/* Status Badge Supabase / Live */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-white/90 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                configSource === "supabase" ? "bg-emerald-500" : "bg-amber-400"
              } animate-ping`}
            />
            <span className="font-medium text-gray-700">
              {configSource === "supabase" ? "Supabase Cloud Connected" : "Siap Digunakan"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {currentStep === "input" ? (
          <div className="space-y-10 animate-fadeIn">
            {/* Form Input Nama */}
            <NameInputForm
              initialName={fullName}
              onSubmit={handleNameSubmit}
              isLoading={isLoadingConfig}
            />

            {/* Nilai-nilai Acara PTPN Blood Heroes */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-rose-100/60 shadow-sm text-center space-y-1.5">
                <div className="w-8 h-8 mx-auto rounded-lg bg-ptpn-roseSoft flex items-center justify-center text-ptpn-maroon">
                  <Heart className="w-4 h-4 fill-ptpn-blood text-ptpn-blood" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-800">Aksi Berbagi Hidup</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  Setetes darah Anda menyelamatkan kehidupan sesama saudara kita.
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-rose-100/60 shadow-sm text-center space-y-1.5">
                <div className="w-8 h-8 mx-auto rounded-lg bg-ptpn-roseSoft flex items-center justify-center text-ptpn-maroon">
                  <Award className="w-4 h-4 text-ptpn-blood" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-800">Apresiasi Resmi</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  Kartu digital resmi dari Direksi SDM & Umum PTPN III (Persero).
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-rose-100/60 shadow-sm text-center space-y-1.5">
                <div className="w-8 h-8 mx-auto rounded-lg bg-ptpn-roseSoft flex items-center justify-center text-ptpn-maroon">
                  <Sparkles className="w-4 h-4 text-ptpn-maroon" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-gray-800">Instan & Mudah</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-snug">
                  Cukup ketik nama Anda dan unduh kartu langsung beresolusi tinggi.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Greeting Card & Download */
          <GreetingCardPreview
            fullName={fullName}
            config={config}
            onEditName={handleEditName}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer Acara */}
      <footer className="w-full bg-white/70 backdrop-blur-md border-t border-rose-100/80 py-6 sm:py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="font-semibold text-gray-700">
              PTPN Blood Heroes – Care in Action © 2026
            </p>
            <p>PT Perkebunan Nusantara III (Persero) • Palang Merah Indonesia</p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-ptpn-blood" />
              Bebas Registrasi & Data Pribadi Aman
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

