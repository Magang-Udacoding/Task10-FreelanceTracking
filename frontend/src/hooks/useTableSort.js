import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook to handle multi-field table sorting with memory and direction indicators (Requirement #19-21)
 *
 * @param {Array} items Array of objects to sort
 * @param {Object} defaultSortConfig Default sort config { key: string, direction: 'asc' | 'desc' }
 * @returns {Object} { sortedItems, sortConfig, requestSort, getSortDirection, setSortConfig }
 */
export default function useTableSort(items = [], defaultSortConfig = { key: 'start_date', direction: 'desc' }) {
  const [sortConfig, setSortConfig] = useState(defaultSortConfig);

  const requestSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = 'asc';
      if (prev.key === key && prev.direction === 'asc') {
        direction = 'desc';
      }
      return { key, direction };
    });
  }, []);

  const getSortDirection = useCallback(
    (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction;
    },
    [sortConfig]
  );

  const sortedItems = useMemo(() => {
    if (!items || !items.length) return [];
    if (!sortConfig.key) return items;

    const sorted = [...items];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle null or undefined
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Handle numeric fields (revenue, hours, id)
      if (typeof aVal === 'number' || !isNaN(Number(aVal))) {
        const numA = Number(aVal);
        const numB = Number(bVal);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }
      }

      // Handle string fields
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [items, sortConfig]);

  return {
    sortedItems,
    sortConfig,
    requestSort,
    getSortDirection,
    setSortConfig,
  };
}
