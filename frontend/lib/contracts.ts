export const PROOF_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_PROOF_REGISTRY_ADDRESS as `0x${string}` | undefined
export const PROOF_NFT_ADDRESS = process.env.NEXT_PUBLIC_PROOF_NFT_ADDRESS as `0x${string}` | undefined
export const PROOF_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_PROOF_TOKEN_ADDRESS as `0x${string}` | undefined

export const PROOF_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'student', type: 'address' },
      { name: 'experienceType', type: 'string' },
      { name: 'company', type: 'string' },
      { name: 'role', type: 'string' },
      { name: 'proofHash', type: 'bytes32' },
    ],
    name: 'submitProof',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'proofId', type: 'uint256' }],
    name: 'verifyProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'proofId', type: 'uint256' }],
    name: 'getProof',
    outputs: [
      {
        components: [
          { name: 'student', type: 'address' },
          { name: 'experienceType', type: 'string' },
          { name: 'company', type: 'string' },
          { name: 'role', type: 'string' },
          { name: 'proofHash', type: 'bytes32' },
          { name: 'verified', type: 'bool' },
          { name: 'timestamp', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'student', type: 'address' }],
    name: 'getStudentProofs',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'student', type: 'address' }],
    name: 'getProofScore',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const PROOF_NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'proofId', type: 'uint256' },
      { name: 'tokenURI', type: 'string' },
    ],
    name: 'mintProofNFT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const PROOF_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
