// Qur'an structure data
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const PAGES_PER_JUZ = Math.ceil(TOTAL_PAGES / TOTAL_JUZ);

export const tajwidRules = [
  { id: 1, name: "Madd Tabii'i", description: "Natural prolongation of 2 counts", example: "قَالُوا" },
  { id: 2, name: "Madd Muttasil", description: "Connected prolongation of 4-5 counts", example: "جَاءَ" },
  { id: 3, name: "Madd Munfasil", description: "Separated prolongation of 4-5 counts", example: "فِي أَنفُسِهِمْ" },
  { id: 4, name: "Idghaam", description: "Merging of noon sakinah into following letter", example: "مَن يَقُول" },
  { id: 5, name: "Ikhfaa", description: "Hiding of noon sakinah", example: "مِنْ تَحْتِهَا" },
  { id: 6, name: "Iqlaab", description: "Converting noon sakinah to meem before baa", example: "مِنْ بَعْدِ" },
  { id: 7, name: "Idhaar", description: "Clear pronunciation of noon sakinah", example: "مِنْ عِلْمٍ" },
  { id: 8, name: "Qalqalah", description: "Echo/bounce on sukoon letters (ق ط ب ج د)", example: "يَخْلُقْ" },
  { id: 9, name: "Ghunnah", description: "Nasal sound for 2 counts", example: "إِنَّ" },
  { id: 10, name: "Madd Laazim", description: "Obligatory prolongation of 6 counts", example: "الْحَاقَّة" },
];

export function getTodaysTajwid(): typeof tajwidRules[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tajwidRules[dayOfYear % tajwidRules.length];
}

export function getJuzForDay(day: number): number {
  return (day % TOTAL_JUZ) + 1;
}
