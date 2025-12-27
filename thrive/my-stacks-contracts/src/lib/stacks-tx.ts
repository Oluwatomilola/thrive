import {
  buildContractCall,
  ClarityValue,
  uintCV,
  principalCV,
  broadcastTransaction,
  StacksTestnet,
  StacksMainnet,
  TxBroadcastResult,
} from '@stacks/transactions';
import { CONTRACT_CONFIG, NETWORK, NETWORK_CONFIG } from './config';

export type TransactionResult = {
  txId: string;
  status: 'pending' | 'confirmed' | 'failed';
  error?: string;
};

const getNetwork = () => {
  return NETWORK === 'testnet' ? new StacksTestnet() : new StacksMainnet();
};

/**
 * Build a stake transaction
 * @param sender Principal address of the staker
 * @param amount STX amount to stake (in microSTX)
 * @param nonce Transaction nonce
 * @param fee Transaction fee in microSTX
 */
export async function buildStakeTransaction(
  sender: string,
  amount: number,
  nonce: number,
  fee: number = 10000
) {
  const txOptions = {
    contractAddress: CONTRACT_CONFIG.address,
    contractName: CONTRACT_CONFIG.name,
    functionName: CONTRACT_CONFIG.functions.stake,
    functionArgs: [uintCV(amount)],
    senderKey: '', // Will be signed by wallet
    nonce,
    fee,
    network: getNetwork(),
  };

  return buildContractCall(txOptions);
}

/**
 * Build an unstake transaction
 * @param sender Principal address of the staker
 * @param nonce Transaction nonce
 * @param fee Transaction fee in microSTX
 */
export async function buildUnstakeTransaction(
  sender: string,
  nonce: number,
  fee: number = 10000
) {
  const txOptions = {
    contractAddress: CONTRACT_CONFIG.address,
    contractName: CONTRACT_CONFIG.name,
    functionName: CONTRACT_CONFIG.functions.unstake,
    functionArgs: [],
    senderKey: '', // Will be signed by wallet
    nonce,
    fee,
    network: getNetwork(),
  };

  return buildContractCall(txOptions);
}

/**
 * Broadcast a signed transaction
 * @param tx Signed transaction
 */
export async function broadcastTx(tx: any): Promise<TransactionResult> {
  try {
    const result = (await broadcastTransaction(
      tx,
      getNetwork()
    )) as unknown as TxBroadcastResult;

    if (result.txid) {
      return {
        txId: result.txid,
        status: 'pending',
      };
    } else {
      return {
        txId: '',
        status: 'failed',
        error: 'No txid returned',
      };
    }
  } catch (error) {
    return {
      txId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get the nonce for a principal
 * @param principal Principal address
 */
export async function getNonce(principal: string): Promise<number> {
  try {
    const response = await fetch(
      `${NETWORK_CONFIG[NETWORK].apiUrl}/extended/v1/address/${principal}/nonces`
    );
    const data = (await response.json()) as { nonces: { possible: number[] } };
    return Math.max(...data.nonces.possible);
  } catch (error) {
    console.error('Failed to get nonce:', error);
    return 0;
  }
}
