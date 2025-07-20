import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, addDays, addWeeks, addMonths, addYears, isSameDay } from 'date-fns';
import Calendar from './Calendar';
import RecurrenceOptions from './RecurrenceOptions';
import DateRangePicker from './DateRangePicker';

/**
 * Main recurring date picker component
 * @returns {JSX.Element} Recurring date picker UI
 */
export default function RecurringDatePicker() {
  const { recurrence, dateRange, user, saveEvent } = useAppContext();
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const getRecurringDates = useMemo(() => {
    const dates = [];
    let currentDate = new Date(dateRange.startDate);
    const maxIterations = 100;
    let iterations = 0;

    while ((!dateRange.endDate || currentDate <= dateRange.endDate) && iterations < maxIterations) {
      dates.push(new Date(currentDate));
      switch (recurrence.type) {
        case 'daily':
          currentDate = addDays(currentDate, recurrence.interval);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, recurrence.interval);
          if (recurrence.daysOfWeek) {
            const nextValidDate = new Date(currentDate);
            while (!recurrence.daysOfWeek.includes(nextValidDate.getDay())) {
              nextValidDate.setDate(nextValidDate.getDate() + 1);
            }
            currentDate = nextValidDate;
          }
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, recurrence.interval);
          if (recurrence.dayOfMonth) {
            currentDate.setDate(recurrence.dayOfMonth);
          }
          break;
        case 'yearly':
          currentDate = addYears(currentDate, recurrence.interval);
          if (recurrence.monthOfYear && recurrence.dayOfMonth) {
            currentDate.setMonth(recurrence.monthOfYear);
            currentDate.setDate(recurrence.dayOfMonth);
          }
          break;
      }
      iterations++;
    }
    return dates;
  }, [recurrence, dateRange]);

  const handleSaveEvent = () => {
    if (!eventName || !user) return;
    saveEvent({ name: eventName, description: eventDescription, recurrence, dateRange }, user.uid);
    setEventName('');
    setEventDescription('');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Event "${eventName}" scheduled for ${format(dateRange.startDate, 'PPP')}`);
    }
  };

  const handleShare = () => {
    const eventData = JSON.stringify({ name: eventName, description: eventDescription, recurrence, dateRange });
    const shareUrl = `${window.location.origin}/import?data=${encodeURIComponent(eventData)}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Shareable link copied to clipboard!');
  };

  const handleExport = () => {
    const eventData = JSON.stringify({ name: eventName, description: eventDescription, recurrence, dateRange }, null, 2);
    const blob = new Blob([eventData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName || 'event'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl transition-colors duration-300"
      role="region"
      aria-label="Recurring Date Picker"
    >
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Recurring Event</h2>
      
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Event Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Enter event name"
          aria-required="true"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          rows="3"
          placeholder="Enter event description"
        />
      </div>

      <DateRangePicker />
      <RecurrenceOptions />
      
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Preview</h3>
        <Calendar highlightedDates={getRecurringDates} />
      </div>
      
      <div className="mt-4 max-h-40 overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">Selected Dates</h3>
        <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-900 dark:text-white">
          {getRecurringDates.map((date, index) => (
            <li key={index}>{format(date, 'PPP')}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleSaveEvent}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base disabled:opacity-50"
          disabled={!eventName}
          aria-label="Save event"
        >
          Save Event
        </button>
        <button
          onClick={handleShare}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base disabled:opacity-50"
          disabled={!eventName}
          aria-label="Share event"
        >
          Share Event
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm sm:text-base disabled:opacity-50"
          disabled={!eventName}
          aria-label="Export event"
        >
          Export as JSON
        </button>
      </div>
    </div>
  );
}