-- ==============================================================================
-- PTPN BLOOD HEROES - EVENT FEEDBACK TABLE SCHEMA & MIGRATION
-- ==============================================================================
-- Jalankan skrip ini langsung pada SQL Editor di Supabase Dashboard.
-- ==============================================================================

-- 1. Buat Tabel event_feedback (jika belum ada)
CREATE TABLE IF NOT EXISTS public.event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    satisfaction_rating INTEGER NOT NULL CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 10),
    critique_and_suggestions TEXT NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('laki-laki', 'perempuan')),
    work_region TEXT,
    event_name TEXT DEFAULT 'PTPN Blood Heroes',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Jika tabel sudah ada sebelumnya, tambahkan kolom work_region
ALTER TABLE public.event_feedback ADD COLUMN IF NOT EXISTS work_region TEXT;

-- Komentar dokumentasi
COMMENT ON TABLE public.event_feedback IS 'Menyimpan respon feedback peserta acara (skala kepuasan 1-10, kritik/saran, nama, jenis kelamin, dan wilayah kerja).';
COMMENT ON COLUMN public.event_feedback.id IS 'Primary key UUID unik setiap submission.';
COMMENT ON COLUMN public.event_feedback.satisfaction_rating IS 'Tingkat kepuasan peserta terhadap acara pada skala 1 sampai 10.';
COMMENT ON COLUMN public.event_feedback.critique_and_suggestions IS 'Teks kritik dan saran dari peserta.';
COMMENT ON COLUMN public.event_feedback.full_name IS 'Nama lengkap peserta untuk personalisasi kartu ucapan.';
COMMENT ON COLUMN public.event_feedback.gender IS 'Jenis kelamin peserta (laki-laki / perempuan).';
COMMENT ON COLUMN public.event_feedback.work_region IS 'Wilayah kerja PT Perkebunan Nusantara yang dipilih oleh peserta.';

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

-- 4. Kebijakan Keamanan: Publik (anon) diizinkan INSERT
DROP POLICY IF EXISTS "Public can submit event feedback" ON public.event_feedback;
CREATE POLICY "Public can submit event feedback"
ON public.event_feedback
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. Kebijakan Keamanan: Hanya admin yang dapat SELECT seluruh data
DROP POLICY IF EXISTS "Authenticated users can read feedback" ON public.event_feedback;
CREATE POLICY "Authenticated users can read feedback"
ON public.event_feedback
FOR SELECT
TO authenticated
USING (true);
