import React from 'react';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { microSTXtoSTX } from '../lib/account';

export const ConnectWalletButton: React.FC = () => {
  const { isConnected, principal, balance, isLoading, error, connect, disconnect } =
    useWalletConnect();

  if (isLoading) {
    return (
      <button className="btn btn-loading" disabled>
        Connecting...
      </button>
    );
  }

  if (isConnected && principal) {
    return (
      <div className="wallet-info">
        <div className="wallet-connected">
          <p className="principal">
            {principal.slice(0, 8)}...{principal.slice(-6)}
          </p>
          {balance !== null && (
            <p className="balance">
              Balance: {microSTXtoSTX(balance).toFixed(2)} STX
            </p>
          )}
        </div>
        <button className="btn btn-secondary" onClick={disconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="connect-wallet">
      <button className="btn btn-primary" onClick={connect} disabled={isLoading}>
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
