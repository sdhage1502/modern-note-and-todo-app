import { create } from 'zustand';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../utils/firebase';

/**
 * Zustand store for global state management
 */
const useAppStore = create((set) => ({
  recurrence: { type: 'daily', interval: 1 },
  dateRange: { startDate: new Date() },
  user: null,
  displayName: '',
  avatarUrl: '',
  events: [],
  theme: 'light',

  setRecurrence: (newRecurrence) =>
    set((state) => ({ recurrence: { ...state.recurrence, ...newRecurrence } })),

  setDateRange: (newDateRange) =>
    set((state) => ({ dateRange: { ...state.dateRange, ...newDateRange } })),

  setTheme: async (newTheme, userId) => {
    set({ theme: newTheme });
    if (userId) {
      await setDoc(doc(db, 'users', userId), { theme: newTheme }, { merge: true });
    }
  },

  setDisplayName: async (newDisplayName, userId) => {
    set({ displayName: newDisplayName });
    if (userId) {
      await setDoc(doc(db, 'users', userId), { displayName: newDisplayName }, { merge: true });
    }
  },

  setAvatar: async (file, userId) => {
    if (!userId || !file) return;
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    const avatarUrl = await getDownloadURL(storageRef);
    set({ avatarUrl });
    await setDoc(doc(db, 'users', userId), { avatarUrl }, { merge: true });
  },

  saveEvent: async (event, userId) => {
    if (!userId) return;
    const eventRef = await addDoc(collection(db, 'events'), { ...event, userId });
    set((state) => ({ events: [...state.events, { ...event, id: eventRef.id }] }));
  },

  importEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),

  initializeAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {
          theme: 'light',
          displayName: user.email.split('@')[0],
          avatarUrl: ''
        };
        set({
          user,
          theme: userData.theme || 'light',
          displayName: userData.displayName,
          avatarUrl: userData.avatarUrl || ''
        });
      } else {
        set({
          user: null,
          theme: 'light',
          displayName: '',
          avatarUrl: '',
          events: []
        });
      }
    });
  }
}));

export default useAppStore;