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
  jenis_kelamin: 'jenisKelamin',
  statuskepegawaian: 'statusKepegawaian',
  saranperbaikan: 'saranPerbaikan',
  nama_guru: 'nama',
  namaguru: 'nama',
  nip: 'nip',
  nis: 'nisn',
  created_at: 'createdAt',
};

const isUuidString = (val: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim()) ||
  /^[0-9a-f-]{30,}$/i.test(val.trim());

export function inferGuruJabatan(nama: string, existingJabatan?: string): string {
  if (existingJabatan && existingJabatan.trim() !== '') return existingJabatan.trim();
  const upper = nama.toUpperCase();
  if (upper.includes('NUR FADILAH')) return 'Kepala UPT SMP Negeri 7 Pasuruan';
  if (upper.includes('WIWIK ISMIATI')) return 'Koordinator TPPK / Guru BK';
  if (upper.includes('EKI FEBRIANI')) return 'Guru BK / Tim TPPK';
  return 'Guru Mata Pelajaran';
}

export function inferGuruStatus(nip: string, existingStatus?: string): string {
  if (existingStatus && existingStatus.trim() !== '') return existingStatus.trim();
  if (!nip || nip === '-') return 'GTT / Tendik';
  if (/\b202[1-9]21\b/.test(nip)) return 'PPPK';
  return 'PNS';
}

export function normalizeAndDedupeGuruList(rows: any[]): any[] {
  if (!Array.isArray(rows)) return [];
  const seenByName = new Map<string, any>();

  rows.forEach((raw, idx) => {
    if (!raw || typeof raw !== 'object') return;
    const rawNama =
      raw.nama ||
      raw.nama_guru ||
      raw.namaLengkap ||
      raw.nama_lengkap ||
      raw.Nama ||
      raw['Nama Guru'] ||
      raw['Nama Lengkap'] ||
      '';
    const cleanNama = String(rawNama).replace(/\s+/g, ' ').trim();
    if (!cleanNama || isUuidString(cleanNama)) return;

    const rawNip = raw.nip ?? raw.NIP ?? raw['No. Induk'] ?? '';
    const cleanNip = String(rawNip)
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || '-';

    const jabatan = inferGuruJabatan(cleanNama, raw.jabatan || raw.Jabatan);
    const statusKepegawaian = inferGuruStatus(
      cleanNip,
      raw.statusKepegawaian || raw.statuskepegawaian || raw.status || raw.Status
    );

    const normalizedItem = {
      ...raw,
      id: String(raw.id || `guru-${idx + 1}`),
      nama: cleanNama,
      nip: cleanNip,
      jabatan,
      status: statusKepegawaian,
      statusKepegawaian,
      createdAt: raw.createdAt || raw.created_at || undefined,
    };

    const dedupeKey = cleanNama.toLowerCase().replace(/[.,\s]+/g, '');
    const existing = seenByName.get(dedupeKey);
    if (!existing) {
      seenByName.set(dedupeKey, normalizedItem);
    } else {
      // Keep the richer record (prefer valid NIP & UUID id)
      const existingHasNip = existing.nip && existing.nip !== '-';
      const currentHasNip = cleanNip && cleanNip !== '-';
      const existingIsUuid = isUuidString(existing.id);
      const currentIsUuid = isUuidString(normalizedItem.id);
      if ((!existingHasNip && currentHasNip) || (!existingIsUuid && currentIsUuid)) {
        seenByName.set(dedupeKey, {
          ...existing,
          ...normalizedItem,
          nip: currentHasNip ? cleanNip : existing.nip,
          jabatan: normalizedItem.jabatan || existing.jabatan,
        });
      }
    }
  });

  return Array.from(seenByName.values());
}

// Generic fetch table helper with lowercase mapping
export async function fetchTableData<T>(tableName: string, fallbackData: T[] = []): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error || !data || data.length === 0) {
      const cached = safeStorage.getItem(`spanju_${tableName}`);
      if (cached) {
        try {
          const parsedCached = JSON.parse(cached) as T[];
          if (tableName === 'master_guru') {
            return normalizeAndDedupeGuruList(parsedCached) as T[];
          }
          return parsedCached;
        } catch {
          // ignore
        }
      }
      return fallbackData;
    }

    // Map lowercase/snake_case column names back to camelCase
    const mapped = data.map((row: Record<string, unknown>) => {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        const keyLower = k.toLowerCase();
        if (LOWER_TO_CAMEL_MAP[keyLower]) {
          const targetKey = LOWER_TO_CAMEL_MAP[keyLower];
          if (obj[targetKey] === undefined || obj[targetKey] === null || obj[targetKey] === '') {
            obj[targetKey] = v;
          }
        }
        if (obj[k] === undefined) {
          obj[k] = v;
        }
      }
      return obj as T;
    });

    const finalRows = tableName === 'master_guru' ? (normalizeAndDedupeGuruList(mapped) as T[]) : mapped;
    safeStorage.setItem(`spanju_${tableName}`, JSON.stringify(finalRows));
    return finalRows;
  } catch (err) {
    console.warn(`Supabase fetch failed for ${tableName}:`, err);
    const cached = safeStorage.getItem(`spanju_${tableName}`);
    if (cached) {
      try {
        const parsedCached = JSON.parse(cached) as T[];
        if (tableName === 'master_guru') {
          return normalizeAndDedupeGuruList(parsedCached) as T[];
        }
        return parsedCached;
      } catch {
        // ignore
      }
    }
    return fallbackData;
  }
}

function buildMasterGuruLiveRow(row: any): Record<string, unknown> {
  const cleanNip = row.nip && row.nip !== '-' ? String(row.nip).trim() : null;
  return {
    id: row.id,
    nama_guru: row.nama || row.nama_guru || '',
    NIP: cleanNip,
    created_at: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

// Generic upsert/save row helper to Supabase
export async function saveTableRow(tableName: string, row: any): Promise<boolean> {
  try {
    const dbRow: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      const lowerKey = k.toLowerCase();
      // Omit photo / heavy physical evidence fields so Supabase database storage never fills up
      if (lowerKey === 'linkfoto' || lowerKey === 'foto') {
        continue;
      }
      dbRow[lowerKey] = v;
    }

    const conflictColumn = 'id';
    if (tableName === 'kelas_zona') {
      if (!dbRow.id && dbRow.kelas) {
        dbRow.id = `kelas-${String(dbRow.kelas).toLowerCase().trim()}`;
      }
    }

    const { error } = await supabase.from(tableName).upsert(dbRow, { onConflict: conflictColumn });
    if (error) {
      if (tableName === 'master_guru') {
        const liveRow = buildMasterGuruLiveRow(row);
        const retry = await supabase.from('master_guru').upsert(liveRow, { onConflict: 'id' });
        if (!retry.error) return true;
        console.warn(`Supabase master_guru fallback upsert error:`, retry.error.message);
        return false;
      }
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
    const cleanRows = tableName === 'master_guru' ? normalizeAndDedupeGuruList(rows) : rows;
    // 1. Cache to local storage immediately
    safeStorage.setItem(`spanju_${tableName}`, JSON.stringify(cleanRows));

    const conflictColumn = 'id';

    // 2. Delete all existing records in table (if accessible)
    try {
      await supabase.from(tableName).delete().neq(conflictColumn, '___NON_EXISTENT_ID___');
    } catch {
      // ignore
    }

    // 3. Upsert / Insert new data
    if (cleanRows.length > 0) {
      const dbRows = cleanRows.map((row) => {
        const dbRow: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(row)) {
          const lowerKey = k.toLowerCase();
          // Omit photo / heavy physical evidence fields so Supabase database storage never fills up
          if (lowerKey === 'linkfoto' || lowerKey === 'foto') {
            continue;
          }
          dbRow[lowerKey] = v;
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
        if (tableName === 'master_guru') {
          const liveRows = cleanRows.map(buildMasterGuruLiveRow);
          const retry = await supabase.from('master_guru').upsert(liveRows, { onConflict: 'id' });
          if (retry.error) {
            console.warn(`Supabase master_guru fallback bulk replace error:`, retry.error.message);
          }
        } else {
          console.warn(`Supabase bulk replace error on ${tableName}:`, error.message);
        }
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

// Clean up all physical evidence / photo links and storage buckets in Supabase to keep quota 100% free
export async function cleanupSupabaseStorageAndPhotos(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Clear linkfoto in piket_harian table
    try {
      await supabase.from('piket_harian').update({ linkfoto: null }).not('linkfoto', 'is', null);
    } catch {
      // ignore if column doesn't exist
    }

    // 2. Clear linkfoto in sabtu_beli_teh_ceri table
    try {
      await supabase.from('sabtu_beli_teh_ceri').update({ linkfoto: null }).not('linkfoto', 'is', null);
    } catch {
      // ignore if column doesn't exist
    }

    // 3. Remove files from any Supabase storage buckets if any were created
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      if (buckets && buckets.length > 0) {
        for (const bucket of buckets) {
          const { data: files } = await supabase.storage.from(bucket.name).list();
          if (files && files.length > 0) {
            const filePaths = files.map((f) => f.name);
            await supabase.storage.from(bucket.name).remove(filePaths);
          }
        }
      }
    } catch {
      // Storage buckets might not be initialized or accessible, ignore
    }

    return {
      success: true,
      message: 'Berhasil mengosongkan seluruh bukti fisik foto di database Supabase agar storage hemat dan tidak penuh.',
    };
  } catch (err) {
    console.warn('cleanupSupabaseStorageAndPhotos error:', err);
    return {
      success: false,
      message: 'Gagal mengosongkan foto di Supabase: ' + (err as Error).message,
    };
  }
}

export const saveTableData = saveTableRow;
export const deleteTableData = deleteTableRow;
