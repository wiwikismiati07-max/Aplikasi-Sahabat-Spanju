import {
  KelasZona,
  PiketRecord,
  CeriRecord,
  KebunRecord,
  SerasiRecord,
  ELaporRecord,
  SPDamaiRecord,
  BukuTamuRecord,
  MediaEdukasiItem,
  SiswaMaster,
  GuruMaster,
  SurveiKepuasanRecord,
} from '../types';

export const INITIAL_GURU: GuruMaster[] = [
  { id: 'guru-1', nip: '19831116 200904 2 003', nama: 'Wiwik Ismiati, S.Pd', jabatan: 'Koordinator TPPK / Guru BK', status: 'PNS' },
  { id: 'guru-2', nip: '19940214 202221 2 014', nama: 'Eki Febriani, S.Pd', jabatan: 'Guru BK / Tim TPPK', status: 'PPPK' },
  { id: 'guru-3', nip: '19860410 201001 2 030', nama: 'Nur Fadilah, S.Pd., M.Pd', jabatan: 'Kepala UPT SMP Negeri 7 Pasuruan', status: 'PNS' },
  { id: 'guru-4', nip: '19750512 200003 1 005', nama: 'Bambang Sutrisno, M.Pd', jabatan: 'Wali Kelas 7A / Guru IPA', status: 'PNS' },
  { id: 'guru-5', nip: '19800817 200501 2 008', nama: 'Siti Rahmawati, S.Pd', jabatan: 'Wali Kelas 7B / Guru Bahasa Indonesia', status: 'PNS' },
  { id: 'guru-6', nip: '19820320 200604 1 012', nama: 'Ahmad Fauzi, S.Pd', jabatan: 'Wali Kelas 7C / Guru PJOK', status: 'PNS' },
  { id: 'guru-7', nip: '19851104 201001 2 018', nama: 'Dewi Lestari, S.Pd', jabatan: 'Wali Kelas 8A / Guru Matematika', status: 'PNS' },
  { id: 'guru-8', nip: '19880115 201402 1 003', nama: 'Hadi Prasetyo, S.Pd', jabatan: 'Wali Kelas 8E / Guru IPS', status: 'PNS' },
  { id: 'guru-9', nip: '19900624 201803 2 007', nama: 'Nurul Hidayati, S.Pd', jabatan: 'Wali Kelas 8F / Guru Seni Budaya', status: 'PNS' },
  { id: 'guru-10', nip: '19790909 200312 1 004', nama: 'Tri Wibowo, S.Pd', jabatan: 'Wali Kelas 9A / Guru Bahasa Inggris', status: 'PNS' },
];

export const INITIAL_SISWA: SiswaMaster[] = [
  { id: 's-7a-1', nisn: '0098231451', nama: 'Aditya Pratama', kelas: '7A', jenisKelamin: 'L' },
  { id: 's-7a-2', nisn: '0098231452', nama: 'Anindya Putri', kelas: '7A', jenisKelamin: 'P' },
  { id: 's-7b-1', nisn: '0098231460', nama: 'Auxilia Paramitha', kelas: '7B', jenisKelamin: 'P' },
  { id: 's-7b-2', nisn: '0098231461', nama: 'Bagus Setiawan', kelas: '7B', jenisKelamin: 'L' },
  { id: 's-7c-1', nisn: '0098231470', nama: 'Cantika Dewi', kelas: '7C', jenisKelamin: 'P' },
  { id: 's-7c-2', nisn: '0098231471', nama: 'Dimas Ardiansyah', kelas: '7C', jenisKelamin: 'L' },
  { id: 's-7d-1', nisn: '0098231480', nama: 'Duta Ramadhani', kelas: '7D', jenisKelamin: 'L' },
  { id: 's-7e-1', nisn: '0098231490', nama: 'Fajar Nugraha', kelas: '7E', jenisKelamin: 'L' },
  { id: 's-7f-1', nisn: '0098231500', nama: 'Ghea Amanda', kelas: '7F', jenisKelamin: 'P' },
  { id: 's-7g-1', nisn: '0098231510', nama: 'Hafizh Maulana', kelas: '7G', jenisKelamin: 'L' },
  { id: 's-7h-1', nisn: '0098231520', nama: 'Intan Permata', kelas: '7H', jenisKelamin: 'P' },
  { id: 's-8a-1', nisn: '0087123410', nama: 'Kevin Sanjaya', kelas: '8A', jenisKelamin: 'L' },
  { id: 's-8e-1', nisn: '0087123450', nama: 'Lestari Handayani', kelas: '8E', jenisKelamin: 'P' },
  { id: 's-8f-1', nisn: '0087123460', nama: 'Muhammad Rizky', kelas: '8F', jenisKelamin: 'L' },
  { id: 's-9a-1', nisn: '0076112210', nama: 'Nabila Azzahra', kelas: '9A', jenisKelamin: 'P' },
  { id: 's-9h-1', nisn: '0076112280', nama: 'Zulfikar Ali', kelas: '9H', jenisKelamin: 'L' },
];

export const INITIAL_KELAS_ZONA: KelasZona[] = [
  // Kelas 7 (7A - 7H)
  { kelas: '7A', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 1, kasusTerselesaikan: 1, skorKeramahan: 98, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Ida Nursanti,S.Pd', dutaAntiBullying: 'AMARTA DIANA NADHIF PINANTI', catatan: 'Kelas teladan keharmonisan dan solidaritas', terakhirDiperiksa: '2026-09-20' },
  { kelas: '7B', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 1, kasusTerselesaikan: 1, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Enny Yuliasih,S.Pd', dutaAntiBullying: 'NICITHA AININDYA APRIYANTO', catatan: 'Aktif pembiasaan sapa pagi dan pojok baca', terakhirDiperiksa: '2026-09-21' },
  { kelas: '7C', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Cahyo Kurnianto, S.Pd', dutaAntiBullying: 'MYCHELA ALLEA FITRI', catatan: 'Kelas teladan rukun, harmonis dan zero bullying', terakhirDiperiksa: '2026-09-22' },
  { kelas: '7D', tingkat: '7', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Tri Yulianah,S.Pd', dutaAntiBullying: 'SOFWA FARAH DIBA', catatan: 'Suasana kelas kondusif dan saling mendukung', terakhirDiperiksa: '2026-09-18' },
  { kelas: '7E', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Drs. Supriyanto', dutaAntiBullying: 'Fajar Nugraha', catatan: 'Budaya untuk adik kelas dan saling menghormati', terakhirDiperiksa: '2026-09-19' },
  { kelas: '7F', tingkat: '7', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Nur Kholis, S.Pd', dutaAntiBullying: 'Ghea Amanda', catatan: 'Kelas ramah kawan dan aktif berpartisipasi', terakhirDiperiksa: '2026-09-20' },
  { kelas: '7G', tingkat: '7', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Sri Wahyuningsih, S.Pd', dutaAntiBullying: 'Hafizh Maulana', catatan: 'Piagam janji ramah kawan ditegakkan', terakhirDiperiksa: '2026-09-22' },
  { kelas: '7H', tingkat: '7', jumlahSiswa: 30, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Zona Hijau (Aman)', waliKelas: 'M. Ilyas, S.Pd', dutaAntiBullying: 'Intan Permata', catatan: 'Zona Hijau Bintang Lima keharmonisan bersama', terakhirDiperiksa: '2026-09-23' },

  // Kelas 8 (8A - 8H)
  { kelas: '8A', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Dewi Lestari, S.Pd', dutaAntiBullying: 'Kevin Sanjaya', catatan: 'Zero Bullying, budaya apresiasi antar kawan terbangun.', terakhirDiperiksa: '2026-09-21' },
  { kelas: '8B', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Endang Purwati, S.Pd', dutaAntiBullying: 'Bunga Citra', catatan: 'Aman, saling menghargai pendapat saat kerja kelompok.', terakhirDiperiksa: '2026-09-19' },
  { kelas: '8C', tingkat: '8', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Yusuf Habibi, M.Pd', dutaAntiBullying: 'Cahyo Utomo', catatan: 'Zero Bullying, duta kelas sangat teliti dan ramah.', terakhirDiperiksa: '2026-09-20' },
  { kelas: '8D', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 94, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Anisa Kusuma, S.Pd', dutaAntiBullying: 'Dinda Kirana', catatan: 'Tertib dan kondusif, interaksi harian bersahabat.', terakhirDiperiksa: '2026-09-22' },
  { kelas: '8E', tingkat: '8', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 99, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Hadi Prasetyo, S.Pd', dutaAntiBullying: 'Lestari Handayani', catatan: 'Zero Bullying. Sangat rukun, ramah, dan saling membimbing.', terakhirDiperiksa: '2026-09-23' },
  { kelas: '8F', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 99, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Nurul Hidayati, S.Pd', dutaAntiBullying: 'Muhammad Rizky', catatan: 'Zero Bullying. Interaksi positif antar siswa terpelihara utuh.', terakhirDiperiksa: '2026-09-23' },
  { kelas: '8G', tingkat: '8', jumlahSiswa: 30, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Agus Santoso, S.Pd', dutaAntiBullying: 'Galang Perkasa', catatan: 'Ruang kelas bersih, ramah dan inklusif.', terakhirDiperiksa: '2026-09-20' },
  { kelas: '8H', tingkat: '8', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Wahyu Hidayat, S.Pd', dutaAntiBullying: 'Helmi Yahya', catatan: 'Kondusif, duta teman sebaya aktif menjalankan piket.', terakhirDiperiksa: '2026-09-21' },

  // Kelas 9 (9A - 9H)
  { kelas: '9A', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Tri Wibowo, S.Pd', dutaAntiBullying: 'Nabila Azzahra', catatan: 'Zero Bullying, teladan bagi adik-adik kelas.', terakhirDiperiksa: '2026-09-22' },
  { kelas: '9B', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Ratih Kumalasari, S.Pd', dutaAntiBullying: 'Panji Gumilang', catatan: 'Fokus belajar persiapan ujian, saling mendukung.', terakhirDiperiksa: '2026-09-20' },
  { kelas: '9C', tingkat: '9', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Dra. Kusuma Wardani', dutaAntiBullying: 'Qonita Salma', catatan: 'Zero Bullying, pergaulan sehat dan beretika.', terakhirDiperiksa: '2026-09-21' },
  { kelas: '9D', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Joko Susilo, S.Pd', dutaAntiBullying: 'Rangga Danendra', catatan: 'Aman dan terkendali, kegiatan kolaboratif berjalan mulus.', terakhirDiperiksa: '2026-09-19' },
  { kelas: '9E', tingkat: '9', jumlahSiswa: 30, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 97, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Farida Hanum, M.Pd', dutaAntiBullying: 'Salma Salsabila', catatan: 'Zero Bullying, kekeluargaan kelas terjalin erat.', terakhirDiperiksa: '2026-09-22' },
  { kelas: '9F', tingkat: '9', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 95, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Budi Santoso, S.Pd', dutaAntiBullying: 'Teguh Prakoso', catatan: 'Kondusif, pembiasaan senyum salam sapa terjaga.', terakhirDiperiksa: '2026-09-18' },
  { kelas: '9G', tingkat: '9', jumlahSiswa: 32, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 96, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Retno Wulandari, S.Pd', dutaAntiBullying: 'Umar Farouq', catatan: 'Zero Bullying, komunikasi antar teman berjalan sopan.', terakhirDiperiksa: '2026-09-21' },
  { kelas: '9H', tingkat: '9', jumlahSiswa: 31, totalKasusTahunIni: 0, kasusTerselesaikan: 0, skorKeramahan: 98, statusZona: 'Zona Hijau (Aman)', waliKelas: 'Lukman Hakim, S.Pd', dutaAntiBullying: 'Zulfikar Ali', catatan: 'Zero Bullying. Menjunjung tinggi sportivitas dan saling menghargai.', terakhirDiperiksa: '2026-09-23' },
];

export const INITIAL_PIKET_HARIAN: PiketRecord[] = [
  {
    id: 'piket-1',
    hariTanggal: 'Senin, 21 September 2026',
    waktu: '06.45 WIB',
    namaAnggota: 'Aditya Pratama (7A) & Cantika Dewi (7C)',
    kelas: 'Gerbang Depan & Area Selasar',
    hasilTemuan: 'Seluruh siswa hadir tertib, pembiasaan 5S (Senyum, Sapa, Salam, Sopan, Santun) terlaksana baik. Tidak ditemukan indikasi perselisihan.',
    linkFoto: 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg',
    keterangan: 'Piket berjalan lancar, cuaca cerah dan aman.',
    tandaTanganUrl: '',
    namaPenandatangan: 'Wiwik Ismiati, S.Pd',
    jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
    createdAt: '2026-09-21T06:45:00Z',
  },
];

export const INITIAL_CERI: CeriRecord[] = [
  {
    id: 'ceri-1',
    hariTanggal: 'Sabtu, 19 September 2026',
    waktu: '08.00 WIB',
    hasilTemuanSatuMinggu: 'Interaksi siswa di kantin dan lapangan selama sepekan terpantau sangat bersahabat. Duta anti-bullying aktif mengedukasi kawan sebaya.',
    evaluasiKegiatan: 'Sosialisasi pojok curhat sahabat SPANJU telah menjangkau seluruh perwakilan kelas 7, 8, dan 9.',
    rencanaInovasi: 'Meluncurkan mini podcast literasi kebaikan dan lomba poster digital "Teman Asyik Tanpa Bullying".',
    linkFoto: 'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg',
    keterangan: 'Dihadiri perwakilan OSIS, Duta Ramah Anak, dan Pembina BK.',
    namaPenandatangan: 'Eki Febriani, S.Pd',
    jabatanPenandatangan: 'Guru BK / Tim TPPK',
    createdAt: '2026-09-19T08:00:00Z',
  },
];

export const INITIAL_KEBUN: KebunRecord[] = [
  {
    id: 'kebun-1',
    hariTanggal: 'Kamis, 17 September 2026',
    waktu: '13.00 WIB',
    evaluasiProgramTerlaksana: 'Program Gerakan Sapa Kawan dan Kampanye Anti-Bullying Bulan September telah tuntas dilaksanakan di 24 rombel.',
    evaluasiKendalaSolusi: 'Kendala: waktu istirahat siswa bertepatan rapat guru. Solusi: melibatkan Duta Siswa sebagai duta penjaga zona ramah kawan.',
    hasilInovasi: 'Sistem Lapor Cepat 1-Klik Sahabat SPANJU berbasis website dan QR-Code di setiap mading kelas.',
    produkKreatif: 'Modul Digital "Sayang Teman", 24 Poster Zona Hijau, dan Video Dokumentasi Kampanye Damai.',
    rencanaTindakLanjut: [
      { id: 'rtl-1', programKegiatan: 'Pemasangan Barcode QR E-Lapor di 24 Kelas', pic: 'Tim IT & Duta SPANJU', targetPelaksanaan: '24 Rombel', deadline: '30 September 2026' },
      { id: 'rtl-2', programKegiatan: 'Workshop Konselor Sebaya Batch 2', pic: 'Wiwik Ismiati, S.Pd', targetPelaksanaan: '48 Siswa', deadline: '10 Oktober 2026' },
    ],
    keterangan: 'Rapat pleno bulanan bersama tim Satgas TPPK dan Kepala Sekolah.',
    namaPenandatangan: 'Wiwik Ismiati, S.Pd',
    jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
    createdAt: '2026-09-17T13:00:00Z',
  },
];

export const INITIAL_SERASI: SerasiRecord[] = [
  {
    id: 'serasi-1',
    hariTanggal: 'Selasa, 22 September 2026',
    waktu: '07.00 WIB',
    kategoriLiterasi: 'Karakter Ramah Kawan',
    pesanDisampaikan: 'Jadikan kata-katamu sebagai penyejuk hati kawan, bukan duri yang menyakiti. Sahabat sejati adalah yang merangkul dan menguatkan.',
    penulis: 'Duta Literasi SPANJU (Nabila Azzahra - 9A)',
    keterangan: 'Disiarkan melalui pengeras suara sekolah saat pembiasaan pagi literasi.',
    namaPenandatangan: 'Wiwik Ismiati, S.Pd',
    jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
    createdAt: '2026-09-22T07:00:00Z',
  },
];

export const INITIAL_E_LAPOR: ELaporRecord[] = [
  {
    id: 'elapor-1',
    kodeLaporan: 'SPJ-2026-003',
    hariTanggal: 'Senin, 14 September 2026',
    waktuKejadian: '10.15 WIB',
    namaSiswa: 'Auxilia Paramitha',
    kelas: '7B',
    namaSiswa2: 'Bagus Setiawan',
    kelas2: '7B',
    kronologiKejadian: 'Terjadi perbedaan pendapat dan saling sindir di grup media sosial kelas. Kedua pihak merasa tersinggung dan meminta mediasi di ruang BK.',
    kegiatanPenyadaran: 'Edukasi etika berkomunikasi di media sosial dan pentingnya saling menghargai ruang pribadi kawan.',
    kegiatanPencegahan: 'Pemberian pemahaman literasi digital ramah anak dan pembuatan kesepakatan bersama grup kelas.',
    kegiatanPenangananRespon: 'Mediasi tatap muka kekeluargaan difasilitasi oleh Guru BK pada hari yang sama jam 11.00 WIB.',
    kegiatanPelaporan: 'Pencatatan berita acara mediasi dan laporan terarsip di sistem TPPK UPT SMPN 7 Pasuruan.',
    tindakLanjut: 'Kedua belah pihak telah saling meminta maaf dan sepakat menyelesaikan masalah secara damai tanpa dendam.',
    keterangan: 'Kasus telah tuntas melalui Restorative Justice (SP Damai). Situasi kembali rukun.',
    status: 'Selesai',
    kategoriKasus: 'Siber',
    namaPenandatangan: 'Wiwik Ismiati, S.Pd',
    jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
    namaPetugas: 'Wiwik Ismiati, S.Pd',
    createdAt: '2026-09-14T10:15:00Z',
  },
];

export const INITIAL_SP_DAMAI: SPDamaiRecord[] = [
  {
    id: 'spdamai-1',
    nomorSurat: '001/SP-DAMAI/SPANJU/IX/2026',
    hariTanggal: 'Senin, 14 September 2026',
    tempatMediasi: 'Ruang Bimbingan Konseling (BK) UPT SMPN 7 Pasuruan',
    namaPihak1: 'Auxilia Paramitha',
    kelasPihak1: '7B',
    peranPihak1: 'Pihak Pertama',
    isPihak1Locked: true,
    namaPihak2: 'Bagus Setiawan',
    kelasPihak2: '7B',
    peranPihak2: 'Pihak Kedua',
    isPihak2Locked: true,
    ringkasanMasalah: 'Kesalahpahaman komunikasi di grup pesan kelas yang memicu ketegangan pergaulan.',
    butirKesepakatan: [
      'Kedua belah pihak sepakat untuk saling memaafkan secara tulus tanpa ada rasa dendam.',
      'Berkomitmen untuk tidak mengulangi perkataan atau tindakan yang menyakiti perasaan.',
      'Saling menghargai privasi dan menjaga tutur kata yang sopan baik di sekolah maupun media sosial.',
      'Menjaga persahabatan harmonis dan siap menjadi contoh pelajar berkarakter Profil Pelajar Pancasila.',
    ],
    sanksiEdukasi: 'Merawat tanaman di Pojok Literasi Sekolah secara bersama-sama selama 3 hari berturut-turut.',
    namaKonselorSebaya: 'Aditya Pratama (Duta Anti-Bullying 7A)',
    status: 'Damai & Tuntas',
    hasilPemantauan: 'Kedua siswa telah belajar bersama di kelas dengan rukun dan harmonis.',
    createdAt: '2026-09-14T11:30:00Z',
  },
];

export const INITIAL_BUKU_TAMU: BukuTamuRecord[] = [
  {
    id: 'tamu-1',
    hariTanggal: 'Rabu, 16 September 2026',
    jamKedatangan: '09.30 WIB',
    namaLengkap: 'Drs. H. Suhartono, M.Si',
    nipNik: '19680315 199303 1 008',
    jabatan: 'Pengawas Sekolah Madya',
    instansiAsal: 'Dinas Pendidikan dan Kebudayaan Kota Pasuruan',
    tujuanKunjungan: 'Monitoring dan Evaluasi Implementasi Satgas TPPK serta Program Unggulan PASS TEMENAN di UPT SMPN 7 Pasuruan.',
    tindakLanjut: 'Apresiasi atas inovasi Aplikasi Sahabat SPANJU dan penetapan 24 Rombel sebagai model percontohan Zona Hijau Anti Perundungan.',
    keterangan: 'Diterima langsung oleh Kepala Sekolah dan Koordinator TPPK di Ruang Pertemuan Resmi.',
    namaPenandatangan: 'Wiwik Ismiati, S.Pd',
    jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
    createdAt: '2026-09-16T09:30:00Z',
  },
];

export const INITIAL_MEDIA_EDUKASI: MediaEdukasiItem[] = [
  {
    id: 'media-1',
    judul: 'Panduan Praktis Mengenali & Menghentikan Perundungan di Sekolah',
    dokumentasiMateriUrl: 'https://sites.google.com/view/berandapasstemenanspanju/home',
    tanggal: '2026-09-20',
  },
];

export const INITIAL_SURVEI: SurveiKepuasanRecord[] = [
  {
    id: 'survei-1',
    namaLengkap: 'Ibu Rahayu Kusuma (Wali Murid 7B)',
    status: 'Orang tua',
    jawaban: { q1: 'setuju', q2: 'setuju', q3: 'setuju', q4: 'setuju', q5: 'setuju', q6: 'setuju', q7: 'setuju', q8: 'setuju' },
    saranPerbaikan: 'Sistem aplikasi sangat membantu dan memberikan ketenangan bagi kami sebagai orang tua.',
    createdAt: '2026-09-20 14:15',
  },
  {
    id: 'survei-2',
    namaLengkap: 'Aditya Pratama (Siswa 7A)',
    status: 'Siswa',
    jawaban: { q1: 'setuju', q2: 'setuju', q3: 'setuju', q4: 'setuju', q5: 'setuju', q6: 'setuju', q7: 'setuju', q8: 'setuju' },
    saranPerbaikan: 'Tampilan aplikasi sangat keren dan mudah dipakai di HP saat piket harian.',
    createdAt: '2026-09-21 09:30',
  },
  {
    id: 'survei-3',
    namaLengkap: 'Bambang Sutrisno, M.Pd (Guru)',
    status: 'Guru',
    jawaban: { q1: 'setuju', q2: 'setuju', q3: 'setuju', q4: 'setuju', q5: 'setuju', q6: 'setuju', q7: 'setuju', q8: 'setuju' },
    saranPerbaikan: 'Sangat memudahkan pemantauan zona hijau 24 kelas dan penanganan terintegrasi.',
    createdAt: '2026-09-22 11:00',
  },
];

// Export convenient aliases
export const initialKelasZona = INITIAL_KELAS_ZONA;
export const initialPiket = INITIAL_PIKET_HARIAN;
export const initialCeri = INITIAL_CERI;
export const initialKebun = INITIAL_KEBUN;
export const initialSerasi = INITIAL_SERASI;
export const initialELapor = INITIAL_E_LAPOR;
export const initialSPDamai = INITIAL_SP_DAMAI;
export const initialBukuTamu = INITIAL_BUKU_TAMU;
export const initialSiswa = INITIAL_SISWA;
export const initialGuru = INITIAL_GURU;
export const initialMedia = INITIAL_MEDIA_EDUKASI;
export const initialSurvei = INITIAL_SURVEI;
