const appreciationMessages = [
  "Good consistency today.",
  "Steady progress. Keep going.",
  "Well done. Protect this habit.",
  "May Allah bless your effort.",
  "One more step closer to completion.",
  "Your dedication is inspiring.",
  "Consistent hearts are the strongest.",
  "Beautiful work today. Rest well.",
];

const suggestionsByState = {
  consistent: [
    "You are stable. Maintain this pace.",
    "Your consistency is strong. Stay the course.",
    "Excellent rhythm. Don't change what works.",
  ],
  inconsistent: [
    "Consider reducing your daily load.",
    "Smaller steps lead to lasting progress.",
    "Try focusing on fewer pages with deeper review.",
  ],
  highMistakes: [
    "Focus on slow, careful revision today.",
    "Quality over quantity — review with attention.",
    "Slow down and strengthen what you know.",
  ],
  imbalanced: [
    "Balance memorization and revision equally.",
    "Don't forget to revise alongside new hifz.",
    "Muraja'a protects what you've memorized.",
  ],
};

export function getAppreciation(): string {
  return appreciationMessages[Math.floor(Math.random() * appreciationMessages.length)];
}

export function getSuggestion(state: "consistent" | "inconsistent" | "highMistakes" | "imbalanced"): string {
  const msgs = suggestionsByState[state];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function analyzeBehavior(data: {
  streakDays: number;
  completionRate: number;
  weakPages: number;
  hifzDone: boolean;
  murajaDone: boolean;
}): string {
  if (data.weakPages > 5) return getSuggestion("highMistakes");
  if (data.hifzDone && !data.murajaDone) return getSuggestion("imbalanced");
  if (!data.hifzDone && data.murajaDone) return getSuggestion("imbalanced");
  if (data.completionRate < 0.5) return getSuggestion("inconsistent");
  return getSuggestion("consistent");
}
