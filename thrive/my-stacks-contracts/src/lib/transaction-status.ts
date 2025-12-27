import { NETWORK_CONFIG, NETWORK } from './config';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface TransactionStatusUpdate {
  txId: string;
  status: TransactionStatus;
  blockHeight?: number;
  confirmations?: number;
  error?: string;
}

/**
 * Poll transaction status
 */
export async function pollTransactionStatus(
  txId: string,
  maxRetries = 60,
  retryInterval = 2000
): Promise<TransactionStatusUpdate> {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(
        `${NETWORK_CONFIG[NETWORK].apiUrl}/extended/v1/tx/${txId}`
      );

      if (!response.ok) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        continue;
      }

      const data = (await response.json()) as {
        tx_status: string;
        block_height?: number;
        burn_block_time?: number;
      };

      if (data.tx_status === 'success' || data.tx_status === 'confirmed') {
        return {
          txId,
          status: 'confirmed',
          blockHeight: data.block_height,
        };
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        return {
          txId,
          status: 'failed',
          error: `Transaction failed: ${data.tx_status}`,
        };
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    } catch (error) {
      console.error('Error polling transaction status:', error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }

  return {
    txId,
    status: 'failed',
    error: 'Transaction status check timed out',
  };
}

/**
 * Subscribe to transaction status using WebSocket (optional)
 */
export async function subscribeToTransactionStatus(
  txId: string,
  callback: (update: TransactionStatusUpdate) => void,
  wsUrl?: string
): Promise<() => void> {
  const pollInterval = setInterval(async () => {
    const status = await pollTransactionStatus(txId, 5, 1000);
    callback(status);

    if (status.status !== 'pending') {
      clearInterval(pollInterval);
    }
  }, 5000);

  return () => clearInterval(pollInterval);
}
