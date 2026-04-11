import { useState, useEffect, useCallback } from "react";

export interface MemorizedPage {
  page: number;
  date: string;
  strength: "strong" | "weak" | "new";
}

export interface HifzData {
  totalPagesMemorized: number;
  memorizedPages: MemorizedPage[];
  completedToday: {
    hifz: boolean;
    muraja: boolean;
    fixing: boolean;
    tajwid: boolean;
  };
  streakDays: number;
  lastActiveDate: string;
  weakPages: number[];
  currentHifzPages: [number, number];
  currentMurajaJuz: number;
}

const STORAGE_KEY = "hifz_data";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function loadData(): HifzData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw) as HifzData;
      const today = getTodayStr();
      if (d.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.lastActiveDate === yesterday.toISOString().split("T")[0]) {
          d.streakDays += 1;
        } else {
          d.streakDays = 0;
        }
        d.completedToday = { hifz: false, muraja: false, fixing: false, tajwid: false };
        d.lastActiveDate = today;
      }
      if (!d.memorizedPages) d.memorizedPages = [];
      return d;
    }
  } catch {}
  return {
    totalPagesMemorized: 0,
    memorizedPages: [],
    completedToday: { hifz: false, muraja: false, fixing: false, tajwid: false },
    streakDays: 0,
    lastActiveDate: getTodayStr(),
    weakPages: [],
    currentHifzPages: [1, 2],
    currentMurajaJuz: 1,
  };
}

export function useHifzData() {
  const [data, setData] = useState<HifzData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((partial: Partial<HifzData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const addPages = useCallback((pages: number[]) => {
    setData((prev) => {
      const existing = new Set(prev.memorizedPages.map((p) => p.page));
      const newPages: MemorizedPage[] = pages
        .filter((p) => !existing.has(p))
        .map((p) => ({ page: p, date: getTodayStr(), strength: "new" as const }));
      const memorizedPages = [...prev.memorizedPages, ...newPages];
      const weakPages = memorizedPages.filter((p) => p.strength === "weak").map((p) => p.page);
      return {
        ...prev,
        memorizedPages,
        totalPagesMemorized: memorizedPages.length,
        weakPages,
        currentHifzPages: [
          memorizedPages.length + 1,
          memorizedPages.length + 2,
        ] as [number, number],
      };
    });
  }, []);

  const removePage = useCallback((page: number) => {
    setData((prev) => {
      const memorizedPages = prev.memorizedPages.filter((p) => p.page !== page);
      const weakPages = memorizedPages.filter((p) => p.strength === "weak").map((p) => p.page);
      return {
        ...prev,
        memorizedPages,
        totalPagesMemorized: memorizedPages.length,
        weakPages,
      };
    });
  }, []);

  const setPageStrength = useCallback((page: number, strength: "strong" | "weak") => {
    setData((prev) => {
      const memorizedPages = prev.memorizedPages.map((p) =>
        p.page === page ? { ...p, strength } : p
      );
      const weakPages = memorizedPages.filter((p) => p.strength === "weak").map((p) => p.page);
      return { ...prev, memorizedPages, weakPages };
    });
  }, []);

  const completeTask = useCallback(async (task: keyof HifzData["completedToday"]) => {
    setData((prev) => {
      const completedToday = { ...prev.completedToday, [task]: true };
      let updates: Partial<HifzData> = { completedToday, lastActiveDate: getTodayStr() };
      if (task === "muraja") {
        updates.currentMurajaJuz = (prev.currentMurajaJuz % 30) + 1;
      }
      const allDone = Object.values(completedToday).every(Boolean);
      if (allDone) {
        updates.streakDays = prev.streakDays + 1;
      }
      return { ...prev, ...updates };
    });
  }, []);

  const completionRate = useCallback(() => {
    const done = Object.values(data.completedToday).filter(Boolean).length;
    return done / 4;
  }, [data.completedToday]);

  return { data, loading: false, completeTask, updateData, completionRate, addPages, removePage, setPageStrength };
}
