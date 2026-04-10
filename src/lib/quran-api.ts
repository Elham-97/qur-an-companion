// Quran.com API v4 integration
const BASE_URL = "https://api.quran.com/api/v4";

export interface Ayah {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translation?: string;
}

export interface PageData {
  verses: Ayah[];
  pagination: { total_records: number };
}

/**
 * Fetch all ayahs for a given Quran page (1–604)
 */
export async function fetchPage(pageNumber: number): Promise<Ayah[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/verses/by_page/${pageNumber}?language=en&words=false&fields=text_uthmani&translations=131&per_page=50`
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.verses.map((v: any) => ({
      id: v.id,
      verse_number: v.verse_number,
      verse_key: v.verse_key,
      text_uthmani: v.text_uthmani,
      translation: data.translations?.[0]?.text || v.translations?.[0]?.text || "",
    }));
  } catch (err) {
    console.error("Failed to fetch page:", err);
    return [];
  }
}

/**
 * Fetch a single ayah by key (e.g. "2:255")
 */
export async function fetchAyah(verseKey: string): Promise<Ayah | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/verses/by_key/${verseKey}?language=en&words=false&fields=text_uthmani&translations=131`
    );
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const v = data.verse;
    return {
      id: v.id,
      verse_number: v.verse_number,
      verse_key: v.verse_key,
      text_uthmani: v.text_uthmani,
      translation: v.translations?.[0]?.text || "",
    };
  } catch (err) {
    console.error("Failed to fetch ayah:", err);
    return null;
  }
}
