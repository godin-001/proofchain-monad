'use client';

interface MatchBreakdown {
  skills: number;
  preferences: number;
  proofScore: number;
}

interface Match {
  company: {
    name: string;
    industry: string;
    location: string;
    remote: boolean;
  };
  score: number;
  breakdown: MatchBreakdown;
  explanation: string;
}

interface MatchCardProps {
  match: Match;
  onViewDetails?: () => void;
  onApply?: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function scoreBorderColor(score: number): string {
  if (score >= 80) return 'border-green-400';
  if (score >= 60) return 'border-yellow-400';
  return 'border-red-400';
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="text-white/70">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchCard({ match, onViewDetails, onApply }: MatchCardProps) {
  const { company, score, breakdown, explanation } = match;

  return (
    <div className="glass-card rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 space-y-4">
      {/* Top row */}
      <div className="flex items-start gap-4">
        {/* Company info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">{company.name}</h3>
          <p className="text-sm text-white/50 mt-0.5">{company.industry}</p>
          <p className="text-xs text-white/30 mt-1">
            {company.location}
            {company.remote && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-500/10 text-[#22d3ee] text-[10px] font-medium">
                Remote
              </span>
            )}
          </p>
        </div>

        {/* Score circle */}
        <div
          className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-full border-[3px] ${scoreBorderColor(score)}`}
        >
          <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}</span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2.5">
        <BreakdownBar label="Skills" value={breakdown.skills} />
        <BreakdownBar label="Preferences" value={breakdown.preferences} />
        <BreakdownBar label="Proof Score" value={breakdown.proofScore} />
      </div>

      {/* Explanation */}
      <p className="text-xs text-white/40 leading-relaxed">{explanation}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          View Details
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-90 transition-opacity cursor-pointer"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
