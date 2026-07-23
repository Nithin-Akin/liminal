export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function getWeekdayLabels(): string[] {
  return WEEKDAY_LABELS;
}

/** True if two dates fall on the same calendar day (ignores time). */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Strips time so date-only comparisons (e.g. "is this in the future") are reliable. */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

/**
 * Builds a full calendar grid (always complete weeks) for the given month,
 * padded with leading/trailing days from adjacent months for layout only.
 */
export function getMonthMatrix(viewedMonth: Date, today: Date): CalendarDay[] {
  const year = viewedMonth.getFullYear();
  const month = viewedMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const totalCells = 42; // 6 weeks, keeps grid height stable across months
  const todayStart = startOfDay(today);

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    return {
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDay(date, today),
      isFuture: startOfDay(date) > todayStart,
    };
  });
}
