import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { erc20ABI } from 'wagmi';
import { parseEther } from 'viem';

export const useTokenApprove = (tokenAddress: `0x${string}`, spender: `0x${string}`) => {
  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender, parseEther('1000000')],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return { data, isLoading, isSuccess, write };
};
