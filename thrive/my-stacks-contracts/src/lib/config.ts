export const NETWORK_CONFIG = {
  testnet: {
    name: 'testnet',
    chainId: 2147483648,
    apiUrl: import.meta.env.VITE_STACKS_API || 'https://api.testnet.hiro.so',
  },
  mainnet: {
    name: 'mainnet',
    chainId: 1,
    apiUrl: 'https://api.hiro.so',
  },
};

export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS || 'SP3FBR6Z532SXEMHD5P4JQ76FCBCSQD84SPJWM6H1',
  name: 'message-board',
  functions: {
    stake: 'stake',
    unstake: 'unstake',
    getStake: 'get-stake',
  },
};

export const NETWORK = (import.meta.env.VITE_NETWORK || 'testnet') as keyof typeof NETWORK_CONFIG;
export const CURRENT_NETWORK = NETWORK_CONFIG[NETWORK];
