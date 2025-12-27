import React from 'react';

export interface ActivityFeedItem {
  id: string;
  type: 'stake' | 'unstake';
  amount: number;
  timestamp: Date;
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface ActivityFeedProps {
  items: ActivityFeedItem[];
  isLoading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, isLoading = false }) => {
  if (isLoading) {
    return <div className="activity-feed loading">Loading activity...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="activity-feed empty">
        <p>No activity yet. Start by connecting your wallet and staking.</p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <h3>Recent Activity</h3>
      <div className="feed-items">
        {items.map((item) => (
          <div key={item.id} className={`feed-item ${item.type} ${item.status}`}>
            <div className="item-header">
              <span className="type-badge">{item.type.toUpperCase()}</span>
              <span className={`status-badge ${item.status}`}>{item.status}</span>
            </div>
            <div className="item-details">
              <p className="amount">{item.amount.toFixed(2)} STX</p>
              <p className="timestamp">{item.timestamp.toLocaleString()}</p>
              <p className="tx-id">
                <a
                  href={`https://explorer.hiro.so/txid/${item.txId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.txId.slice(0, 8)}...{item.txId.slice(-6)}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
