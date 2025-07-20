import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

/**
 * Mini calendar component for previewing recurring dates
 * @param {Object} props
 * @param {Date[]} props.highlightedDates - Dates to highlight
 * @returns {JSX.Element} Calendar UI
 */
export default function Calendar({ highlightedDates }) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm" role="grid" aria-label="Calendar preview">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="text-center font-medium text-gray-900 dark:text-white">
          {day}
        </div>
      ))}
      {days.map((day) => (
        <div
          key={day.toISOString()}
          className={`text-center p-1 sm:p-2 ${
            highlightedDates.some((d) => isSameDay(d, day))
              ? 'bg-blue-500 text-white rounded-full'
              : 'text-gray-900 dark:text-white'
          }`}
          role="gridcell"
          aria-label={`Day ${format(day, 'd')}`}
        >
          {format(day, 'd')}
        </div>
      ))}
    </div>
  );
}