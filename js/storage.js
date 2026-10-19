/**
 * Modul penyimpanan data portofolio (localStorage & seed).
 * Mematuhi aturan PRD: data section yang sengaja dikosongkan (termasuk array kosong)
 * tetap tampil kosong dan tidak digantikan oleh seed data.
 */

const STORAGE_PREFIX = 'portfolio_';
const SEED_FILE_PATH = './data/seed.json';
const FALLBACK_SEED_FILE_PATH = './data/portfolio.json';

export const SECTIONS = ['home', 'about', 'tools', 'projects', 'experience', 'contact'];

let seedCache = null;

/**
 * Normalisasi nama section untuk konsistensi key.
 */
export function normalizeSectionKey(section) {
  if (typeof section !== 'string') return '';
  const trimmed = section.trim().toLowerCase();
  if (trimmed === 'hero') return 'home';
  if (trimmed === 'skills' || trimmed === 'skill') return 'tools';
  if (trimmed === 'project') return 'projects';
  if (trimmed === 'about-me' || trimmed === 'aboutme') return 'about';
  return trimmed;
}

/**
 * Menghasilkan key localStorage dengan prefix standar.
 */
export function getStorageKey(section) {
  const normalized = normalizeSectionKey(section);
  return `${STORAGE_PREFIX}${normalized}`;
}

/**
 * Memuat seed data dari file bawaan dengan sistem cache memori.
 */
export async function getSeedData() {
  if (seedCache !== null) {
    return seedCache;
  }

  // Jika seed sudah disematkan di objek global (misal pengujian atau inline)
  if (typeof window !== 'undefined' && window.__PORTFOLIO_SEED__) {
    seedCache = window.__PORTFOLIO_SEED__;
    return seedCache;
  }

  try {
    const response = await fetch(SEED_FILE_PATH);
    if (!response.ok) {
      const fallbackResponse = await fetch(FALLBACK_SEED_FILE_PATH);
      if (!fallbackResponse.ok) {
        throw new Error(`Gagal memuat seed (${response.status} & fallback ${fallbackResponse.status})`);
      }
      seedCache = await fallbackResponse.json();
      return seedCache;
    }
    seedCache = await response.json();
    return seedCache;
  } catch (error) {
    console.error('Gagal mengambil data seed dari server/lokal:', error);
    return null;
  }
}

/**
 * Mengambil data section dari localStorage.
 * Cek eksplisit key === null: jika key belum pernah disimpan maka gunakan seed.
 * Jika key sudah ada di localStorage, data dikembalikan apa adanya (termasuk array kosong).
 */
export async function getData(section) {
  // Jika tanpa parameter section, ambil seluruh data gabungan
  if (!section) {
    return exportAll(false);
  }

  const normalized = normalizeSectionKey(section);
  const primaryKey = getStorageKey(normalized);

  let raw = null;
  if (typeof localStorage !== 'undefined') {
    raw = localStorage.getItem(primaryKey);
    // Kompatibilitas mundur jika sebelumnya disimpan tanpa prefix
    if (raw === null) {
      raw = localStorage.getItem(normalized);
    }
  }

  // Aturan PRD: Cek key === null. Jangan gunakan !data atau length === 0.
  // Data kosong yang sengaja disimpan di CMS harus tetap dikembalikan apa adanya.
  if (raw === null) {
    const seed = await getSeedData();
    if (!seed) return null;
    return seed[normalized] ?? null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Gagal mem-parse JSON untuk section "${section}":`, error);
    const seed = await getSeedData();
    return seed ? (seed[normalized] ?? null) : null;
  }
}

/**
 * Menyimpan data section ke localStorage dalam bentuk string JSON.
 */
export function saveData(section, data) {
  if (!section) {
    throw new Error('Parameter "section" harus disertakan.');
  }

  const normalized = normalizeSectionKey(section);
  const key = getStorageKey(normalized);

  try {
    const serialized = JSON.stringify(data);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, serialized);
    }
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22) {
      const quotaErr = new Error('Kapasitas penyimpanan browser (localStorage ~5MB) terlampaui (QuotaExceededError).');
      quotaErr.name = 'QuotaExceededError';
      throw quotaErr;
    }
    console.error(`Gagal menyimpan data section "${normalized}" ke localStorage:`, error);
    throw error;
  }
}

/**
 * Mengekspor seluruh data section.
 * Section yang belum diedit di localStorage akan memuat nilai dari seed.
 */
export async function exportAll(asString = false) {
  const result = {};

  for (const section of SECTIONS) {
    result[section] = await getData(section);
  }

  return asString ? JSON.stringify(result, null, 2) : result;
}

/**
 * Mengimpor data JSON dan menyimpannya per section ke localStorage.
 * Menerima argumen berupa string JSON atau object.
 */
export function importAll(json) {
  let parsed = json;

  if (typeof json === 'string') {
    try {
      parsed = JSON.parse(json);
    } catch (error) {
      throw new Error(`Format JSON tidak valid: ${error.message}`);
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Data import harus berupa object JSON yang memuat section portofolio.');
  }

  const importedSections = [];

  for (const [sectionKey, sectionData] of Object.entries(parsed)) {
    const normalized = normalizeSectionKey(sectionKey);
    saveData(normalized, sectionData);
    importedSections.push(normalized);
  }

  return {
    success: true,
    sections: importedSections
  };
}

/**
 * Menghapus data section dari localStorage sehingga kembali memakai data seed.
 */
export function resetSection(section) {
  const normalized = normalizeSectionKey(section);
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(getStorageKey(normalized));
    localStorage.removeItem(normalized);
  }
}

/**
 * Menghapus seluruh data portofolio dari localStorage.
 */
export function resetAll() {
  if (typeof localStorage !== 'undefined') {
    for (const section of SECTIONS) {
      localStorage.removeItem(getStorageKey(section));
      localStorage.removeItem(section);
    }
  }
}

/**
 * Memeriksa apakah section sudah pernah disimpan di localStorage.
 */
export function hasCustomData(section) {
  if (typeof localStorage === 'undefined') return false;
  const normalized = normalizeSectionKey(section);
  return (
    localStorage.getItem(getStorageKey(normalized)) !== null ||
    localStorage.getItem(normalized) !== null
  );
}

// Global exposure agar dapat dipanggil langsung via script tag maupun import module
if (typeof window !== 'undefined') {
  window.PortfolioStorage = {
    SECTIONS,
    normalizeSectionKey,
    getStorageKey,
    getSeedData,
    getData,
    saveData,
    exportAll,
    importAll,
    resetSection,
    resetAll,
    hasCustomData
  };
}

export default {
  SECTIONS,
  normalizeSectionKey,
  getStorageKey,
  getSeedData,
  getData,
  saveData,
  exportAll,
  importAll,
  resetSection,
  resetAll,
  hasCustomData
};
