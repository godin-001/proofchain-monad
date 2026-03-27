'use client';
import { useRouter } from 'next/navigation';

const ROLES = [
  {
    key: 'student',
    icon: '🎓',
    title: 'Soy Estudiante',
    desc: 'Busco prácticas, construyo mi historial y gano tokens $PROOF',
    color: '#22d3ee',
    bg: 'rgba(34,211,238,.08)',
    border: 'rgba(34,211,238,.25)',
    path: '/app/student',
  },
  {
    key: 'company',
    icon: '🏢',
    title: 'Soy Empresa',
    desc: 'Encuentro talento verificado on-chain y valido experiencias',
    color: '#f472b6',
    bg: 'rgba(244,114,182,.08)',
    border: 'rgba(244,114,182,.25)',
    path: '/app/company',
  },
  {
    key: 'university',
    icon: '🏛️',
    title: 'Soy Universidad',
    desc: 'Gestiono el servicio social de mis alumnos de forma automatizada',
    color: '#a855f7',
    bg: 'rgba(168,85,247,.08)',
    border: 'rgba(168,85,247,.25)',
    path: '/app/student',
  },
];

export default function AppPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#06060f', color: '#f0f0ff', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>⛓️</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
        ¿Cómo vas a usar <span style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ProofChain</span>?
      </h1>
      <p style={{ color: '#71717a', marginBottom: 40, textAlign: 'center' }}>Selecciona tu rol para continuar</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 800, width: '100%' }}>
        {ROLES.map(r => (
          <button key={r.key} onClick={() => router.push(r.path)}
            style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 20, padding: 28, cursor: 'pointer', textAlign: 'left', transition: 'all .25s', color: 'inherit' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${r.bg}`; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{r.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: r.color }}>{r.title}</div>
            <div style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6 }}>{r.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#1a0533,#2d1060)', border: '1px solid rgba(139,92,246,.4)', borderRadius: 10, padding: '8px 16px' }}>
        <span style={{ fontSize: 18 }}>🔴</span>
        <span style={{ fontSize: 13, color: '#c084fc', fontWeight: 600 }}>Powered by Monad · Mainnet coming soon</span>
      </div>
    </div>
  );
}
