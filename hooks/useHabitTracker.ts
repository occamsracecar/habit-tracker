"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createClient,
  formatSupabaseRequestError,
  supabaseConfigurationError,
} from "../lib/supabase";
import {
  getCurrentMonthDateRange,
  getDateForDayIndex,
  getRandomCoinValue,
  isFutureDayIndex,
} from "../lib/utils";
import type { Database } from "../types/database";

type Habit = Database["public"]["Tables"]["habits"]["Row"];
type Completion = Database["public"]["Tables"]["completions"]["Row"];

export type HabitWithCompletions = Habit & {
  completions: Completion[];
};

type CompletionMap = Record<string, Record<number, Completion>>;

function buildCompletionMap(completions: Completion[]) {
  return completions.reduce<CompletionMap>((map, completion) => {
    map[completion.habit_id] = {
      ...map[completion.habit_id],
      [completion.day_index]: completion,
    };

    return map;
  }, {});
}

function buildHabitsWithCompletions(
  habits: Habit[],
  completionsByHabitId: CompletionMap,
) {
  return habits.map((habit) => ({
    ...habit,
    completions: Object.values(completionsByHabitId[habit.id] ?? {}),
  }));
}

function removeCompletionFromMap(
  currentMap: CompletionMap,
  habitId: string,
  dayIndex: number,
) {
  const completionsForHabit = { ...currentMap[habitId] };
  delete completionsForHabit[dayIndex];

  return {
    ...currentMap,
    [habitId]: completionsForHabit,
  };
}

export function useHabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completionsByHabitId, setCompletionsByHabitId] =
    useState<CompletionMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { startDate, endDate } = getCurrentMonthDateRange();
    const supabase = createClient();

    if (!supabase) {
      setHabits([]);
      setCompletionsByHabitId({});
      setError(supabaseConfigurationError);
      setIsLoading(false);
      return;
    }

    const { data: habitRows, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: true });

    if (habitsError) {
      setError(formatSupabaseRequestError(habitsError));
      setIsLoading(false);
      return;
    }

    const { data: completionRows, error: completionsError } = await supabase
      .from("completions")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate);

    if (completionsError) {
      setError(formatSupabaseRequestError(completionsError));
      setIsLoading(false);
      return;
    }

    setHabits(habitRows ?? []);
    setCompletionsByHabitId(buildCompletionMap(completionRows ?? []));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => fetchHabits());
  }, [fetchHabits]);

  const addHabit = useCallback(
    async (name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return null;
      }

      const supabase = createClient();

      if (!supabase) {
        setError(supabaseConfigurationError);
        return null;
      }

      const habit: Habit = {
        id: crypto.randomUUID(),
        name: trimmedName,
        created_at: new Date().toISOString(),
      };

      setHabits((currentHabits) => [...currentHabits, habit]);
      setError(null);

      const { error: insertError } = await supabase.from("habits").insert({
        id: habit.id,
        name: habit.name,
        created_at: habit.created_at,
      });

      if (insertError) {
        setHabits((currentHabits) =>
          currentHabits.filter((currentHabit) => currentHabit.id !== habit.id),
        );
        setError(formatSupabaseRequestError(insertError));
        return null;
      }

      return habit;
    },
    [],
  );

  const toggleBox = useCallback(
    (habitId: string, dayIndex: number) => {
      if (isFutureDayIndex(dayIndex)) {
        return null;
      }

      const supabase = createClient();

      if (!supabase) {
        setError(supabaseConfigurationError);
        return null;
      }

      const currentCompletion = completionsByHabitId[habitId]?.[dayIndex];

      if (currentCompletion) {
        setCompletionsByHabitId((currentMap) => {
          return removeCompletionFromMap(currentMap, habitId, dayIndex);
        });
        setError(null);

        void (async () => {
          const { error: deleteError } = await supabase
            .from("completions")
            .delete()
            .eq("id", currentCompletion.id);

          if (deleteError) {
            setCompletionsByHabitId((currentMap) => ({
              ...currentMap,
              [habitId]: {
                ...currentMap[habitId],
                [dayIndex]: currentCompletion,
              },
            }));
            setError(formatSupabaseRequestError(deleteError));
          }
        })();

        return null;
      }

      const completion: Completion = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        day_index: dayIndex,
        coins_earned: getRandomCoinValue(),
        date: getDateForDayIndex(dayIndex),
      };

      setCompletionsByHabitId((currentMap) => ({
        ...currentMap,
        [habitId]: {
          ...currentMap[habitId],
          [dayIndex]: completion,
        },
      }));
      setError(null);

      void (async () => {
        const { error: insertError } = await supabase
          .from("completions")
          .insert(completion);

        if (insertError) {
          setCompletionsByHabitId((currentMap) => {
            return removeCompletionFromMap(currentMap, habitId, dayIndex);
          });
          setError(formatSupabaseRequestError(insertError));
        }
      })();

      return completion;
    },
    [completionsByHabitId],
  );

  const habitsWithCompletions = useMemo(
    () => buildHabitsWithCompletions(habits, completionsByHabitId),
    [habits, completionsByHabitId],
  );

  const totalCoins = useMemo(
    () =>
      Object.values(completionsByHabitId).reduce(
        (total, completionsByDay) =>
          total +
          Object.values(completionsByDay).reduce(
            (habitTotal, completion) => habitTotal + completion.coins_earned,
            0,
          ),
        0,
      ),
    [completionsByHabitId],
  );

  return {
    habits: habitsWithCompletions,
    completionsByHabitId,
    totalCoins,
    isLoading,
    error,
    fetchHabits,
    addHabit,
    toggleBox,
  };
}
