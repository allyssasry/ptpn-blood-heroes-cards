import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GreetingCardSetting } from "@/types/greeting-card";

// Konfigurasi default (fallback) jika Supabase belum terhubung atau aset storage belum diunggah
const FALLBACK_CONFIG: GreetingCardSetting = {
  id: "default-fallback-id",
  event_title: "PTPN Blood Heroes – Care in Action",
  event_tagline: "Setetes darah, sejuta harapan.",
  event_description:
    "Terima kasih atas kepedulian dan aksi nyata Anda dalam berbagi kehidupan bersama PT Perkebunan Nusantara III (Persero).",
  event_date: "2026-11-06",
  template_image_path: "/images/fallback-template.png",
  is_active: true,
  created_at: new Date().toISOString(),
};

/**
 * Cek apakah URL gambar storage dapat diakses (HTTP 200)
 */
async function isImageUrlAccessible(url: string): Promise<boolean> {
  if (url.startsWith("/")) return true;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Jika Supabase credentials belum diisi di environment variable
    if (!supabase) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        message: "Supabase environment variables not configured. Using local fallback config.",
        data: FALLBACK_CONFIG,
      });
    }

    // Query ke tabel greeting_card_settings untuk konfigurasi yang aktif
    const { data, error } = await supabase
      .from("greeting_card_settings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[API greeting-card-config] Supabase error:", error.message);
      return NextResponse.json(
        {
          success: true,
          source: "fallback",
          warning: "Gagal mengambil data dari Supabase. Menggunakan konfigurasi default.",
          data: FALLBACK_CONFIG,
        },
        { status: 200 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: true,
          source: "fallback",
          warning: "Konfigurasi aktif tidak ditemukan di database. Menggunakan konfigurasi default.",
          data: FALLBACK_CONFIG,
        },
        { status: 200 }
      );
    }

    // Resolve template_image_path jika berupa path di Supabase Storage
    let resolvedTemplateUrl = data.template_image_path;

    if (
      resolvedTemplateUrl &&
      !resolvedTemplateUrl.startsWith("http://") &&
      !resolvedTemplateUrl.startsWith("https://") &&
      !resolvedTemplateUrl.startsWith("/")
    ) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      resolvedTemplateUrl = `${supabaseUrl}/storage/v1/object/public/greeting-card-assets/${data.template_image_path}`;
    }

    // Validasi apakah aset gambar di Supabase Storage benar-benar sudah ada
    // Jika belum ada di bucket (404/400), otomatis gunakan template gambar lokal yang pasti ada
    const isAccessible = await isImageUrlAccessible(resolvedTemplateUrl);
    if (!isAccessible) {
      console.warn(
        `[API greeting-card-config] Gambar template "${resolvedTemplateUrl}" belum dapat diakses di Storage. Menggunakan fallback lokal.`
      );
      resolvedTemplateUrl = FALLBACK_CONFIG.template_image_path;
    }

    const responseData: GreetingCardSetting = {
      ...data,
      template_image_path: resolvedTemplateUrl,
    };

    return NextResponse.json({
      success: true,
      source: "supabase",
      data: responseData,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan internal server";
    console.error("[API greeting-card-config] Internal Exception:", errorMessage);

    return NextResponse.json(
      {
        success: true,
        source: "fallback",
        error: errorMessage,
        data: FALLBACK_CONFIG,
      },
      { status: 200 }
    );
  }
}
