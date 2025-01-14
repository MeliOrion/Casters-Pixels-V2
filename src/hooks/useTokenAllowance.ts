import { useContractRead } from 'wagmi';
import { erc20ABI } from 'wagmi';

export const useTokenAllowance = (tokenAddress: `0x${string}`, owner: `0x${string}` | undefined, spender: `0x${string}`) => {
  const { data: allowance } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner ?? '0x0000000000000000000000000000000000000000', spender],
    enabled: !!owner,
    watch: true,
  });

  return { allowance };
};
