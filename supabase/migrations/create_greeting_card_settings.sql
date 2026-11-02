-- ==============================================================================
-- PTPN BLOOD HEROES - GREETING CARD SETTINGS SCHEMA & STORAGE CONFIGURATION
-- ==============================================================================
-- Jalankan skrip ini langsung pada SQL Editor di Supabase Dashboard.
-- Skrip ini akan membuat tabel, mengaktifkan RLS, mengatur kebijakan keamanan (policies),
-- membuat storage bucket untuk template gambar, dan memasukkan data konfigurasi awal.
-- ==============================================================================

-- 1. Buat Tabel greeting_card_settings
CREATE TABLE IF NOT EXISTS public.greeting_card_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_title TEXT NOT NULL,
    event_tagline TEXT,
    event_description TEXT,
    event_date DATE NOT NULL DEFAULT '2026-11-06',
    template_image_path TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Berikan komentar dokumentasi pada tabel dan kolom
COMMENT ON TABLE public.greeting_card_settings IS 'Menyimpan konfigurasi acara dan path template greeting card PTPN Blood Heroes.';
COMMENT ON COLUMN public.greeting_card_settings.id IS 'Primary key UUID unik untuk setiap konfigurasi.';
COMMENT ON COLUMN public.greeting_card_settings.event_title IS 'Judul acara PTPN Blood Heroes.';
COMMENT ON COLUMN public.greeting_card_settings.event_tagline IS 'Tagline resmi acara.';
COMMENT ON COLUMN public.greeting_card_settings.event_description IS 'Deskripsi apresiasi untuk para pendonor darah.';
COMMENT ON COLUMN public.greeting_card_settings.event_date IS 'Tanggal pelaksanaan acara.';
COMMENT ON COLUMN public.greeting_card_settings.template_image_path IS 'Nama file atau path URL gambar template pada Supabase Storage.';
COMMENT ON COLUMN public.greeting_card_settings.is_active IS 'Status aktif konfigurasi (hanya konfigurasi aktif yang dimuat oleh publik).';

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.greeting_card_settings ENABLE ROW LEVEL SECURITY;

-- 3. Buat Policy Keamanan RLS
-- Kebijakan 1: Siapapun (publik/anon) HANYA diizinkan MEMBACA konfigurasi yang berstatus aktif (is_active = TRUE)
DROP POLICY IF EXISTS "Public can only read active greeting card settings" ON public.greeting_card_settings;
CREATE POLICY "Public can only read active greeting card settings"
ON public.greeting_card_settings
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Kebijakan 2: Mencegah publik/anon melakukan penambahan, perubahan, atau penghapusan data
-- (Secara default, jika tidak ada policy INSERT/UPDATE/DELETE untuk role 'anon', operasi tersebut akan ditolak oleh Postgres RLS)

-- 4. Setup Supabase Storage Bucket 'greeting-card-assets'
-- Sisipkan bucket jika belum tersedia
INSERT INTO storage.buckets (id, name, public)
VALUES ('greeting-card-assets', 'greeting-card-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan Akses Storage: Publik dapat membaca dan mengunduh file template di bucket 'greeting-card-assets'
DROP POLICY IF EXISTS "Public can view greeting card assets" ON storage.objects;
CREATE POLICY "Public can view greeting card assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'greeting-card-assets');

-- 5. Masukkan Data Konfigurasi Awal (Seed Data)
INSERT INTO public.greeting_card_settings (
    event_title,
    event_tagline,
    event_description,
    event_date,
    template_image_path,
    is_active
) VALUES (
    'PTPN Blood Heroes – Care in Action',
    'Setetes darah, sejuta harapan.',
    'Terima kasih atas kepedulian dan aksi nyata Anda dalam berbagi kehidupan.',
    '2026-11-06',
    'template.jpg',
    TRUE
)
ON CONFLICT DO NOTHING;

