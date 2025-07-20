import React from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

/**
 * Component for selecting date range
 * @returns {JSX.Element} Date range picker UI
 */
export default function DateRangePicker() {
  const { dateRange, setDateRange } = useAppContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
        <input
          type="date"
          value={format(dateRange.startDate, 'yyyy-MM-dd')}
          onChange={(e) => setDateRange({ startDate: new Date(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Select start date"
          required
        />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">End Date (Optional)</label>
        <input
          type="date"
          value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => setDateRange({ endDate: e.target.value ? new Date(e.target.value) : undefined })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Select end date"
        />
      </div>
    </div>
  );
}