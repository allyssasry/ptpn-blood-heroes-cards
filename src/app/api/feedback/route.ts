import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { satisfactionRating, critiqueAndSuggestions, fullName, gender, eventName } = body;

    // Validasi data input
    const ratingNum = Number(satisfactionRating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 10) {
      return NextResponse.json(
        { success: false, error: "Skala kepuasan harus dipilih antara 1 sampai 10." },
        { status: 400 }
      );
    }

    if (!critiqueAndSuggestions || typeof critiqueAndSuggestions !== "string" || !critiqueAndSuggestions.trim()) {
      return NextResponse.json(
        { success: false, error: "Kritik dan saran wajib diisi." },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!gender || (gender !== "laki-laki" && gender !== "perempuan")) {
      return NextResponse.json(
        { success: false, error: "Jenis kelamin wajib dipilih." },
        { status: 400 }
      );
    }

    const sanitizedData = {
      satisfaction_rating: ratingNum,
      critique_and_suggestions: critiqueAndSuggestions.trim(),
      full_name: fullName.trim(),
      gender: gender,
      event_name: eventName || "Nusantarun / PTPN Blood Heroes",
    };

    const supabase = createServerSupabaseClient();

    // Jika Supabase belum dikonfigurasi, tetap kembalikan success agar pengguna tidak terhambat mendapatkan kartu
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: "Feedback diterima (mode fallback/lokal).",
        storedInDb: false,
      });
    }

    // Coba simpan ke tabel event_feedback
    const { error } = await supabase.from("event_feedback").insert([sanitizedData]);

    if (error) {
      console.warn(
        "[API Feedback] Catatan: Gagal menyimpan ke Supabase (tabel mungkin belum dibuat):",
        error.message
      );
      // Tetap kembalikan success: true agar user experience tetap mulus
      return NextResponse.json({
        success: true,
        message: "Feedback diproses secara lokal.",
        storedInDb: false,
        warning: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Feedback berhasil disimpan ke Supabase.",
      storedInDb: true,
    });
  } catch (error: unknown) {
    console.error("[API Feedback] Error tidak terduga:", error);
    // Graceful fallback: jangan halangi peserta membuka kartu
    return NextResponse.json({
      success: true,
      message: "Feedback diproses.",
      storedInDb: false,
    });
  }
}
