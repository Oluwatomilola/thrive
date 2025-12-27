import { useCallback, useEffect } from 'react';
import { authenticate } from '@stacks/auth';
import { StacksTestnet, StacksMainnet } from '@stacks/transactions';
import { useWalletStore } from '../store/wallet-store';
import { NETWORK, NETWORK_CONFIG } from '../lib/config';
import { fetchAccountBalance, fetchStakeAmount } from '../lib/account';

export function useWalletConnect() {
  const {
    isConnected,
    principal,
    balance,
    stakeAmount,
    isLoading,
    error,
    setPrincipal,
    setBalance,
    setStakeAmount,
    setConnected,
    setLoading,
    setError,
    disconnect: disconnectStore,
  } = useWalletStore();

  const network = NETWORK === 'testnet' ? new StacksTestnet() : new StacksMainnet();

  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const appDetails = {
        name: 'Stacks Staking dApp',
        icon: 'https://freesvg.org/img/bitcoin-new-logo.png',
      };

      const response = await authenticate({
        appDetails,
        redirectTo: '/',
        onFinish: async (authData) => {
          const userPrincipal = authData.userSession.loadUserData().profile.stxAddress[NETWORK];
          setPrincipal(userPrincipal);
          setConnected(true);

          // Fetch balance and stake amount
          try {
            const bal = await fetchAccountBalance(userPrincipal);
            setBalance(bal);

            const stake = await fetchStakeAmount(userPrincipal);
            setStakeAmount(stake);
          } catch (err) {
            console.error('Failed to fetch balance/stake:', err);
          }
        },
        onCancel: () => {
          setError('Authentication cancelled');
        },
      });

      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMsg);
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  }, [setPrincipal, setConnected, setLoading, setError, setBalance, setStakeAmount]);

  const disconnect = useCallback(() => {
    disconnectStore();
    // Clear any stored auth
    localStorage.removeItem('stacks_session');
  }, [disconnectStore]);

  const reconnect = useCallback(async () => {
    if (principal) {
      try {
        setLoading(true);
        const bal = await fetchAccountBalance(principal);
        setBalance(bal);

        const stake = await fetchStakeAmount(principal);
        setStakeAmount(stake);
      } catch (err) {
        console.error('Failed to reconnect:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [principal, setBalance, setStakeAmount, setLoading]);

  // Check if user was previously connected
  useEffect(() => {
    const checkPreviousSession = async () => {
      try {
        const stored = localStorage.getItem('stacks_principal');
        if (stored) {
          setPrincipal(stored);
          setConnected(true);
          await reconnect();
        }
      } catch (err) {
        console.error('Error checking previous session:', err);
      }
    };

    checkPreviousSession();
  }, []);

  return {
    isConnected,
    principal,
    balance,
    stakeAmount,
    isLoading,
    error,
    connect,
    disconnect,
    reconnect,
  };
}
