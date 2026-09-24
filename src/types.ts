export type UserRole = 'admin' | 'operator' | 'guru' | 'siswa' | 'orangtua' | 'tamu';

export interface UserProfile {
  username?: string;
  name?: string;
  id?: string;
  nama?: string;
  role: UserRole;
  avatar?: string;
  jabatan?: string;
  nip?: string;
}

export type ActiveTab =
  | 'menu'
  | 'menu_utama'
  | 'zona_hijau'
  | 'piket_harian'
  | 'sabtu_beli_teh_ceri'
  | 'kebun_luas_berseri'
  | 'senandung_serasi'
  | 'e_lapor'
  | 'sp_damai'
  | 'buku_tamu'
  | 'media_edukasi'
  | 'bagan_alur'
  | 'infografis'
  | 'tutorial'
  | 'hotline'
  | 'master_siswa'
  | 'master_guru'
  | 'survey_kepuasan';

export interface PiketRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  namaAnggota: string;
  kelas: string;
  hasilTemuan: string;
  linkFoto: string;
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface CeriRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  hasilTemuanSatuMinggu: string;
  evaluasiKegiatan: string;
  rencanaInovasi: string;
  linkFoto: string;
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface RTLItem {
  id: string;
  programKegiatan: string;
  pic: string;
  targetPelaksanaan: string;
  deadline: string;
}

export interface KebunRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  evaluasiProgramTerlaksana: string;
  evaluasiKendalaSolusi: string;
  hasilInovasi: string;
  produkKreatif: string;
  rencanaTindakLanjut: RTLItem[];
  keterangan: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface SerasiRecord {
  id: string;
  hariTanggal: string;
  waktu: string;
  pesanDisampaikan: string;
  keterangan: string;
  kategoriLiterasi: string;
  penulis: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  createdAt: string;
}

export interface ELaporRecord {
  id: string;
  kodeLaporan: string;
  hariTanggal: string;
  waktuKejadian: string;
  namaSiswa: string;
  kelas: string;
  namaSiswa2?: string;
  kelas2?: string;
  kronologiKejadian: string;
  kegiatanPenyadaran: string;
  kegiatanPencegahan: string;
  kegiatanPenangananRespon: string;
  kegiatanPelaporan: string;
  tindakLanjut: string;
  keterangan: string;
  status: 'Investigasi' | 'Mediasi' | 'Selesai' | 'Terpantau Aman';
  kategoriKasus: 'Verbal' | 'Fisik' | 'Siber' | 'Sosial/Relasional' | 'Lainnya';
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  tandaTanganPetugasUrl?: string;
  namaPetugas?: string;
  createdAt: string;
}

export interface SPDamaiRecord {
  id: string;
  nomorSurat: string;
  hariTanggal: string;
  tempatMediasi?: string;
  namaPihak1: string;
  kelasPihak1: string;
  nisnPihak1?: string;
  peranPihak1?: string;
  tandaTanganPihak1?: string;
  ttdPihak1?: string;
  isPihak1Locked?: boolean;
  namaPihak2: string;
  kelasPihak2: string;
  nisnPihak2?: string;
  peranPihak2?: string;
  tandaTanganPihak2?: string;
  ttdPihak2?: string;
  isPihak2Locked?: boolean;
  ringkasanMasalah?: string;
  kesepakatan?: string;
  butirKesepakatan?: string[];
  sanksiEdukasi?: string;
  namaSaksi?: string;
  ttdSaksi?: string;
  namaKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  namaKonselorSebaya?: string;
  tandaTanganKonselorSebaya?: string;
  status?: 'Damai & Tuntas' | 'Dalam Pemantauan' | 'Proses Mediasi' | string;
  hasilPemantauan?: string;
  createdAt: string;
}

export interface BukuTamuRecord {
  id: string;
  hariTanggal: string;
  waktu?: string;
  jamKedatangan?: string;
  namaTamu?: string;
  namaLengkap?: string;
  nipNik?: string;
  jabatan?: string;
  asalInstansi?: string;
  instansiAsal?: string;
  maksudKunjungan?: string;
  tujuanKunjungan?: string;
  penerimaTamu?: string;
  tandaTanganUrl?: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  tindakLanjut?: string;
  keterangan?: string;
  createdAt: string;
}

export interface MediaEdukasiItem {
  id: string;
  judul: string;
  deskripsi?: string;
  url?: string;
  durasi?: string;
  tipe?: string;
  kategori?: 'Video' | 'Modul' | 'Infografis' | 'Regulasi' | string;
  dokumentasiMateriUrl?: string;
  pesanEdukatif?: string;
  thumbnailUrl?: string;
  sumber?: string;
  tanggal?: string;
}

export interface KelasZona {
  kelas: string;
  tingkat: '7' | '8' | '9';
  jumlahSiswa: number;
  totalKasusTahunIni: number;
  kasusTerselesaikan: number;
  skorKeramahan: number;
  statusZona: 'Zona Hijau (Aman)' | 'Zona Kuning (Waspada)' | 'Zona Merah (Perhatian Khusus)';
  waliKelas: string;
  dutaAntiBullying: string;
  catatan: string;
  terakhirDiperiksa: string;
}

export interface SiswaMaster {
  id: string;
  nisn?: string;
  nama: string;
  kelas: string;
  jenisKelamin: 'L' | 'P' | string;
  createdAt?: string;
}

export interface GuruMaster {
  id: string;
  nip?: string;
  nama: string;
  jabatan: string;
  status?: string;
  statusKepegawaian?: string;
  createdAt?: string;
}

export interface SurveiKepuasanRecord {
  id: string;
  namaLengkap: string;
  status: 'Siswa' | 'Guru' | 'Orang tua' | 'Tamu';
  jawaban: Record<string, 'setuju' | 'netral' | 'tidak_setuju'>;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
  saranPerbaikan: string;
  createdAt: string;
}
