import { NETWORK, NETWORK_CONFIG, CONTRACT_CONFIG } from './config';

/**
 * Fetch account balance in microSTX
 */
export async function fetchAccountBalance(principal: string): Promise<number> {
  try {
    const response = await fetch(
      `${NETWORK_CONFIG[NETWORK].apiUrl}/extended/v1/address/${principal}/balances`
    );
    const data = (await response.json()) as { stx: { balance: string } };
    return parseInt(data.stx.balance, 10);
  } catch (error) {
    console.error('Failed to fetch account balance:', error);
    return 0;
  }
}

/**
 * Fetch stake amount from contract
 */
export async function fetchStakeAmount(principal: string): Promise<number> {
  try {
    const response = await fetch(
      `${NETWORK_CONFIG[NETWORK].apiUrl}/extended/v2/contracts/call-read/${CONTRACT_CONFIG.address}/${CONTRACT_CONFIG.name}/${CONTRACT_CONFIG.functions.getStake}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arguments: [principal],
        }),
      }
    );

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as {
      result?: string;
      okay?: boolean;
    };

    if (data.result && data.okay) {
      // Parse the Clarity uint response
      const match = data.result.match(/u(\d+)/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  } catch (error) {
    console.error('Failed to fetch stake amount:', error);
    return 0;
  }
}

/**
 * Format microSTX to STX (divide by 1,000,000)
 */
export function microSTXtoSTX(microSTX: number): number {
  return microSTX / 1_000_000;
}

/**
 * Format STX to microSTX (multiply by 1,000,000)
 */
export function STXtoMicroSTX(stx: number): number {
  return Math.floor(stx * 1_000_000);
}
