import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage state in localStorage with auto-sync capabilities.
 * @param {string} key LocalStorage key name.
 * @param {any} initialValue Default value if none is found in storage.
 * @returns {[any, Function]} A stateful value and a function to update it.
 */
export default function useLocalStorage(key, initialValue) {
  // Get initial value from local storage or use default
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === 'null' || item === 'undefined') {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Return a memoized setter function
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        // Dispatch a custom event to sync with other hooks in the same window
        window.dispatchEvent(new Event('local-storage-sync'));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Sync state when storage changes (e.g. from another tab or in-app changes)
  useEffect(() => {
    const handleSync = () => {
      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('local-storage-sync', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('local-storage-sync', handleSync);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
