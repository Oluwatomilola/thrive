import { create } from 'zustand';

export interface WalletState {
  isConnected: boolean;
  principal: string | null;
  balance: number | null;
  stakeAmount: number | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPrincipal: (principal: string | null) => void;
  setBalance: (balance: number | null) => void;
  setStakeAmount: (amount: number | null) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  disconnect: () => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  principal: null,
  balance: null,
  stakeAmount: null,
  isLoading: false,
  error: null,

  setPrincipal: (principal) => set({ principal }),
  setBalance: (balance) => set({ balance }),
  setStakeAmount: (amount) => set({ stakeAmount: amount }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  disconnect: () => set({
    isConnected: false,
    principal: null,
    balance: null,
    stakeAmount: null,
    error: null,
  }),

  reset: () => set({
    isConnected: false,
    principal: null,
    balance: null,
    stakeAmount: null,
    isLoading: false,
    error: null,
  }),
}));
