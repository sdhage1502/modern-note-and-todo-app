"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAppContext } from '../context/AppContext';
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';

/**
 * Profile section with modal for user settings
 * @returns {JSX.Element} Profile UI
 */
export default function ProfileSection() {
  const { user, displayName, avatarUrl, setDisplayName, setAvatar } = useAppContext();
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      if (newDisplayName !== displayName) {
        await setDisplayName(newDisplayName, user.uid);
      }
      if (avatarFile) {
        await setAvatar(avatarFile, user.uid);
      }
      
      setIsModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const themes = [
    { name: 'Light', value: 'light', bg: 'bg-gray-100', text: 'text-gray-900' },
    { name: 'Dark', value: 'dark', bg: 'bg-gray-800', text: 'text-white' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500', text: 'text-white' },
  ];

  return (
    <div
      className={`w-full max-w-md sm:max-w-lg md:max-w-xl p-4 rounded-lg shadow-md mb-4 ${themes.find(t => t.value === theme)?.bg || 'bg-gray-100'} ${themes.find(t => t.value === theme)?.text || 'text-gray-900'} transition-colors duration-300`}
      role="region"
      aria-label="Profile Section"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Profile</h2>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <img
          src={avatarUrl || '/default-avatar.png'}
          alt="User avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="text-sm sm:text-base font-medium">{displayName}</p>
          <p className="text-xs sm:text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm sm:text-base font-medium">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          aria-label="Select theme"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="text-blue-500 hover:underline text-sm sm:text-base"
          aria-expanded={showAbout}
          aria-controls="about-content"
        >
          {showAbout ? 'Hide About' : 'About'}
        </button>
        {showAbout && (
          <div id="about-content" className="mt-2 text-sm sm:text-base">
            <p>This app helps you manage recurring tasks with a powerful date picker, inspired by TickTick. Create, share, and import events seamlessly!</p>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          aria-label="Open profile settings"
        >
          Edit Profile
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm sm:max-w-md">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Display Name</label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Edit display name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Edit email"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">New Password (Optional)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-xs sm:text-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  aria-label="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="mt-1 block w-full text-xs sm:text-sm text-gray-900 dark:text-white"
                  aria-label="Upload new avatar"
                />
              </div>
              {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700 text-sm sm:text-base"
                  aria-label="Cancel profile edits"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                  aria-label="Save profile changes"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}