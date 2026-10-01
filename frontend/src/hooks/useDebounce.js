import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * @param {any} value The value to debounce.
 * @param {number} delay Delay in milliseconds (default 300ms).
 * @returns {any} The debounced value.
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value or delay changes before it fires
    // This ensures only the final value after rapid changes gets dispatched
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
