import React from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Component for selecting recurrence options
 * @returns {JSX.Element} Recurrence options UI
 */
export default function RecurrenceOptions() {
  const { recurrence, setRecurrence } = useAppContext();
  const recurrenceTypes = ['daily', 'weekly', 'monthly', 'yearly'];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Recurrence Type</label>
        <select
          value={recurrence.type}
          onChange={(e) => setRecurrence({ type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Select recurrence type"
        >
          {recurrenceTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Every</label>
        <input
          type="number"
          min="1"
          value={recurrence.interval}
          onChange={(e) => setRecurrence({ interval: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Set recurrence interval"
        />
      </div>

      {recurrence.type === 'weekly' && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Days of Week</label>
          <div className="mt-1 grid grid-cols-4 gap-1 sm:gap-2">
            {daysOfWeek.map((day, index) => (
              <label key={day} className="flex items-center text-xs sm:text-sm text-gray-900 dark:text-white">
                <input
                  type="checkbox"
                  checked={recurrence.daysOfWeek?.includes(index) || false}
                  onChange={(e) => {
                    const currentDays = recurrence.daysOfWeek || [];
                    const newDays = e.target.checked ? [...currentDays, index] : currentDays.filter((d) => d !== index);
                    setRecurrence({ daysOfWeek: newDays });
                  }}
                  className="mr-1 sm:mr-2"
                  aria-label={`Select ${day}`}
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
      )}

      {recurrence.type === 'monthly' && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Day of Month</label>
          <input
            type="number"
            min="1"
            max="31"
            value={recurrence.dayOfMonth || ''}
            onChange={(e) => setRecurrence({ dayOfMonth: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            aria-label="Set day of month"
          />
        </div>
      )}

      {recurrence.type === 'yearly' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Month</label>
            <select
              value={recurrence.monthOfYear || 0}
              onChange={(e) => setRecurrence({ monthOfYear: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Select month for yearly recurrence"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Day of Month</label>
            <input
              type="number"
              min="1"
              max="31"
              value={recurrence.dayOfMonth || ''}
              onChange={(e) => setRecurrence({ dayOfMonth: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              aria-label="Set day of month for yearly recurrence"
            />
          </div>
        </div>
      )}
    </div>
  );
}