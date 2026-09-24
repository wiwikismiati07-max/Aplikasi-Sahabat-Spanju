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

    // Map lowercase column names back to camelCase if needed
    const mapped = data.map((row: Record<string, unknown>) => {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        if (k === 'haritanggal') obj.hariTanggal = v;
        else if (k === 'namaanggota') obj.namaAnggota = v;
        else if (k === 'hasiltemuan') obj.hasilTemuan = v;
        else if (k === 'linkfoto') obj.linkFoto = v;
        else if (k === 'tandatanganurl') obj.tandaTanganUrl = v;
        else if (k === 'namapenandatangan') obj.namaPenandatangan = v;
        else if (k === 'jabatanpenandatangan') obj.jabatanPenandatangan = v;
        else if (k === 'createdat') obj.createdAt = v;
        else if (k === 'namasiswa') obj.namaSiswa = v;
        else if (k === 'namasiswa2') obj.namaSiswa2 = v;
        else if (k === 'waktukejadian') obj.waktuKejadian = v;
        else if (k === 'kodelaporan') obj.kodeLaporan = v;
        else if (k === 'kronologikejadian') obj.kronologiKejadian = v;
        else if (k === 'kegiatanpenyadaran') obj.kegiatanPenyadaran = v;
        else if (k === 'kegiatanpencegahan') obj.kegiatanPencegahan = v;
        else if (k === 'kegiatanpenangananrespon') obj.kegiatanPenangananRespon = v;
        else if (k === 'kegiatanpelaporan') obj.kegiatanPelaporan = v;
        else if (k === 'tindaklanjut') obj.tindakLanjut = v;
        else if (k === 'kategorikasus') obj.kategoriKasus = v;
        else if (k === 'namapetugas') obj.namaPetugas = v;
        else if (k === 'tandatanganpetugasurl') obj.tandaTanganPetugasUrl = v;
        else if (k === 'jamkedatangan') obj.jamKedatangan = v;
        else if (k === 'namalengkap') obj.namaLengkap = v;
        else if (k === 'nipnik') obj.nipNik = v;
        else if (k === 'instansiasal') obj.instansiAsal = v;
        else if (k === 'tujuankunjungan') obj.tujuanKunjungan = v;
        else if (k === 'dokumentasimateriurl') obj.dokumentasiMateriUrl = v;
        else if (k === 'pesanedukatif') obj.pesanEdukatif = v;
        else if (k === 'thumbnailurl') obj.thumbnailUrl = v;
        else if (k === 'saranperbaikan') obj.saranPerbaikan = v;
        else if (k === 'jeniskelamin') obj.jenisKelamin = v;
        else if (k === 'statuskepegawaian') obj.statusKepegawaian = v;
        else obj[k] = v;
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

// Generic upsert/save row helper
export async function saveTableRow(tableName: string, row: any): Promise<boolean> {
  try {
    const dbRow: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      dbRow[k.toLowerCase()] = v;
    }

    const { error } = await supabase.from(tableName).upsert(dbRow, { onConflict: 'id' });
    if (error) {
      console.warn(`Supabase upsert error on ${tableName}:`, error.message);
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

    // 2. Delete all existing records in table (if accessible)
    try {
      await supabase.from(tableName).delete().neq('id', '___NON_EXISTENT_ID___');
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
        return dbRow;
      });

      const { error } = await supabase.from(tableName).upsert(dbRows, { onConflict: 'id' });
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
