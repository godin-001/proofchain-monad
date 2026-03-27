'use client';
import { useState } from 'react';

const MOCK_CANDIDATES = [
  { name: 'Ana García', career: 'Ing. Software · UNAM', skills: ['React', 'Node.js', 'Python'], score: 340, match: 92, nfts: 1, status: 'pending' },
  { name: 'Carlos Mendoza', career: 'Ing. Computación · IPN', skills: ['React', 'TypeScript', 'SQL'], score: 420, match: 88, nfts: 2, status: 'pending' },
  { name: 'María López', career: 'Ing. Software · Tec de Monterrey', skills: ['Node.js', 'React', 'Docker'], score: 510, match: 85, nfts: 3, status: 'reviewing' },
  { name: 'Diego Ruiz', career: 'Ciencias de Datos · UNAM', skills: ['Python', 'SQL', 'React'], score: 280, match: 71, nfts: 0, status: 'pending' },
];

const MOCK_OPPORTUNITY = {
  title: 'Practicante Frontend Developer',
  skills: ['React', 'Node.js', 'TypeScript'],
  offer: '$8,000 MXN/mes',
  mode: 'Híbrido',
  hours: '20h/sem',
  scoreMin: 250,
};

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'opportunity' | 'validations'>('candidates');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof MOCK_CANDIDATES[0] | null>(null);

  const tabStyle = (tab: string) => ({
    padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: activeTab === tab ? 'rgba(244,114,182,.2)' : 'transparent',
    border: `1px solid ${activeTab === tab ? 'rgba(244,114,182,.4)' : 'transparent'}`,
    color: activeTab === tab ? '#f9a8d4' : '#71717a',
    transition: 'all .2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#06060f', color: '#f0f0ff', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,15,.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⛓️</div>
          <span style={{ fontWeight: 800 }}>Proof<span style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chain</span></span>
          <span style={{ color: '#52525b', fontSize: 13 }}>/ Dashboard Empresa</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: 'rgba(244,114,182,.12)', border: '1px solid rgba(244,114,182,.3)', borderRadius: 10, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#f9a8d4' }}>🏢 Kueski · Premium</div>
          <a href="/app" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#71717a', textDecoration: 'none' }}>← Salir</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Candidatos matcheados', value: MOCK_CANDIDATES.length, color: '#f472b6' },
            { label: 'Match promedio', value: '84%', color: '#a855f7' },
            { label: 'Prácticas activas', value: '1', color: '#22d3ee' },
            { label: 'NFTs validados', value: '3', color: '#4ade80' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button style={tabStyle('candidates')} onClick={() => setActiveTab('candidates')}>👥 Candidatos</button>
          <button style={tabStyle('opportunity')} onClick={() => setActiveTab('opportunity')}>📋 Mi Oportunidad</button>
          <button style={tabStyle('validations')} onClick={() => setActiveTab('validations')}>✅ Validaciones</button>
        </div>

        {activeTab === 'candidates' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedCandidate ? '1fr 400px' : '1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_CANDIDATES.map((c, i) => (
                <div key={i} onClick={() => setSelectedCandidate(c)}
                  style={{ background: selectedCandidate?.name === c.name ? 'rgba(244,114,182,.08)' : 'rgba(255,255,255,.04)', border: `1px solid ${selectedCandidate?.name === c.name ? 'rgba(244,114,182,.35)' : 'rgba(255,255,255,.08)'}`, borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'all .2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700 }}>{c.name}</span>
                        {c.nfts > 0 && <span style={{ background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#86efac' }}>✓ {c.nfts} NFT</span>}
                      </div>
                      <div style={{ fontSize: 12, color: '#a1a1aa' }}>{c.career}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 14px', background: 'rgba(139,92,246,.15)', border: '1px solid rgba(139,92,246,.3)', borderRadius: 10 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#a855f7' }}>{c.match}%</div>
                      <div style={{ fontSize: 10, color: '#71717a' }}>match</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#c084fc' }}>{c.score}</div>
                      <div style={{ fontSize: 10, color: '#71717a' }}>Proof Score</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {c.skills.map(s => (
                      <span key={s} style={{ background: MOCK_OPPORTUNITY.skills.includes(s) ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.05)', border: `1px solid ${MOCK_OPPORTUNITY.skills.includes(s) ? 'rgba(74,222,128,.3)' : 'rgba(255,255,255,.1)'}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, color: MOCK_OPPORTUNITY.skills.includes(s) ? '#86efac' : '#71717a' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedCandidate && (
              <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(244,114,182,.25)', borderRadius: 16, padding: 24, height: 'fit-content', position: 'sticky', top: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Detalle del candidato</div>
                  <button onClick={() => setSelectedCandidate(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 18 }}>×</button>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 10px' }}>
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedCandidate.name}</div>
                  <div style={{ fontSize: 13, color: '#a1a1aa' }}>{selectedCandidate.career}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#a855f7' }}>{selectedCandidate.score}</div>
                    <div style={{ fontSize: 11, color: '#71717a' }}>Proof Score</div>
                  </div>
                  <div style={{ background: 'rgba(244,114,182,.1)', border: '1px solid rgba(244,114,182,.2)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f472b6' }}>{selectedCandidate.match}%</div>
                    <div style={{ fontSize: 11, color: '#71717a' }}>Match</div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 8 }}>SKILLS VERIFICADOS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedCandidate.skills.map(s => (
                      <span key={s} style={{ background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.25)', borderRadius: 999, padding: '4px 12px', fontSize: 12, color: '#86efac' }}>{s} ✓</span>
                    ))}
                  </div>
                </div>
                {selectedCandidate.nfts > 0 && (
                  <div style={{ background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 12, color: '#86efac' }}>
                    🏆 {selectedCandidate.nfts} NFT{selectedCandidate.nfts > 1 ? 's' : ''} de experiencia verificados on-chain en Monad
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button style={{ background: 'linear-gradient(135deg,#f472b6,#a855f7)', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                    ✉️ Contactar candidato
                  </button>
                  <button style={{ background: 'rgba(74,222,128,.15)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 10, padding: 12, fontWeight: 600, color: '#86efac', cursor: 'pointer', fontSize: 13 }}>
                    ✅ Iniciar proceso (validación on-chain)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'opportunity' && (
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 28, maxWidth: 600 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📋 Mi Oportunidad Activa</div>
            {[
              { label: 'Título', value: MOCK_OPPORTUNITY.title },
              { label: 'Skills requeridos', value: MOCK_OPPORTUNITY.skills.join(', ') },
              { label: 'Compensación', value: MOCK_OPPORTUNITY.offer },
              { label: 'Modalidad', value: MOCK_OPPORTUNITY.mode },
              { label: 'Horas por semana', value: MOCK_OPPORTUNITY.hours },
              { label: 'Proof Score mínimo', value: MOCK_OPPORTUNITY.scoreMin.toString() },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <span style={{ fontSize: 13, color: '#a1a1aa' }}>{f.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>{f.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', borderRadius: 10, padding: 12, fontSize: 12, color: '#c084fc' }}>
              🤖 El agente ya identificó {MOCK_CANDIDATES.length} candidatos compatibles automáticamente
            </div>
          </div>
        )}

        {activeTab === 'validations' && (
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 28, maxWidth: 700 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>✅ Pendientes de validación on-chain</div>
            <div style={{ background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.25)', borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>María López · Dev Frontend</div>
                  <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>480h completadas · Kueski</div>
                </div>
                <div style={{ background: 'rgba(251,191,36,.2)', border: '1px solid rgba(251,191,36,.4)', borderRadius: 8, padding: '4px 12px', fontSize: 12, color: '#fbbf24' }}>
                  ⏳ Tu firma pendiente
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                  <div style={{ color: '#71717a', marginBottom: 4 }}>Firmas requeridas (multisig)</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#4ade80' }}>✓ Estudiante</span>
                    <span style={{ color: '#71717a' }}>·</span>
                    <span style={{ color: '#4ade80' }}>✓ Universidad</span>
                    <span style={{ color: '#71717a' }}>·</span>
                    <span style={{ color: '#fbbf24' }}>○ Empresa</span>
                  </div>
                </div>
              </div>
              <button style={{ marginTop: 12, width: '100%', background: 'linear-gradient(135deg,#4ade80,#22d3ee)', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, color: '#06060f', cursor: 'pointer', fontSize: 13 }}>
                ⛓️ Firmar y mintear NFT en Monad
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
