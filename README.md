# ⛓️ ProofChain — Reputación Profesional On-Chain

> *"Tu experiencia, verificada y tuya para siempre."*
> Built at Monad Hackathon 2026 🔴

## ¿Qué es?

ProofChain conecta **universidades, empresas y estudiantes/devs** para construir un historial profesional imposible de falsificar — guardado on-chain en **Monad**.

El diferenciador clave: un **agente de IA activo** que guía a los estudiantes como un lazarista — buscando oportunidades, haciendo match inteligente con empresas, y minteando automáticamente un NFT soulbound cuando la experiencia es validada.

## El problema

- 🎓 Estudiantes necesitan experiencia para titularse pero no tienen historial
- 💻 Devs quieren mejores puestos pero no pueden probar lo que han hecho
- 🏢 Empresas no tienen forma de verificar experiencia real

## La solución

```
Estudiante configura su agente (skills, intereses, instrucciones)
          ↓
Empresa publica lo que busca (skills, cultura, oferta)
          ↓
ProofAgent hace el match automático (scoring 0-100%)
          ↓
Se completa la práctica/proyecto
          ↓
Triple firma on-chain (estudiante + empresa + universidad)
          ↓
NFT Soulbound minteado + tokens $PROOF acreditados en Monad
```

## Stack

- **Blockchain**: Monad Testnet (EVM compatible, Chain ID 10143)
- **Contratos**: Solidity + Hardhat + OpenZeppelin
- **Frontend**: Next.js 14 + Tailwind CSS
- **Agente IA**: Anthropic Claude API
- **Wallet**: wagmi + viem

## Contratos

| Contrato | Descripción |
|---|---|
| `ProofToken.sol` | ERC20 $PROOF — solo minteable por el Registry |
| `ProofNFT.sol` | ERC721 Soulbound — no transferible, metadata on-chain |
| `ProofRegistry.sol` | Core — gestiona el flujo de validación 3-de-3 |

## Deploy a Monad Testnet

```bash
cp .env.example .env
# Agregar PRIVATE_KEY y ANTHROPIC_API_KEY

npm install
npx hardhat run scripts/deploy.js --network monad
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Modelo de negocio

| Actor | Free | Premium |
|---|---|---|
| Estudiantes | Perfil básico, agente limitado | $9/mes — destacado en búsquedas |
| Empresas | Ver candidatos, 1 oportunidad | $299/mes — búsqueda proactiva |
| Universidades | 50 alumnos, validaciones | $499/mes — campus completo |

**TAM México**: 4.2M estudiantes + 500K devs = ~$180M

## Por qué Monad

- **10,000+ TPS** — escala a millones de certificados
- **~$0 por mint** — accesible para estudiantes
- **EVM compatible** — fácil de desplegar
- **<1s finalidad** — experiencia en tiempo real

---

*Monad Hackathon 2026 · Team ProofChain*
