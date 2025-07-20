"use client";

import useAppStore from '../stores/useAppStore';
import RecurringDatePicker from '@/components /RecurringDatePicker';
import ProfileSection from '@/components /ProfileSection';

/**
 * Home page component for the Modern Calendar and Todo App
 * @returns {JSX.Element} Home page UI
 */
export default function Home() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
          Modern Calendar & Todo
        </h1>
        {user ? (
          <div className="space-y-6">
            <ProfileSection />
            <RecurringDatePicker />
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome! Please{' '}
              <a href="/login" className="text-blue-500 hover:underline font-semibold">
                log in
              </a>{' '}
              or{' '}
              <a href="/signup" className="text-blue-500 hover:underline font-semibold">
                sign up
              </a>{' '}
              to manage your events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}