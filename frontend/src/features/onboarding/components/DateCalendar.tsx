"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  addMonths,
  formatMonthYear,
  getMonthMatrix,
  getWeekdayLabels,
  isSameDay,
} from "@/features/onboarding/utils/calendar";

export interface DateCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  disabled?: boolean;
  className?: string;
}

const weekdayLabels = getWeekdayLabels();

/**
 * Minimal month calendar for selecting a single past-or-present date.
 * Future dates are disabled — Day One can't be in the future.
 */
export function DateCalendar({
  selectedDate,
  onSelectDate,
  disabled = false,
  className,
}: DateCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewedMonth, setViewedMonth] = useState(
    () => new Date((selectedDate ?? today).getFullYear(), (selectedDate ?? today).getMonth(), 1),
  );

  const days = useMemo(
    () => getMonthMatrix(viewedMonth, today),
    [viewedMonth, today],
  );

  const isNextMonthDisabled =
    viewedMonth.getFullYear() === today.getFullYear() &&
    viewedMonth.getMonth() === today.getMonth();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setViewedMonth((current) => addMonths(current, -1))}
          disabled={disabled}
          aria-label="Previous month"
          className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-subtle disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>

        <p className="text-body-md font-medium text-text-primary">
          {formatMonthYear(viewedMonth)}
        </p>

        <button
          type="button"
          onClick={() => setViewedMonth((current) => addMonths(current, 1))}
          disabled={disabled || isNextMonthDisabled}
          aria-label="Next month"
          className="flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-subtle disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div
        role="grid"
        aria-label={formatMonthYear(viewedMonth)}
        className="mt-4 grid grid-cols-7 gap-y-1"
      >
        {weekdayLabels.map((label, index) => (
          <div
            key={`${label}-${index}`}
            role="columnheader"
            aria-hidden="true"
            className="flex h-8 items-center justify-center text-caption font-medium text-text-muted"
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false;
          const isDisabled = disabled || day.isFuture || !day.isCurrentMonth;

          return (
            <div
              key={day.date.toISOString()}
              role="gridcell"
              className="flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => onSelectDate(day.date)}
                disabled={isDisabled}
                aria-label={day.date.toDateString()}
                aria-pressed={isSelected}
                aria-disabled={isDisabled || undefined}
                tabIndex={!day.isCurrentMonth ? -1 : undefined}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-body-sm transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                  !day.isCurrentMonth && "invisible",
                  day.isCurrentMonth && !isSelected && !day.isFuture && "text-text-primary hover:bg-bg-subtle",
                  day.isFuture && day.isCurrentMonth && "text-text-disabled",
                  day.isToday && !isSelected && "font-semibold text-primary-600",
                  isSelected && "bg-primary-500 font-semibold text-text-inverse hover:bg-primary-500",
                )}
              >
                {day.date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
