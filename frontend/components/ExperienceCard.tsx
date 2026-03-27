'use client';

import { CheckCircle, Circle } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  description: string;
  company: string;
  university: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Rejected';
  hours: number;
  studentSigned: boolean;
  companySigned: boolean;
  universitySigned: boolean;
}

interface ExperienceCardProps {
  experience: Experience;
  onSign?: () => void;
}

const statusConfig: Record<Experience['status'], { label: string; className: string }> = {
  Pending: { label: 'Pending', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  InProgress: { label: 'In Progress', className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  Completed: { label: 'Completed', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  Rejected: { label: 'Rejected', className: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

function SignatureIndicator({ label, signed }: { label: string; signed: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {signed ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <Circle className="w-4 h-4 text-white/20" />
      )}
      <span className={signed ? 'text-green-400' : 'text-white/40'}>{label}</span>
    </div>
  );
}

export default function ExperienceCard({ experience, onSign }: ExperienceCardProps) {
  const { title, company, university, status, hours, studentSigned, companySigned, universitySigned } = experience;
  const badge = statusConfig[status];

  const allSigned = studentSigned && companySigned && universitySigned;

  return (
    <div className="glass-card rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-white font-semibold text-base leading-snug">{title}</h3>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/60">
        <span>
          <span className="text-white/30">Company:</span> {company}
        </span>
        <span>
          <span className="text-white/30">University:</span> {university}
        </span>
        <span>
          <span className="text-white/30">Hours:</span> {hours}
        </span>
      </div>

      {/* Signatures */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SignatureIndicator label="Student" signed={studentSigned} />
          <SignatureIndicator label="Company" signed={companySigned} />
          <SignatureIndicator label="University" signed={universitySigned} />
        </div>

        {!allSigned && (
          <button
            onClick={onSign}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign
          </button>
        )}
      </div>
    </div>
  );
}
