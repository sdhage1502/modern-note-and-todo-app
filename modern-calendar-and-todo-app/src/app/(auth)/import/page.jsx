"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAppStore from '../../../stores/useAppStore';

/**
 * Import event page component
 * @returns {JSX.Element} Import event form
 */
export default function ImportEvent() {
  const importEvent = useAppStore((state) => state.importEvent);
  const router = useRouter();
  const [eventJson, setEventJson] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const event = JSON.parse(eventJson);
      if (
        event.name &&
        event.description &&
        event.recurrence &&
        event.dateRange &&
        event.dateRange.startDate
      ) {
        importEvent(event);
        router.push('/');
      } else {
        setError('Invalid event format');
      }
    } catch (err) {
      setError('Invalid JSON format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
          Import Event
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/50 rounded-md" role="alert">
            {error}
          </p>
        )}
        <div
          role="form"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="event-json"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Event JSON
            </label>
            <textarea
              id="event-json"
              value={eventJson}
              onChange={(e) => setEventJson(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              rows="5"
              required
              aria-required="true"
              placeholder='{"name":"Event Name","description":"Description","recurrence":{"type":"daily","interval":1},"dateRange":{"startDate":"2025-07-20T00:00:00Z"}}'
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Import event"
          >
            {loading ? 'Importing...' : 'Import Event'}
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Back to{' '}
          <a href="/" className="text-blue-500 hover:underline font-semibold">
            Home
          </a>
        </p>
      </div>
    </div>
  );
}