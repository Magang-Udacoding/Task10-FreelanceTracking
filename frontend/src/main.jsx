import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DashboardProvider } from './context/DashboardContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>,
)

// Register Service Worker for offline capabilities (Requirement 61)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('PWA Service Worker registered:', reg.scope))
      .catch(err => console.warn('PWA Service Worker registration failed:', err));
  });
}

