import React, { useState, useEffect } from 'react';
import { ConnectWalletButton } from '../components/ConnectWalletButton';
import { StakingForm } from '../components/StakingForm';
import { UnstakingComponent } from '../components/UnstakingComponent';
import { ActivityFeed, ActivityFeedItem } from '../components/ActivityFeed';
import '../styles/app.css';

export const StakingDApp: React.FC = () => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const handleTxSubmit = (txId: string) => {
    const newActivity: ActivityFeedItem = {
      id: txId,
      type: 'stake',
      amount: 0, // This would be fetched from tx
      timestamp: new Date(),
      txId,
      status: 'pending',
    };

    setActivities((prev) => [newActivity, ...prev]);

    // Simulate status update after 10s (in real app, this would come from Chainhooks)
    setTimeout(() => {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === txId ? { ...activity, status: 'confirmed' } : activity
        )
      );
    }, 10000);
  };

  return (
    <div className="staking-dapp">
      <header className="dapp-header">
        <h1>Stacks Staking dApp</h1>
        <p>Stake your STX and earn rewards with real-time updates</p>
      </header>

      <main className="dapp-main">
        <div className="section wallet-section">
          <h2>Wallet Connection</h2>
          <ConnectWalletButton />
        </div>

        <div className="sections-grid">
          <div className="section staking-section">
            <h2>Stake STX</h2>
            <StakingForm onTxSubmit={handleTxSubmit} />
          </div>

          <div className="section unstaking-section">
            <h2>Unstake</h2>
            <UnstakingComponent onTxSubmit={handleTxSubmit} />
          </div>
        </div>

        <div className="section activity-section">
          <ActivityFeed items={activities} isLoading={isLoadingActivities} />
        </div>
      </main>

      <footer className="dapp-footer">
        <p>
          Built with <strong>Stacks</strong>, <strong>WalletConnect</strong>, and{' '}
          <strong>Hiro Chainhooks</strong>
        </p>
      </footer>
    </div>
  );
};

export default StakingDApp;
