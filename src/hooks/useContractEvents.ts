import { useContractEvent } from 'wagmi';
import { useCallback } from 'react';
import { CASTERS_PIXELS_ABI } from '../constants/abis';

export type StatusUpdate = {
  type: 'request' | 'complete' | 'error' | 'legendary' | 'prizepool';
  address?: string;
  blockNumber?: number;
  reward?: bigint;
  prizePool?: bigint;
  timestamp?: number;
  message?: string;
};

export function useContractEvents(
  contractAddress: string,
  userAddress?: string,
  onStatus?: (update: StatusUpdate) => void
) {
  const handleGenerationRequested = useCallback(
    (
      logs: {
        args: {
          user: string;
          blockNumber: bigint;
        };
      }[]
    ) => {
      const { user, blockNumber } = logs[0].args;
      if (userAddress && user.toLowerCase() !== userAddress.toLowerCase()) return;
      onStatus?.({
        type: 'request',
        address: user,
        blockNumber: Number(blockNumber),
        timestamp: Date.now(),
        message: `Generation requested by ${user.slice(0, 6)}...${user.slice(-4)}`
      });
    },
    [userAddress, onStatus]
  );

  useContractEvent({
    address: contractAddress as `0x${string}`,
    abi: CASTERS_PIXELS_ABI,
    eventName: 'GenerationRequested',
    listener: handleGenerationRequested,
  });

  const handleGenerationComplete = useCallback(
    (
      logs: {
        args: {
          user: string;
          isLegendary: boolean;
          reward: bigint;
        };
      }[]
    ) => {
      const { user, isLegendary, reward } = logs[0].args;
      if (userAddress && user.toLowerCase() !== userAddress.toLowerCase()) return;
      onStatus?.({
        type: isLegendary ? 'legendary' : 'complete',
        address: user,
        reward,
        timestamp: Date.now(),
        message: isLegendary 
          ? `🎉 Legendary NFT generated! Reward: ${reward.toString()} CASTER`
          : `Generation complete! Reward: ${reward.toString()} CASTER`
      });
    },
    [userAddress, onStatus]
  );

  useContractEvent({
    address: contractAddress as `0x${string}`,
    abi: CASTERS_PIXELS_ABI,
    eventName: 'GenerationComplete',
    listener: handleGenerationComplete,
  });

  const handlePrizePoolUpdated = useCallback(
    (
      logs: {
        args: {
          newAmount: bigint;
        };
      }[]
    ) => {
      const { newAmount } = logs[0].args;
      onStatus?.({
        type: 'prizepool',
        prizePool: newAmount,
        timestamp: Date.now(),
        message: `Prize pool updated: ${newAmount.toString()} CASTER`
      });
    },
    [onStatus]
  );

  useContractEvent({
    address: contractAddress as `0x${string}`,
    abi: CASTERS_PIXELS_ABI,
    eventName: 'PrizePoolUpdated',
    listener: handlePrizePoolUpdated,
  });
}
