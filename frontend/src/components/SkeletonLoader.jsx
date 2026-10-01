import React from 'react';

export default function SkeletonLoader({ type = 'stats' }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse relative overflow-hidden">
            <div className="animate-shimmer absolute inset-0 z-0 pointer-events-none"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-2.5 w-2/3">
                <div className="h-2 w-16 bg-neutral-200 dark:bg-brand-active rounded"></div>
                <div className="h-6 w-24 bg-neutral-200 dark:bg-brand-active rounded"></div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-brand-active"></div>
            </div>
            <div className="mt-4 relative z-10 space-y-2">
              <div className="h-2.5 w-3/4 bg-neutral-200 dark:bg-brand-active rounded"></div>
              {i === 3 && (
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'charts') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse relative overflow-hidden h-[300px]">
            <div className="animate-shimmer absolute inset-0 z-0 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="h-3.5 w-28 bg-neutral-200 dark:bg-brand-active rounded"></div>
              <div className="h-5 w-14 bg-neutral-200 dark:bg-brand-active rounded-full"></div>
            </div>
            <div className="h-44 w-full bg-neutral-100 dark:bg-brand-active/20 rounded-xl relative z-10 flex items-center justify-center">
              <div className="w-2/3 h-2/3 border-b-2 border-l-2 border-neutral-200 dark:border-brand-active opacity-30"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass-card animate-pulse relative overflow-hidden">
        <div className="animate-shimmer absolute inset-0 z-0 pointer-events-none"></div>
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="h-4 w-24 bg-neutral-200 dark:bg-brand-active rounded"></div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-12 bg-neutral-200 dark:bg-brand-active rounded-lg"></div>
            <div className="h-7 w-12 bg-neutral-200 dark:bg-brand-active rounded-lg"></div>
            <div className="h-7 w-12 bg-neutral-200 dark:bg-brand-active rounded-lg"></div>
          </div>
        </div>

        <div className="space-y-3.5 relative z-10">
          <div className="h-8 w-full bg-neutral-100 dark:bg-brand-active/20 rounded-lg"></div>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800/40">
              <div className="h-3 w-3 bg-neutral-200 dark:bg-brand-active rounded"></div>
              <div className="h-3 w-32 bg-neutral-200 dark:bg-brand-active rounded"></div>
              <div className="h-3 w-16 bg-neutral-200 dark:bg-brand-active rounded"></div>
              <div className="h-3 w-20 bg-neutral-200 dark:bg-brand-active rounded"></div>
              <div className="h-5 w-14 bg-neutral-200 dark:bg-brand-active rounded-full"></div>
              <div className="h-3 w-10 bg-neutral-200 dark:bg-brand-active rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
