export interface Company {
  id: string
  name: string
  industry: string
  requiredSkills: string[]
  location: string
  remote: boolean
  culture: string
  description: string
}

export interface Experience {
  id: string
  type: string
  company: string
  role: string
  status: 'pending' | 'submitted' | 'verified'
  proofHash?: string
  timestamp: number
  description: string
}

export interface StudentProfile {
  address: string
  name: string
  skills: string[]
  interests: string[]
  preferences: {
    remote: boolean
    industries: string[]
    locations: string[]
  }
  proofScore: number
  totalExperiences: number
  verifiedExperiences: number
  nftCount: number
  tokenBalance: number
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Monad Labs',
    industry: 'Blockchain Infrastructure',
    requiredSkills: ['Solidity', 'Rust', 'Distributed Systems'],
    location: 'New York, NY',
    remote: true,
    culture: 'Fast-paced, research-driven, open source contributors',
    description: 'Building the next generation of high-performance L1 blockchain with parallel execution.',
  },
  {
    id: '2',
    name: 'Aave Protocol',
    industry: 'DeFi',
    requiredSkills: ['Solidity', 'TypeScript', 'Financial Modeling'],
    location: 'London, UK',
    remote: true,
    culture: 'Decentralized governance, community-first, innovation-focused',
    description: 'Leading decentralized lending and borrowing protocol across multiple chains.',
  },
  {
    id: '3',
    name: 'Chainlink Labs',
    industry: 'Oracle Infrastructure',
    requiredSkills: ['Go', 'Solidity', 'Data Engineering'],
    location: 'San Francisco, CA',
    remote: true,
    culture: 'Academic rigor, cross-chain collaboration, reliability-first',
    description: 'Providing tamper-proof data feeds and verifiable randomness for smart contracts.',
  },
  {
    id: '4',
    name: 'Paradigm',
    industry: 'Crypto Venture Capital',
    requiredSkills: ['Research', 'Solidity', 'Economics', 'Python'],
    location: 'San Francisco, CA',
    remote: false,
    culture: 'Research-intensive, long-term thinking, technical depth',
    description: 'Research-driven crypto venture fund investing in the future of web3.',
  },
  {
    id: '5',
    name: 'Uniswap Labs',
    industry: 'DeFi / DEX',
    requiredSkills: ['React', 'Solidity', 'TypeScript', 'Smart Contract Security'],
    location: 'New York, NY',
    remote: true,
    culture: 'Open source, user-focused, protocol-driven development',
    description: 'Building the leading decentralized exchange protocol and interface.',
  },
]

export const mockExperiences: Experience[] = [
  {
    id: '1',
    type: 'Internship',
    company: 'Monad Labs',
    role: 'Smart Contract Engineering Intern',
    status: 'verified',
    proofHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
    description: 'Built and tested parallel execution modules for the Monad EVM. Contributed to gas optimization research.',
  },
  {
    id: '2',
    type: 'Hackathon',
    company: 'ETHGlobal',
    role: 'Finalist - DeFi Track',
    status: 'submitted',
    proofHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
    description: 'Built a cross-chain lending aggregator at ETHGlobal NYC. Placed top 10 in the DeFi track.',
  },
  {
    id: '3',
    type: 'Open Source',
    company: 'Uniswap',
    role: 'Contributor',
    status: 'pending',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    description: 'Submitted PR to optimize swap routing algorithm. Reduced gas costs by 12% for multi-hop swaps.',
  },
]

export const mockStudentProfile: StudentProfile = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
  name: 'Alex Chen',
  skills: ['Solidity', 'TypeScript', 'React', 'Rust', 'Smart Contract Security', 'DeFi Protocols'],
  interests: ['DeFi', 'MEV Research', 'ZK Proofs', 'Protocol Design'],
  preferences: {
    remote: true,
    industries: ['DeFi', 'Blockchain Infrastructure', 'Oracle Infrastructure'],
    locations: ['New York, NY', 'San Francisco, CA', 'Remote'],
  },
  proofScore: 847,
  totalExperiences: 3,
  verifiedExperiences: 1,
  nftCount: 1,
  tokenBalance: 2500,
}
