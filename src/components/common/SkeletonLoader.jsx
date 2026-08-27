import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-[#161f30] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg animate-pulse flex flex-col">
      {/* 4/3 Aspect Ratio Image Skeleton to prevent CLS */}
      <div className="aspect-[4/3] w-full bg-slate-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/20 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="h-5 bg-slate-800 rounded-md w-3/4" />
          <div className="h-3.5 bg-slate-800/70 rounded-md w-full" />
          <div className="h-3.5 bg-slate-800/50 rounded-md w-4/5" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
          <div className="h-6 bg-amber-500/20 rounded-md w-16" />
          <div className="h-4 bg-slate-800 rounded-md w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
