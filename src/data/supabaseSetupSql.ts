export const SUPABASE_SETUP_SQL = `-- ====================================================================
-- SCRIPT SQL SUPABASE DATABASE - APLIKASI SAHABAT SPANJU (PASS TEMENAN)
-- UPT SMP NEGERI 7 PASURUAN
-- ====================================================================
-- Salin seluruh script ini dan jalankan di Supabase Dashboard > SQL Editor

-- 1. KELAS ZONA ANALYTICS
CREATE TABLE IF NOT EXISTS public.kelas_zona (
  id text PRIMARY KEY,
  kelas text UNIQUE,
  tingkat text,
  jumlahsiswa integer DEFAULT 0,
  totalkasustahunini integer DEFAULT 0,
  kasusterselesaikan integer DEFAULT 0,
  skorkeramahan numeric DEFAULT 100,
  statuszona text,
  walikelas text,
  dutaantibullying text,
  catatan text,
  terakhirdiperiksa text
);

-- 2. PIKET HARIAN
CREATE TABLE IF NOT EXISTS public.piket_harian (
  id text PRIMARY KEY,
  haritanggal text,
  waktu text,
  namaanggota text,
  kelas text,
  hasiltemuan text,
  linkfoto text,
  keterangan text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  createdat text
);

-- 3. SABTU BELI TEH CERI
CREATE TABLE IF NOT EXISTS public.sabtu_beli_teh_ceri (
  id text PRIMARY KEY,
  haritanggal text,
  waktu text,
  hasiltemuansatuminggu text,
  evaluasikegiatan text,
  rencanainovasi text,
  linkfoto text,
  keterangan text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  createdat text
);

-- 4. KEBUN LUAS BERSERI
CREATE TABLE IF NOT EXISTS public.kebun_luas_berseri (
  id text PRIMARY KEY,
  haritanggal text,
  waktu text,
  evaluasiprogramterlaksana text,
  evaluasikendalasolusi text,
  hasilinovasi text,
  produkkreatif text,
  rencanatindaklanjut jsonb DEFAULT '[]'::jsonb,
  keterangan text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  createdat text
);

-- 5. SENANDUNG SERASI
CREATE TABLE IF NOT EXISTS public.senandung_serasi (
  id text PRIMARY KEY,
  haritanggal text,
  waktu text,
  pesandisampaikan text,
  keterangan text,
  kategoriliterasi text,
  penulis text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  createdat text
);

-- 6. E-LAPOR KASUS BULLYING & KEKERASAN
CREATE TABLE IF NOT EXISTS public.e_lapor (
  id text PRIMARY KEY,
  kodelaporan text,
  haritanggal text,
  waktukejadian text,
  namasiswa text,
  kelas text,
  namasiswa2 text,
  kelas2 text,
  kronologikejadian text,
  kegiatanpenyadaran text,
  kegiatanpencegahan text,
  kegiatanpenangananrespon text,
  kegiatanpelaporan text,
  tindaklanjut text,
  keterangan text,
  status text,
  kategorikasus text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  tandatanganpetugasurl text,
  namapetugas text,
  createdat text
);

-- 7. SURAT KESEPAKATAN DAMAI (SP DAMAI)
CREATE TABLE IF NOT EXISTS public.sp_damai (
  id text PRIMARY KEY,
  nomorsurat text,
  haritanggal text,
  tempatmediasi text,
  namapihak1 text,
  kelaspihak1 text,
  nisnpihak1 text,
  peranpihak1 text,
  tandatanganpihak1 text,
  ttdpihak1 text,
  ispihak1locked boolean DEFAULT false,
  namapihak2 text,
  kelaspihak2 text,
  nisnpihak2 text,
  peranpihak2 text,
  tandatanganpihak2 text,
  ttdpihak2 text,
  ispihak2locked boolean DEFAULT false,
  ringkasanmasalah text,
  kesepakatan text,
  butirkesepakatan jsonb DEFAULT '[]'::jsonb,
  sanksiedukasi text,
  namasaksi text,
  ttdsaksi text,
  namakepalasekolah text,
  nipkepalasekolah text,
  namakonselorsebaya text,
  tandatangankonselorsebaya text,
  status text,
  hasilpemantauan text,
  createdat text
);

-- 8. BUKU TAMU DIGITAL
CREATE TABLE IF NOT EXISTS public.buku_tamu (
  id text PRIMARY KEY,
  haritanggal text,
  waktu text,
  jamkedatangan text,
  namatamu text,
  namalengkap text,
  nipnik text,
  jabatan text,
  asalinstansi text,
  instansiasal text,
  maksudkunjungan text,
  tujuankunjungan text,
  penerimatamu text,
  tandatanganurl text,
  namapenandatangan text,
  jabatanpenandatangan text,
  tindaklanjut text,
  keterangan text,
  createdat text
);

-- 9. MASTER SISWA 24 ROMBEL
CREATE TABLE IF NOT EXISTS public.master_siswa (
  id text PRIMARY KEY,
  nisn text,
  nama text,
  kelas text,
  jeniskelamin text,
  createdat text
);

-- 10. MASTER GURU & TPPK
CREATE TABLE IF NOT EXISTS public.master_guru (
  id text PRIMARY KEY,
  nip text,
  nama text,
  jabatan text,
  status text,
  statuskepegawaian text,
  createdat text
);

-- 11. MEDIA EDUKASI & MODUL
CREATE TABLE IF NOT EXISTS public.media_edukasi (
  id text PRIMARY KEY,
  judul text,
  deskripsi text,
  url text,
  durasi text,
  tipe text,
  kategori text,
  dokumentasimateriurl text,
  pesanedukatif text,
  thumbnailurl text,
  sumber text,
  tanggal text
);

-- 12. SURVEI KEPUASAN PELAYANAN
CREATE TABLE IF NOT EXISTS public.survei_kepuasan (
  id text PRIMARY KEY,
  namalengkap text,
  status text,
  jawaban jsonb DEFAULT '{}'::jsonb,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 text,
  q6 text,
  q7 text,
  q8 text,
  saranperbaikan text,
  createdat text
);

-- BUKA AKSES ROW LEVEL SECURITY (RLS) UNTUK PENULISAN & PEMBACAAN MULTI-USER DARI SELURUH PERANGKAT
DO $$ 
DECLARE 
  tbl text;
BEGIN
  FOR tbl IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Allow Public Read Write" ON public.%I;', tbl);
    EXECUTE format('CREATE POLICY "Allow Public Read Write" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;

-- AKTIFKAN REALTIME PUBLICATION SUPABASE AGAR DATA LANGSUNG TERUPDATE PADA PERANGKAT PENGGUNA LAIN
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      kelas_zona, piket_harian, sabtu_beli_teh_ceri, kebun_luas_berseri, 
      senandung_serasi, e_lapor, sp_damai, buku_tamu, master_siswa, 
      master_guru, media_edukasi, survei_kepuasan;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
`;
