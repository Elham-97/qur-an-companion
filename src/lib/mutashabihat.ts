// Mutashabihat (similar ayah) training data
// Each question shows a partial ayah and asks the user to pick the correct completion

export interface MutashabihQuestion {
  id: number;
  prompt: string; // The beginning of the ayah shown to user
  promptArabic: string;
  options: { text: string; arabic: string; correct: boolean; surah: string }[];
  explanation: string;
}

export const mutashabihQuestions: MutashabihQuestion[] = [
  {
    id: 1,
    prompt: "Which ayah continues: 'And when it is said to them, Do not cause corruption on the earth...'",
    promptArabic: "وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ...",
    options: [
      { text: "...they say, 'We are but reformers.'", arabic: "قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ", correct: true, surah: "Al-Baqarah 2:11" },
      { text: "...they say, 'We are only following our fathers.'", arabic: "قَالُوا إِنَّا وَجَدْنَا آبَاءَنَا", correct: false, surah: "Al-Baqarah 2:170" },
      { text: "...they say, 'We believe.'", arabic: "قَالُوا آمَنَّا", correct: false, surah: "Al-Baqarah 2:14" },
    ],
    explanation: "This is from Surah Al-Baqarah (2:11). The hypocrites claim to be reformers when they are told not to spread corruption.",
  },
  {
    id: 2,
    prompt: "Complete: 'Allah does not burden a soul beyond...'",
    promptArabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا...",
    options: [
      { text: "...its capacity", arabic: "وُسْعَهَا", correct: true, surah: "Al-Baqarah 2:286" },
      { text: "...what it has earned", arabic: "مَا كَسَبَتْ", correct: false, surah: "Al-Baqarah 2:286 (later part)" },
      { text: "...what He has given it", arabic: "مَا آتَاهَا", correct: false, surah: "At-Talaq 65:7" },
    ],
    explanation: "From Al-Baqarah (2:286). A similar phrasing in At-Talaq (65:7) uses 'mā ātāhā' — a common confusion point.",
  },
  {
    id: 3,
    prompt: "Which surah starts with: 'Alif Laam Meem. This is the Book...'",
    promptArabic: "الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ...",
    options: [
      { text: "...in which there is no doubt, a guidance for the Muttaqeen", arabic: "لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ", correct: true, surah: "Al-Baqarah 2:1-2" },
      { text: "...sent down to you, so let there be no distress in your heart", arabic: "أُنزِلَ إِلَيْكَ فَلَا يَكُن فِي صَدْرِكَ حَرَجٌ مِّنْهُ", correct: false, surah: "Al-A'raf 7:1-2" },
      { text: "...We relate to you the best of stories", arabic: "نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ", correct: false, surah: "Yusuf 12:3" },
    ],
    explanation: "Al-Baqarah starts with ALM followed by 'dhālika al-kitāb lā rayba fīh'. Al-A'raf also starts with ALM but continues differently.",
  },
  {
    id: 4,
    prompt: "Complete: 'Indeed, with hardship comes...'",
    promptArabic: "إِنَّ مَعَ الْعُسْرِ...",
    options: [
      { text: "...ease", arabic: "يُسْرًا", correct: true, surah: "Ash-Sharh 94:6" },
      { text: "...relief", arabic: "فَرَجًا", correct: false, surah: "Similar meaning, different word" },
      { text: "...patience", arabic: "صَبْرًا", correct: false, surah: "Not from this ayah" },
    ],
    explanation: "From Ash-Sharh (94:5-6), repeated twice for emphasis. The word is 'yusra' (ease), not 'faraja' (relief).",
  },
  {
    id: 5,
    prompt: "Which verse: 'And We have certainly made the Qur'an easy for...'",
    promptArabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ...",
    options: [
      { text: "...remembrance, so is there anyone who will remember?", arabic: "فَهَلْ مِن مُّدَّكِرٍ", correct: true, surah: "Al-Qamar 54:17" },
      { text: "...mankind, so is there anyone who will be grateful?", arabic: "فَهَلْ مِن شَاكِرٍ", correct: false, surah: "Not a real verse" },
      { text: "...understanding, so is there anyone who will reflect?", arabic: "فَهَلْ مِن مُتَفَكِّرٍ", correct: false, surah: "Not a real verse" },
    ],
    explanation: "This ayah from Al-Qamar (54:17) is repeated 4 times in the surah. The key word is 'muddakir' (one who remembers).",
  },
  {
    id: 6,
    prompt: "In Surah Al-Fatiha, after 'Master of the Day of Judgment'...",
    promptArabic: "مَالِكِ يَوْمِ الدِّينِ...",
    options: [
      { text: "It is You we worship and You we ask for help", arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", correct: true, surah: "Al-Fatiha 1:5" },
      { text: "Guide us to the straight path", arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", correct: false, surah: "Al-Fatiha 1:6 (next ayah)" },
      { text: "In the name of Allah, the Most Gracious", arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ", correct: false, surah: "Al-Fatiha 1:1 (first ayah)" },
    ],
    explanation: "After 'Māliki yawmid-dīn' comes 'Iyyāka na'budu wa iyyāka nasta'īn'. A common mistake is jumping to the next ayah.",
  },
  {
    id: 7,
    prompt: "Complete: 'So remember Me; I will remember you. And be grateful to Me and...'",
    promptArabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَ...",
    options: [
      { text: "...do not deny Me", arabic: "لَا تَكْفُرُونِ", correct: true, surah: "Al-Baqarah 2:152" },
      { text: "...do not disobey Me", arabic: "لَا تَعْصُونِ", correct: false, surah: "Not from this ayah" },
      { text: "...worship Me alone", arabic: "اعْبُدُونِي", correct: false, surah: "Not from this ayah" },
    ],
    explanation: "Al-Baqarah (2:152). The ending is 'wa lā takfurūn' (do not deny/be ungrateful to Me).",
  },
  {
    id: 8,
    prompt: "'Wherever you may be, death will overtake you, even if you were in...'",
    promptArabic: "أَيْنَمَا تَكُونُوا يُدْرِككُّمُ الْمَوْتُ وَلَوْ كُنتُمْ فِي...",
    options: [
      { text: "...lofty towers", arabic: "بُرُوجٍ مُّشَيَّدَةٍ", correct: true, surah: "An-Nisa 4:78" },
      { text: "...fortified castles", arabic: "قُصُورٍ حَصِينَةٍ", correct: false, surah: "Not a real verse" },
      { text: "...the depths of the earth", arabic: "أَعْمَاقِ الْأَرْضِ", correct: false, surah: "Not a real verse" },
    ],
    explanation: "An-Nisa (4:78). The correct phrase is 'burūjin mushayyadah' (lofty/fortified towers).",
  },
];

// Track user mistakes in localStorage
const MISTAKES_KEY = "mutashabih_mistakes";

export function getMistakes(): Record<number, number> {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function recordMistake(questionId: number) {
  const mistakes = getMistakes();
  mistakes[questionId] = (mistakes[questionId] || 0) + 1;
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
}

export function getWeakQuestions(): MutashabihQuestion[] {
  const mistakes = getMistakes();
  return mutashabihQuestions.filter((q) => (mistakes[q.id] || 0) >= 1)
    .sort((a, b) => (mistakes[b.id] || 0) - (mistakes[a.id] || 0));
}
