// Simplified spaced repetition inspired by ts-fsrs
// Tracks review intervals for memorized pages

export interface ReviewCard {
  page: number;
  interval: number;      // days until next review
  easeFactor: number;    // multiplier (starts at 2.5)
  repetitions: number;   // number of successful reviews
  nextReviewDate: string; // ISO date string
  lastReviewDate: string;
}

export type Rating = "again" | "hard" | "good" | "easy";

const RATING_MULTIPLIERS: Record<Rating, number> = {
  again: 0,
  hard: 0.8,
  good: 1.0,
  easy: 1.3,
};

/**
 * Create a new review card for a memorized page
 */
export function createCard(page: number): ReviewCard {
  const today = new Date().toISOString().split("T")[0];
  return {
    page,
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: today,
  };
}

/**
 * Review a card and calculate next interval
 */
export function reviewCard(card: ReviewCard, rating: Rating): ReviewCard {
  const today = new Date().toISOString().split("T")[0];
  
  if (rating === "again") {
    return {
      ...card,
      interval: 1,
      repetitions: 0,
      easeFactor: Math.max(1.3, card.easeFactor - 0.2),
      nextReviewDate: addDays(today, 1),
      lastReviewDate: today,
    };
  }

  const newReps = card.repetitions + 1;
  let newInterval: number;

  if (newReps === 1) {
    newInterval = 1;
  } else if (newReps === 2) {
    newInterval = 3;
  } else {
    newInterval = Math.round(card.interval * card.easeFactor * RATING_MULTIPLIERS[rating]);
  }

  newInterval = Math.max(1, Math.min(newInterval, 365));

  const newEase = card.easeFactor + (rating === "easy" ? 0.15 : rating === "hard" ? -0.15 : 0);

  return {
    ...card,
    interval: newInterval,
    repetitions: newReps,
    easeFactor: Math.max(1.3, newEase),
    nextReviewDate: addDays(today, newInterval),
    lastReviewDate: today,
  };
}

/**
 * Get cards due for review today
 */
export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  const today = new Date().toISOString().split("T")[0];
  return cards.filter((c) => c.nextReviewDate <= today);
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}
