import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to manage realtime revenue updates via 30s interval & SSE/WebSocket (Requirement #22-23)
 *
 * @param {string} backendUrl Active backend URL (optional)
 * @param {Function} onRevenueUpdate Callback when revenue updates
 * @param {number} intervalMs Refresh interval in milliseconds (default 30000ms = 30s)
 * @returns {Object} { isLive, lastUpdated, refreshRevenue }
 */
export default function useRealtimeRevenue(backendUrl = '', onRevenueUpdate = null, intervalMs = 30000) {
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const updateCallbackRef = useRef(onRevenueUpdate);

  useEffect(() => {
    updateCallbackRef.current = onRevenueUpdate;
  }, [onRevenueUpdate]);

  const refreshRevenue = useCallback(() => {
    setLastUpdated(new Date());
    if (updateCallbackRef.current) {
      updateCallbackRef.current();
    }
  }, []);

  // 1. 30 Seconds Periodic Refresh (Requirement #22, #50)
  useEffect(() => {
    const timer = setInterval(() => {
      refreshRevenue();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, refreshRevenue]);

  // 2. EventSource (SSE) Streaming Connection (Requirement #23)
  useEffect(() => {
    if (!backendUrl) {
      setIsLive(true);
      return;
    }

    let eventSource = null;
    try {
      const sseUrl = `${backendUrl}/api/stream_revenue.php`;
      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        setIsLive(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.revenue !== undefined) {
            setLastUpdated(new Date());
            if (updateCallbackRef.current) {
              updateCallbackRef.current(data);
            }
          }
        } catch (err) {
          console.warn('Failed to parse SSE message:', err);
        }
      };

      eventSource.onerror = () => {
        setIsLive(false);
        if (eventSource) eventSource.close();
      };
    } catch (e) {
      setIsLive(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [backendUrl]);

  return {
    isLive,
    lastUpdated,
    refreshRevenue,
  };
}
