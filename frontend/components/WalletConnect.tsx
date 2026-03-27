'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="px-4 py-2 rounded-full text-sm font-medium text-white/80 bg-white/5 border border-white/10">
          {truncatedAddress}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-purple-500/25 cursor-pointer"
    >
      Connect Wallet
    </button>
  );
}
