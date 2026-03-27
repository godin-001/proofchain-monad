import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COMPANIES = [
  { name: 'Kueski', sector: 'Fintech', skills: ['React', 'Node.js', 'SQL'], offer: '$8,000 MXN/mes', mode: 'Híbrido', score_min: 250 },
  { name: 'Clip', sector: 'Fintech/Payments', skills: ['React', 'TypeScript', 'APIs'], offer: '$9,000 MXN/mes', mode: 'Remoto', score_min: 300 },
  { name: 'Bitso', sector: 'Web3/Crypto', skills: ['React', 'Web3.js', 'Solidity'], offer: '$10,000 MXN/mes', mode: 'Híbrido', score_min: 350 },
  { name: 'Conekta', sector: 'Payments', skills: ['Node.js', 'APIs', 'SQL'], offer: '$7,500 MXN/mes', mode: 'Presencial', score_min: 200 },
  { name: 'Monad Labs', sector: 'Web3/Blockchain', skills: ['Solidity', 'TypeScript', 'React'], offer: '$12,000 MXN/mes', mode: 'Remoto', score_min: 400 },
];

export async function POST(req: NextRequest) {
  try {
    const { message, studentProfile, history = [] } = await req.json();

    const systemPrompt = `Eres ProofAgent, un agente de IA que ayuda a estudiantes universitarios y devs a encontrar prácticas profesionales y oportunidades laborales verificadas en blockchain (Monad).

Perfil del estudiante:
- Nombre: ${studentProfile?.name || 'Ana García'}
- Carrera: ${studentProfile?.career || 'Ingeniería en Software'}
- Universidad: ${studentProfile?.university || 'UNAM'}
- Skills: ${studentProfile?.skills?.join(', ') || 'React, Node.js, Python'}
- Intereses: ${studentProfile?.interests?.join(', ') || 'Web3, Startups'}
- Proof Score: ${studentProfile?.proofScore || 340}
- Tokens $PROOF: ${studentProfile?.proofTokens || 1250}
- Instrucción especial: ${studentProfile?.agentInstruction || 'Solo empresas de tech, prefiero aprender aunque paguen menos'}

Empresas disponibles en el ecosistema:
${COMPANIES.map(c => `- ${c.name} (${c.sector}): busca [${c.skills.join(', ')}], ofrece ${c.offer}, modalidad: ${c.mode}, Proof Score mínimo: ${c.score_min}`).join('\n')}

Tu comportamiento:
- Sé proactivo, cálido, directo. Usa emojis con moderación.
- Cuando el estudiante pida empresas, calcula el match % basado en sus skills vs lo requerido
- Cuando hagas match, muestra el % de compatibilidad y por qué
- Puedes "aplicar" automáticamente (simula que ya enviaste el perfil)
- Cuando algo se completa, menciona que se mintea un NFT en Monad
- Responde siempre en español
- Máximo 3-4 oraciones por respuesta, sé conciso`;

    const messages = [
      ...history.slice(-6),
      { role: 'user' as const, content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Detect if agent is applying to a company
    const appliedTo = COMPANIES.find(c =>
      text.toLowerCase().includes(c.name.toLowerCase()) &&
      (text.includes('apliqué') || text.includes('aplique') || text.includes('envié') || text.includes('mandé'))
    );

    return NextResponse.json({
      message: text,
      appliedTo: appliedTo || null,
      proofScoreDelta: appliedTo ? 10 : 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: '¡Ups! Algo salió mal con el agente. Intenta de nuevo.', appliedTo: null },
      { status: 500 }
    );
  }
}
