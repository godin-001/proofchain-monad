'use client';

import { useEffect, useState } from 'react';

interface ProofScoreBarProps {
  score: number;
  maxScore?: number;
}

export default function ProofScoreBar({ score, maxScore = 1000 }: ProofScoreBarProps) {
  const [animated, setAnimated] = useState(false);
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/60">Proof Score</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold gradient-text bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent">
            {score}
          </span>
          <span className="text-xs text-white/30">/ {maxScore}</span>
          <span className="text-xs text-white/40 ml-1">({percentage.toFixed(1)}%)</span>
        </div>
      </div>

      <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] transition-all duration-1000 ease-out"
          style={{ width: animated ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
}
