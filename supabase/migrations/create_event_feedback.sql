-- ==============================================================================
-- PTPN BLOOD HEROES / NUSANTARUN - EVENT FEEDBACK TABLE SCHEMA
-- ==============================================================================
-- Jalankan skrip ini langsung pada SQL Editor di Supabase Dashboard.
-- Skrip ini akan membuat tabel penampung feedback acara, mengaktifkan RLS,
-- dan memberikan izin INSERT bagi publik (anonim) agar formulir feedback dapat
-- menyimpan data langsung ke database Supabase Anda.
-- ==============================================================================

-- 1. Buat Tabel event_feedback
CREATE TABLE IF NOT EXISTS public.event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    satisfaction_rating INTEGER NOT NULL CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
    critique_and_suggestions TEXT NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('laki-laki', 'perempuan')),
    event_name TEXT DEFAULT 'Nusantarun / PTPN Blood Heroes',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Komentar dokumentasi
COMMENT ON TABLE public.event_feedback IS 'Menyimpan respon feedback peserta acara (skala kepuasan 1-10 dan kritik/saran) sebelum mengunduh greeting card.';
COMMENT ON COLUMN public.event_feedback.id IS 'Primary key UUID unik setiap submission.';
COMMENT ON COLUMN public.event_feedback.satisfaction_rating IS 'Tingkat kepuasan peserta terhadap acara pada skala 1 sampai 10.';
COMMENT ON COLUMN public.event_feedback.critique_and_suggestions IS 'Teks kritik dan saran dari peserta.';
COMMENT ON COLUMN public.event_feedback.full_name IS 'Nama lengkap peserta untuk personalisasi kartu ucapan.';
COMMENT ON COLUMN public.event_feedback.gender IS 'Jenis kelamin peserta (laki-laki / perempuan).';

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan RLS
-- Kebijakan 1: Pengguna publik / pengunjung web (anon) DIIZINKAN untuk memasukkan (INSERT) data feedback
DROP POLICY IF EXISTS "Public can submit event feedback" ON public.event_feedback;
CREATE POLICY "Public can submit event feedback"
ON public.event_feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Kebijakan 2: Hanya akun admin (authenticated) yang dapat MEMBACA seluruh data feedback
-- (Data kritik & saran tidak bisa dibaca oleh peserta umum demi menjaga kerahasiaan)
DROP POLICY IF EXISTS "Authenticated users can read feedback" ON public.event_feedback;
CREATE POLICY "Authenticated users can read feedback"
ON public.event_feedback
FOR SELECT
TO authenticated
USING (true);

