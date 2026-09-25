import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
export const SUPABASE_URL = 'https://ltfwkunozemldjivnqfq.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_CXRMrPZk7aIhJMdomAqZig_DdhECr-9';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Safe LocalStorage wrapper to prevent QuotaExceededError or crashes
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('safeStorage: quota exceeded, attempting trim', e);
      try {
        const nonEssential = ['spanju_cache_temp', 'spanju_backup_temp'];
        nonEssential.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

// Column mapping dictionary from Supabase lowercase column names to frontend camelCase keys
const LOWER_TO_CAMEL_MAP: Record<string, string> = {
  haritanggal: 'hariTanggal',
  namaanggota: 'namaAnggota',
  hasiltemuan: 'hasilTemuan',
  linkfoto: 'linkFoto',
  tandatanganurl: 'tandaTanganUrl',
  namapenandatangan: 'namaPenandatangan',
  jabatanpenandatangan: 'jabatanPenandatangan',
  createdat: 'createdAt',
  hasiltemuansatuminggu: 'hasilTemuanSatuMinggu',
  evaluasikegiatan: 'evaluasiKegiatan',
  rencanainovasi: 'rencanaInovasi',
  programkegiatan: 'programKegiatan',
  targetpelaksanaan: 'targetPelaksanaan',
  evaluasiprogramterlaksana: 'evaluasiProgramTerlaksana',
  evaluasikendalasolusi: 'evaluasiKendalaSolusi',
  hasilinovasi: 'hasilInovasi',
  produkkreatif: 'produkKreatif',
  rencanatindaklanjut: 'rencanaTindakLanjut',
  pesandisampaikan: 'pesanDisampaikan',
  kategoriliterasi: 'kategoriLiterasi',
  kodelaporan: 'kodeLaporan',
  waktukejadian: 'waktuKejadian',
  namasiswa: 'namaSiswa',
  namasiswa2: 'namaSiswa2',
  kelas2: 'kelas2',
  kronologikejadian: 'kronologiKejadian',
  kegiatanpenyadaran: 'kegiatanPenyadaran',
  kegiatanpencegahan: 'kegiatanPencegahan',
  kegiatanpenangananrespon: 'kegiatanPenangananRespon',
  kegiatanpelaporan: 'kegiatanPelaporan',
  tindaklanjut: 'tindakLanjut',
  kategorikasus: 'kategoriKasus',
  tandatanganpetugasurl: 'tandaTanganPetugasUrl',
  namapetugas: 'namaPetugas',
  nomorsurat: 'nomorSurat',
  tempatmediasi: 'tempatMediasi',
  namapihak1: 'namaPihak1',
  kelaspihak1: 'kelasPihak1',
  nisnpihak1: 'nisnPihak1',
  peranpihak1: 'peranPihak1',
  tandatanganpihak1: 'tandaTanganPihak1',
  ttdpihak1: 'ttdPihak1',
  ispihak1locked: 'isPihak1Locked',
  namapihak2: 'namaPihak2',
  kelaspihak2: 'kelasPihak2',
  nisnpihak2: 'nisnPihak2',
  peranpihak2: 'peranPihak2',
  tandatanganpihak2: 'tandaTanganPihak2',
  ttdpihak2: 'ttdPihak2',
  ispihak2locked: 'isPihak2Locked',
  ringkasanmasalah: 'ringkasanMasalah',
  butirkesepakatan: 'butirKesepakatan',
  sanksiedukasi: 'sanksiEdukasi',
  namasaksi: 'namaSaksi',
  ttdsaksi: 'ttdSaksi',
  namakepalasekolah: 'namaKepalaSekolah',
  nipkepalasekolah: 'nipKepalaSekolah',
  namakonselorsebaya: 'namaKonselorSebaya',
  tandatangankonselorsebaya: 'tandaTanganKonselorSebaya',
  hasilpemantauan: 'hasilPemantauan',
  jamkedatangan: 'jamKedatangan',
  namatamu: 'namaTamu',
  namalengkap: 'namaLengkap',
  nipnik: 'nipNik',
  asalinstansi: 'asalInstansi',
  instansiasal: 'instansiAsal',
  maksudkunjungan: 'maksudKunjungan',
  tujuankunjungan: 'tujuanKunjungan',
  penerimatamu: 'penerimaTamu',
  dokumentasimateriurl: 'dokumentasiMateriUrl',
  pesanedukatif: 'pesanEdukatif',
  thumbnailurl: 'thumbnailUrl',
  jumlahsiswa: 'jumlahSiswa',
  totalkasustahunini: 'totalKasusTahunIni',
  kasusterselesaikan: 'kasusTerselesaikan',
  skorkeramahan: 'skorKeramahan',
  statuszona: 'statusZona',
  walikelas: 'waliKelas',
  dutaantibullying: 'dutaAntiBullying',
  terakhirdiperiksa: 'terakhirDiperiksa',
  jeniskelamin: 'jenisKelamin',
  statuskepegawaian: 'statusKepegawaian',
  saranperbaikan: 'saranPerbaikan',
};

// Generic fetch table helper with lowercase mapping
export async function fetchTableData<T>(tableName: string, fallbackData: T[] = []): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error || !data || data.length === 0) {
      const cached = safeStorage.getItem(`spanju_${tableName}`);
      if (cached) {
        try {
          return JSON.parse(cached) as T[];
        } catch {
          // ignore
        }
      }
      return fallbackData;
    }

    // Map lowercase column names back to camelCase
    const mapped = data.map((row: Record<string, unknown>) => {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        const keyLower = k.toLowerCase();
        if (LOWER_TO_CAMEL_MAP[keyLower]) {
          obj[LOWER_TO_CAMEL_MAP[keyLower]] = v;
        } else {
          obj[k] = v;
        }
      }
      return obj as T;
    });

    safeStorage.setItem(`spanju_${tableName}`, JSON.stringify(mapped));
    return mapped;
  } catch (err) {
    console.warn(`Supabase fetch failed for ${tableName}:`, err);
    const cached = safeStorage.getItem(`spanju_${tableName}`);
    if (cached) {
      try {
        return JSON.parse(cached) as T[];
      } catch {
        // ignore
      }
    }
    return fallbackData;
  }
}

// Generic upsert/save row helper to Supabase
export async function saveTableRow(tableName: string, row: any): Promise<boolean> {
  try {
    const dbRow: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      dbRow[k.toLowerCase()] = v;
    }

    const conflictColumn = 'id';
    if (tableName === 'kelas_zona') {
      if (!dbRow.id && dbRow.kelas) {
        dbRow.id = `kelas-${String(dbRow.kelas).toLowerCase().trim()}`;
      }
    }

    const { error } = await supabase.from(tableName).upsert(dbRow, { onConflict: conflictColumn });
    if (error) {
      console.warn(`Supabase upsert error on ${tableName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase save error on ${tableName}:`, err);
    return false;
  }
}

// Generic bulk replace/overwrite data helper (TINDAS DATA LAMA DENGAN YANG BARU)
export async function bulkReplaceTableData(tableName: string, rows: any[]): Promise<boolean> {
  try {
    // 1. Cache to local storage immediately
    safeStorage.setItem(`spanju_${tableName}`, JSON.stringify(rows));

    const conflictColumn = 'id';

    // 2. Delete all existing records in table (if accessible)
    try {
      await supabase.from(tableName).delete().neq(conflictColumn, '___NON_EXISTENT_ID___');
    } catch {
      // ignore
    }

    // 3. Upsert / Insert new data
    if (rows.length > 0) {
      const dbRows = rows.map((row) => {
        const dbRow: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(row)) {
          dbRow[k.toLowerCase()] = v;
        }
        if (tableName === 'kelas_zona') {
          if (!dbRow.id && dbRow.kelas) {
            dbRow.id = `kelas-${String(dbRow.kelas).toLowerCase().trim()}`;
          }
        }
        return dbRow;
      });

      const { error } = await supabase.from(tableName).upsert(dbRows, { onConflict: conflictColumn });
      if (error) {
        console.warn(`Supabase bulk replace error on ${tableName}:`, error.message);
      }
    }
    return true;
  } catch (err) {
    console.warn(`Supabase bulk replace failed for ${tableName}:`, err);
    return false;
  }
}

// Generic delete row helper
export async function deleteTableRow(tableName: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      console.warn(`Supabase delete error on ${tableName}:`, error.message);
    }
    return true;
  } catch (err) {
    console.warn(`Supabase delete error on ${tableName}:`, err);
    return false;
  }
}

export const saveTableData = saveTableRow;
export const deleteTableData = deleteTableRow;
