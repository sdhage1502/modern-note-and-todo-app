"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../utils/firebase';
import { useTheme } from 'next-themes';

/**
 * App context for global state management
 * @typedef {Object} RecurrencePattern
 * @property {string} type - Recurrence type (daily, weekly, monthly, yearly)
 * @property {number} interval - Recurrence interval
 * @property {number[]} [daysOfWeek] - Selected days of week
 * @property {number} [dayOfMonth] - Day of month
 * @property {number} [monthOfYear] - Month for yearly recurrence
 * @typedef {Object} DateRange
 * @property {Date} startDate - Start date
 * @property {Date} [endDate] - Optional end date
 * @typedef {Object} Event
 * @property {string} id - Event ID
 * @property {string} name - Event name
 * @property {string} description - Event description
 * @property {RecurrencePattern} recurrence - Recurrence pattern
 * @property {DateRange} dateRange - Date range
 */
const AppContext = createContext();

export function AppProvider({ children }) {
  const { setTheme } = useTheme();
  const [recurrence, setRecurrenceState] = useState({ type: 'daily', interval: 1 });
  const [dateRange, setDateRangeState] = useState({ startDate: new Date() });
  const [user, setUser] = useState(null);
  const [displayName, setDisplayNameState] = useState('');
  const [avatarUrl, setAvatarUrlState] = useState('');
  const [events, setEvents] = useState([]);
  const [theme, setThemeState] = useState('light'); // Initialize theme state

  const setRecurrence = (newRecurrence) => {
    setRecurrenceState((prev) => ({ ...prev, ...newRecurrence }));
  };

  const setDateRange = (newDateRange) => {
    setDateRangeState((prev) => ({ ...prev, ...newDateRange }));
  };

  const setThemeAndPersist = async (newTheme, userId) => {
    setThemeState(newTheme); // Update local theme state
    if (userId) {
      await setDoc(doc(db, 'users', userId), { theme: newTheme }, { merge: true });
    }
    setTheme(newTheme); // Update next-themes
  };

  const setDisplayName = async (newDisplayName, userId) => {
    if (userId) {
      await setDoc(doc(db, 'users', userId), { displayName: newDisplayName }, { merge: true });
    }
    setDisplayNameState(newDisplayName);
  };

  const setAvatar = async (file, userId) => {
    if (!userId || !file) return;
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    const avatarUrl = await getDownloadURL(storageRef);
    await setDoc(doc(db, 'users', userId), { avatarUrl }, { merge: true });
    setAvatarUrlState(avatarUrl);
  };

  const saveEvent = async (event, userId) => {
    if (!userId) return;
    const eventRef = await addDoc(collection(db, 'events'), { ...event, userId });
    setEvents((prev) => [...prev, { ...event, id: eventRef.id }]);
  };

  const importEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { theme: 'light', displayName: user.email.split('@')[0], avatarUrl: '' };
        setUser(user);
        setThemeState(userData.theme || 'light');
        setTheme(userData.theme || 'light'); // Sync with next-themes
        setDisplayNameState(userData.displayName);
        setAvatarUrlState(userData.avatarUrl || '');
      } else {
        setUser(null);
        setThemeState('light');
        setTheme('light');
        setDisplayNameState('');
        setAvatarUrlState('');
        setEvents([]);
      }
    });
    return () => unsubscribe();
  }, [setTheme]);

  return (
    <AppContext.Provider
      value={{
        recurrence,
        setRecurrence,
        dateRange,
        setDateRange,
        user,
        theme,
        setTheme: setThemeAndPersist,
        displayName,
        setDisplayName,
        avatarUrl,
        setAvatar,
        events,
        saveEvent,
        importEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}