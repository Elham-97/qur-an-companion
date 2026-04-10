// EveryAyah.com audio API
// Reciter: Mishary Rashid Alafasy

const RECITER_BASE = "https://everyayah.com/data/Alafasy_128kbps";

/**
 * Get audio URL for a specific ayah
 * @param surah - Surah number (1-114)
 * @param ayah - Ayah number within the surah
 */
export function getAyahAudioUrl(surah: number, ayah: number): string {
  const surahStr = String(surah).padStart(3, "0");
  const ayahStr = String(ayah).padStart(3, "0");
  return `${RECITER_BASE}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Parse a verse key like "2:255" into {surah, ayah}
 */
export function parseVerseKey(verseKey: string): { surah: number; ayah: number } {
  const [surah, ayah] = verseKey.split(":").map(Number);
  return { surah, ayah };
}
