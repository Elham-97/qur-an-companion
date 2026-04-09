import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface HifzData {
  totalPagesMemorized: number;
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

const defaultData: HifzData = {
  totalPagesMemorized: 0,
  completedToday: { hifz: false, muraja: false, fixing: false, tajwid: false },
  streakDays: 0,
  lastActiveDate: "",
  weakPages: [12, 45, 78, 134, 201],
  currentHifzPages: [1, 2],
  currentMurajaJuz: 1,
};

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export function useHifzData() {
  const { user } = useAuth();
  const [data, setData] = useState<HifzData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data() as HifzData;
        const today = getTodayStr();
        if (d.lastActiveDate !== today) {
          d.completedToday = { hifz: false, muraja: false, fixing: false, tajwid: false };
          // Update streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (d.lastActiveDate === yesterday.toISOString().split("T")[0]) {
            d.streakDays += 1;
          } else if (d.lastActiveDate !== today) {
            d.streakDays = 0;
          }
          d.lastActiveDate = today;
          await updateDoc(ref, d as any);
        }
        setData(d);
      } else {
        const initial = { ...defaultData, lastActiveDate: getTodayStr() };
        await setDoc(ref, initial);
        setData(initial);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const updateData = async (partial: Partial<HifzData>) => {
    if (!user) return;
    const updated = { ...data, ...partial };
    setData(updated);
    await updateDoc(doc(db, "users", user.uid), partial as any);
  };

  const completeTask = async (task: keyof HifzData["completedToday"]) => {
    const completedToday = { ...data.completedToday, [task]: true };
    let updates: Partial<HifzData> = { completedToday, lastActiveDate: getTodayStr() };

    if (task === "hifz") {
      updates.totalPagesMemorized = data.totalPagesMemorized + 2;
      updates.currentHifzPages = [data.currentHifzPages[1] + 1, data.currentHifzPages[1] + 2] as [number, number];
    }
    if (task === "muraja") {
      updates.currentMurajaJuz = (data.currentMurajaJuz % 30) + 1;
    }

    // Check if all tasks done → increment streak
    const allDone = Object.values(completedToday).every(Boolean);
    if (allDone) {
      updates.streakDays = data.streakDays + 1;
    }

    await updateData(updates);
  };

  const completionRate = () => {
    const done = Object.values(data.completedToday).filter(Boolean).length;
    return done / 4;
  };

  return { data, loading, completeTask, updateData, completionRate };
}
