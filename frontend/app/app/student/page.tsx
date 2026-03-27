'use client';
import { useState, useRef, useEffect } from 'react';

const MOCK_PROFILE = {
  name: 'Ana García',
  career: 'Ingeniería en Software',
  university: 'UNAM',
  semester: '7mo Semestre',
  skills: ['React', 'Node.js', 'Python'],
  interests: ['Web3', 'Startups tech'],
  agentInstruction: 'Solo empresas de tech, prefiero aprender aunque paguen menos',
  proofScore: 340,
  proofTokens: 1250,
};

const MOCK_EXPERIENCES = [
  { id: 1, company: 'Kueski', title: 'Practicante Frontend', hours: 480, status: 'completed', tokens: 500 },
  { id: 2, company: 'Bitso', title: 'Dev Web3 Jr', hours: 120, status: 'in_progress', tokens: 0 },
];

type Message = { role: 'user' | 'agent'; text: string; appliedTo?: { name: string } | null };

const statusColor: Record<string, string> = {
  completed: 'rgba(74,222,128,.15)',
  in_progress: 'rgba(251,191,36,.12)',
  pending: 'rgba(99,102,241,.12)',
};
const statusLabel: Record<string, string> = {
  completed: '✅ Completada',
  in_progress: '⏳ En curso',
  pending: '🕐 Pendiente',
};

export default function StudentPage() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [newSkill, setNewSkill] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: `👋 Hola ${MOCK_PROFILE.name}! Tu Proof Score es **${MOCK_PROFILE.proofScore}** — estás en el top 35% de tu generación. ¿Empezamos a buscar tu próxima oportunidad?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{role:string;content:string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: text }];
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, studentProfile: profile, history }),
      });
      const data = await res.json();
      const agentMsg: Message = { role: 'agent', text: data.message, appliedTo: data.appliedTo };
      setMessages(prev => [...prev, agentMsg]);
      setHistory([...newHistory, { role: 'assistant', content: data.message }]);
      if (data.proofScoreDelta) setProfile(p => ({ ...p, proofScore: p.proofScore + data.proofScoreDelta }));
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: '⚠️ Error de conexión. Intenta de nuevo.' }]);
    }
    setLoading(false);
  };

  const quickActions = [
    '¿Qué empresas me recomendas?',
    'Aplica automáticamente a las mejores',
    '¿Qué skills me faltan?',
    'Ver mi Proof Score',
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#06060f', color: '#f0f0ff', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,15,.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⛓️</div>
          <span style={{ fontWeight: 800 }}>Proof<span style={{ background: 'linear-gradient(135deg,#a855f7,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chain</span></span>
          <span style={{ color: '#52525b', fontSize: 13 }}>/ Dashboard Estudiante</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(251,191,36,.15)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 10, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>
            🪙 {profile.proofTokens.toLocaleString()} $PROOF
          </div>
          <div style={{ background: 'rgba(139,92,246,.2)', border: '1px solid rgba(139,92,246,.35)', borderRadius: 10, padding: '6px 14px', fontSize: 13, fontWeight: 700, color: '#c084fc' }}>
            Score: {profile.proofScore}
          </div>
          <a href="/app" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#71717a', textDecoration: 'none' }}>← Salir</a>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 380px', gap: 20, padding: 20, maxWidth: 1400, margin: '0 auto' }}>

        {/* LEFT: Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Profile card */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#22d3ee,#38bdf8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎓</div>
              <div>
                <div style={{ fontWeight: 700 }}>{profile.name}</div>
                <div style={{ fontSize: 12, color: '#71717a' }}>{profile.career}</div>
                <div style={{ fontSize: 12, color: '#67e8f9' }}>{profile.university} · {profile.semester}</div>
              </div>
            </div>
            {/* Proof Score bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#a1a1aa' }}>Proof Score</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#a855f7' }}>{profile.proofScore} / 1000</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,.07)', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${(profile.proofScore / 1000) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius: 4, transition: 'width .5s' }} />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 10, letterSpacing: '.05em' }}>MIS SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {profile.skills.map(s => (
                <span key={s} style={{ background: 'rgba(34,211,238,.15)', border: '1px solid rgba(34,211,238,.3)', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#67e8f9', cursor: 'pointer' }}
                  onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))}>
                  {s} ×
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); }}}
                placeholder="+ Agregar skill" style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#fff', outline: 'none' }} />
              <button onClick={() => { if (newSkill.trim()) { setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] })); setNewSkill(''); }}}
                style={{ background: 'rgba(34,211,238,.2)', border: '1px solid rgba(34,211,238,.3)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#67e8f9', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* Intereses */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 10, letterSpacing: '.05em' }}>ME INTERESA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Web3', 'Startups tech', 'Fintech', 'IA/ML', 'Open Source'].map(i => (
                <span key={i} onClick={() => setProfile(p => ({ ...p, interests: p.interests.includes(i) ? p.interests.filter(x => x !== i) : [...p.interests, i] }))}
                  style={{ background: profile.interests.includes(i) ? 'rgba(139,92,246,.25)' : 'rgba(255,255,255,.05)', border: `1px solid ${profile.interests.includes(i) ? 'rgba(139,92,246,.5)' : 'rgba(255,255,255,.1)'}`, borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: profile.interests.includes(i) ? '#c084fc' : '#71717a', cursor: 'pointer', transition: 'all .2s' }}>
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* Instrucción al agente */}
          <div style={{ background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a855f7', marginBottom: 8, letterSpacing: '.05em' }}>INSTRUCCIÓN AL AGENTE</div>
            <textarea value={profile.agentInstruction}
              onChange={e => setProfile(p => ({ ...p, agentInstruction: e.target.value }))}
              style={{ width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#d4d4d8', resize: 'none', outline: 'none', lineHeight: 1.6 }} rows={3} />
          </div>
        </div>

        {/* CENTER: Agent Chat */}
        <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: 'calc(100vh - 100px)' }}>
          {/* Chat header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>ProofAgent</div>
              <div style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> Online · IA activa
              </div>
            </div>
            <div style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#1a0533,#2d1060)', border: '1px solid rgba(139,92,246,.4)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: '#c084fc', display: 'flex', alignItems: 'center', gap: 6 }}>
              🔴 Monad
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  background: msg.role === 'user' ? 'rgba(99,102,241,.2)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(99,102,241,.35)' : 'rgba(255,255,255,.1)'}`,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px', maxWidth: '80%', fontSize: 14, lineHeight: 1.6, color: '#e4e4e7',
                }}>
                  {msg.text.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#fff' }}>{part}</strong> : part)}
                </div>
                {msg.appliedTo && (
                  <div style={{ marginTop: 6, background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.25)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#86efac', display: 'flex', alignItems: 'center', gap: 8 }}>
                    ✅ Perfil enviado a <strong>{msg.appliedTo.name}</strong> · Pendiente validación
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14 }}>
                  <span style={{ color: '#a855f7' }}>●●●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,.05)' }}>
            {quickActions.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 8, padding: '5px 12px', fontSize: 12, color: '#a5b4fc', cursor: 'pointer', transition: 'all .2s' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}}
              placeholder="Escribe algo al agente..."
              style={{ flex: 1, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none' }} />
            <button onClick={() => sendMessage(input)} disabled={loading}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontSize: 16 }}>→</button>
          </div>
        </div>

        {/* RIGHT: Experiences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📋 Mis Experiencias</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_EXPERIENCES.map(exp => (
                <div key={exp.id} style={{ background: statusColor[exp.status], border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{exp.company}</div>
                    <div style={{ fontSize: 11 }}>{statusLabel[exp.status]}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 6 }}>{exp.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#71717a' }}>{exp.hours}h completadas</span>
                    {exp.tokens > 0 && <span style={{ color: '#fbbf24', fontWeight: 700 }}>+{exp.tokens} $PROOF</span>}
                  </div>
                  {exp.status === 'completed' && (
                    <div style={{ marginTop: 8, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#86efac' }}>
                      🏆 NFT minteado · Monad #{exp.id}337
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NFT showcase */}
          <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.1))', border: '1px solid rgba(99,102,241,.3)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏆 Mi Proof NFT</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎖️</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Experience Certificate</div>
              <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 12 }}>Kueski · Frontend Dev · 480h</div>
              <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontFamily: 'monospace', color: '#71717a' }}>
                Soulbound · No transferible
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: '#52525b', fontFamily: 'monospace' }}>
                0x4f2a…1c3d · Monad Testnet
              </div>
            </div>
          </div>

          {/* Premium upgrade */}
          <div style={{ background: 'linear-gradient(135deg,rgba(34,211,238,.08),rgba(56,189,248,.05))', border: '1px solid rgba(34,211,238,.25)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#67e8f9', marginBottom: 6 }}>✨ Ir Premium</div>
            <div style={{ fontSize: 12, color: '#a1a1aa', marginBottom: 12, lineHeight: 1.6 }}>Sé el primero en la lista cuando las empresas buscan talento.</div>
            <button style={{ width: '100%', background: 'linear-gradient(135deg,#22d3ee,#38bdf8)', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 700, fontSize: 13, color: '#06060f', cursor: 'pointer' }}>
              $9/mes — Ver más visibilidad →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
