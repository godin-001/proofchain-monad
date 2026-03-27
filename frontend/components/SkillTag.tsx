'use client';

import { X } from 'lucide-react';

interface SkillTagProps {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  onRemove?: () => void;
  onClick?: () => void;
}

const levelConfig: Record<NonNullable<SkillTagProps['level']>, { dot: string; border: string }> = {
  beginner: { dot: 'bg-gray-400', border: 'border-gray-500/30' },
  intermediate: { dot: 'bg-blue-400', border: 'border-blue-500/30' },
  advanced: { dot: 'bg-purple-400', border: 'border-purple-500/30' },
  expert: { dot: 'bg-[#22d3ee]', border: 'border-cyan-500/30' },
};

export default function SkillTag({ name, level, onRemove, onClick }: SkillTagProps) {
  const config = level ? levelConfig[level] : null;
  const borderClass = config?.border ?? 'border-white/[0.08]';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 bg-white/[0.04] border ${borderClass} backdrop-blur-sm hover:bg-white/[0.08] transition-colors duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {config && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {name}
      {level && (
        <span className="text-white/40 capitalize">{level}</span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
