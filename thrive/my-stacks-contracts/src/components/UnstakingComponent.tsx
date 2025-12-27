import React, { useState } from 'react';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { buildUnstakeTransaction, getNonce, broadcastTx } from '../lib/stacks-tx';
import { microSTXtoSTX } from '../lib/account';

export interface UnstakingComponentProps {
  onTxSubmit?: (txId: string) => void;
}

export const UnstakingComponent: React.FC<UnstakingComponentProps> = ({ onTxSubmit }) => {
  const { isConnected, principal, stakeAmount, isLoading } = useWalletConnect();
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const handleUnstake = async () => {
    if (!isConnected || !principal) {
      setTxError('Please connect your wallet first');
      return;
    }

    if (!stakeAmount || stakeAmount === 0) {
      setTxError('You have no stake to unstake');
      return;
    }

    try {
      setTxLoading(true);
      setTxError(null);
      setTxSuccess(null);

      const nonce = await getNonce(principal);
      const tx = await buildUnstakeTransaction(principal, nonce);
      
      // Note: In a real app, this would be signed by the wallet
      const result = await broadcastTx(tx);

      if (result.status === 'pending') {
        setTxSuccess(`Unstake transaction submitted: ${result.txId}`);
        onTxSubmit?.(result.txId);
      } else {
        setTxError(result.error || 'Failed to submit unstake transaction');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setTxError(errorMsg);
    } finally {
      setTxLoading(false);
    }
  };

  const stakeDisplay = stakeAmount ? microSTXtoSTX(stakeAmount).toFixed(2) : '0';

  if (!isConnected) {
    return (
      <div className="unstaking-component disabled">
        <p>Please connect your wallet to unstake</p>
      </div>
    );
  }

  return (
    <div className="unstaking-component">
      <div className="stake-info">
        <h3>Current Stake</h3>
        <p className="stake-amount">{stakeDisplay} STX</p>
      </div>

      {txError && <div className="error-message">{txError}</div>}
      {txSuccess && <div className="success-message">{txSuccess}</div>}

      <button
        className="btn btn-danger"
        onClick={handleUnstake}
        disabled={txLoading || isLoading || !stakeAmount || stakeAmount === 0}
      >
        {txLoading ? 'Processing...' : 'Unstake All'}
      </button>
    </div>
  );
};
