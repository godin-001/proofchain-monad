# ProofChain MVP — Hackathon Build Task

## Idea
ProofChain is a platform on Monad blockchain that connects universities, companies, and students/devs.
An AI agent ("ProofAgent") actively guides students to find internships/practices, matches them with companies, and mints a soulbound NFT + $PROOF tokens on Monad when the experience is validated by all three parties.

## Stack
- **Contracts**: Solidity + Hardhat, deploy to Monad testnet (EVM compatible, chain ID 10143, RPC: https://testnet-rpc.monad.xyz)
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Agent**: Node.js service using Anthropic Claude API (claude-3-5-haiku-20241022) for matching + conversation
- **Wallet**: wagmi + viem for wallet connection

## What to build

### 1. Smart Contracts (contracts/)

#### ProofToken.sol
- ERC20 token named "Proof Token" symbol "$PROOF"
- Only minter role can mint (the registry contract)
- Standard OpenZeppelin ERC20

#### ProofNFT.sol
- ERC721 Soulbound NFT (non-transferable — override transfer to revert)
- Metadata: student address, company address, university address, experience title, hours, timestamp, ipfsHash
- mint() only callable by registry
- tokenURI returns on-chain JSON with the metadata

#### ProofRegistry.sol
- Core contract — manages the validation flow
- Structs: Experience { id, student, company, university, title, description, hours, status, studentSigned, companySigned, universitySigned }
- Status enum: Pending, InProgress, Completed, Rejected
- Functions:
  - registerExperience(company, university, title, description, hours) → creates experience, student = msg.sender
  - signAsCompany(experienceId) → company signs
  - signAsUniversity(experienceId) → university signs  
  - signAsStudent(experienceId) → student confirms completion
  - When all 3 signed → auto-mint NFT + 500 $PROOF to student
- Events: ExperienceCreated, ExperienceSigned, ExperienceCompleted

### 2. Frontend (frontend/)

Next.js app with these pages/components:

#### Pages
- `/` → Landing (link to the already designed landing page at proofchain/index.html)
- `/app` → Main dashboard — shows role selection (student / company / university)
- `/app/student` → Student dashboard:
  - Profile setup: skills (tags), interests, preferences, agent instructions
  - Active experiences list
  - ProofAgent chat panel (right side)
  - Proof Score display + $PROOF balance
- `/app/company` → Company dashboard:
  - Profile: what they offer, required skills, culture preferences
  - Post new opportunity
  - View matched candidates (with match % score)
  - Pending validations to sign
- `/app/agent` → Full ProofAgent chat page

#### Key Components
- `WalletConnect.tsx` — connect wallet button using wagmi
- `AgentChat.tsx` — chat interface that talks to /api/agent endpoint
- `ExperienceCard.tsx` — shows experience status + sign buttons
- `SkillTag.tsx` — clickable skill tag with level selector
- `MatchCard.tsx` — shows student-company match with % score
- `ProofScoreBar.tsx` — animated score bar

#### API Routes
- `POST /api/agent` — receives message + studentProfile + companyList, calls Claude API, returns agent response with suggested actions (apply, suggest skill, etc.)
- `POST /api/match` — receives student profile + company requirements, returns match score (0-100) and explanation
- `GET /api/profile/[address]` — returns on-chain profile for a wallet address

### 3. Agent Logic (agent/)

Simple Node.js module:
- `matcher.js` — scoring function: compares student skills vs company requirements, weights: skills 50%, preferences 30%, proof score 20%
- `promptBuilder.js` — builds the system prompt for Claude with student context
- The agent should be proactive: when student hasn't applied in 7 days, suggest companies; when company hasn't validated, send reminder message

## File Structure
```
proofchain-mvp/
├── contracts/
│   ├── ProofToken.sol
│   ├── ProofNFT.sol
│   └── ProofRegistry.sol
├── hardhat.config.js (configured for Monad testnet)
├── scripts/
│   └── deploy.js
├── frontend/
│   ├── package.json
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx  (landing redirect)
│   │   ├── app/
│   │   │   ├── page.tsx (role selector)
│   │   │   ├── student/page.tsx
│   │   │   └── company/page.tsx
│   │   └── api/
│   │       ├── agent/route.ts
│   │       └── match/route.ts
│   └── components/
│       ├── AgentChat.tsx
│       ├── ExperienceCard.tsx
│       ├── SkillTag.tsx
│       └── MatchCard.tsx
└── README.md
```

## Style Guide
- Dark theme: background #06060f, cards rgba(255,255,255,0.04)
- Primary gradient: #7c3aed → #4f46e5 (purple)
- Accent cyan: #22d3ee
- Font: Space Grotesk (from Google Fonts)
- Border radius: 12-20px, glassmorphism cards
- Match the design vibe of the landing page already built

## Environment Variables needed (create .env.example)
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_CHAIN_ID=10143
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_PROOF_NFT_ADDRESS=0x...
NEXT_PUBLIC_PROOF_TOKEN_ADDRESS=0x...
PRIVATE_KEY=deployer_private_key
```

## Priority Order (hackathon MVP)
1. Smart contracts (complete and working)
2. Hardhat config for Monad testnet
3. Deploy script
4. Frontend student dashboard with agent chat
5. Company dashboard with match display
6. API routes for agent

## Notes
- Use mock data where blockchain calls aren't feasible yet
- The agent chat should work even without a real wallet connected (demo mode)
- Focus on working demo flows, not production-grade error handling
- Use OpenZeppelin contracts for token/NFT base

When completely finished, run this command to notify:
openclaw system event --text "Done: ProofChain MVP scaffolded — contracts + frontend + agent ready" --mode now
