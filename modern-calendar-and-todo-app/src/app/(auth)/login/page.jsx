"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAppStore from '../../../stores/useAppStore';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Login page component
 * @returns {JSX.Element} Login form
 */
export default function Login() {
  const auth = useAppStore((state) => state.auth);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">
          Log In
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
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
              aria-required="true"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
              aria-required="true"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Log in"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline font-semibold">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}