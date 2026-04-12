import { useState, useEffect, useCallback } from "react";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO date string
}

export interface TodoStreak {
  count: number;
  lastActiveDate: string;
}

const TODOS_KEY = "hifz_todos";
const STREAK_KEY = "hifz_todo_streak";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadStreak(): TodoStreak {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastActiveDate: "" };
}

function updateStreakOnComplete(streak: TodoStreak): TodoStreak {
  const today = getTodayStr();
  if (streak.lastActiveDate === today) return streak;
  if (streak.lastActiveDate === getYesterdayStr()) {
    return { count: streak.count + 1, lastActiveDate: today };
  }
  return { count: 1, lastActiveDate: today };
}

function checkStreakReset(streak: TodoStreak): TodoStreak {
  const today = getTodayStr();
  if (streak.lastActiveDate === today || streak.lastActiveDate === getYesterdayStr()) {
    return streak;
  }
  return { count: 0, lastActiveDate: streak.lastActiveDate };
}

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>(loadTodos);
  const [streak, setStreak] = useState<TodoStreak>(() => checkStreakReset(loadStreak()));

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }, [streak]);

  const addTodo = useCallback((text: string) => {
    const item: TodoItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: text.trim(),
      completed: false,
      createdAt: getTodayStr(),
    };
    setTodos((prev) => [item, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, completed: !t.completed };
        if (updated.completed) {
          setStreak((s) => updateStreakOnComplete(s));
        }
        return updated;
      })
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const todayTodos = todos.filter((t) => !t.completed && t.createdAt === getTodayStr());
  const completedTodos = todos.filter((t) => t.completed);

  return { todos, todayTodos, completedTodos, streak, addTodo, toggleTodo, deleteTodo };
}
