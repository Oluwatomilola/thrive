import React, { useState } from 'react';
import { useWalletConnect } from '../hooks/useWalletConnect';
import { buildStakeTransaction, getNonce, broadcastTx } from '../lib/stacks-tx';
import { STXtoMicroSTX, microSTXtoSTX } from '../lib/account';

export interface StakingFormProps {
  onTxSubmit?: (txId: string) => void;
}

export const StakingForm: React.FC<StakingFormProps> = ({ onTxSubmit }) => {
  const { isConnected, principal, stakeAmount, isLoading } = useWalletConnect();
  const [amount, setAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !principal) {
      setTxError('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setTxError('Please enter a valid amount');
      return;
    }

    try {
      setTxLoading(true);
      setTxError(null);
      setTxSuccess(null);

      const microSTXAmount = STXtoMicroSTX(parseFloat(amount));
      const nonce = await getNonce(principal);
      
      const tx = await buildStakeTransaction(principal, microSTXAmount, nonce);
      
      // Note: In a real app, this would be signed by the wallet
      // For now, this is a placeholder
      const result = await broadcastTx(tx);

      if (result.status === 'pending') {
        setTxSuccess(`Transaction submitted: ${result.txId}`);
        setAmount('');
        onTxSubmit?.(result.txId);
      } else {
        setTxError(result.error || 'Failed to submit transaction');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setTxError(errorMsg);
    } finally {
      setTxLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="staking-form disabled">
        <p>Please connect your wallet to stake</p>
      </div>
    );
  }

  return (
    <div className="staking-form">
      <form onSubmit={handleStake}>
        <div className="form-group">
          <label htmlFor="amount">Amount to Stake (STX)</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in STX"
            disabled={txLoading || isLoading}
          />
        </div>

        {stakeAmount && stakeAmount > 0 && (
          <div className="current-stake">
            <p>Current Stake: {microSTXtoSTX(stakeAmount).toFixed(2)} STX</p>
          </div>
        )}

        {txError && <div className="error-message">{txError}</div>}
        {txSuccess && <div className="success-message">{txSuccess}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={txLoading || isLoading || !amount}
        >
          {txLoading ? 'Submitting...' : 'Stake STX'}
        </button>
      </form>
    </div>
  );
};
