import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
// import { ethers } from "ethers";
import { CONSTANTS } from "./config/constants";
import { formatUnits } from "viem";
import abi from "./config/abi.json";
import tokenabi from "./config/token_abi.json";
// import { convertFromFloat } from "@/lib/utils";
// Replace with your contract address
const STAKING_CONTRACT_ADDRESS = CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const STAKING_CONTRACT_ABI = abi;
export function useStakingContract() {
  const { address, isConnected } = useAccount();
  const { data: stakeHash, writeContractAsync: writeStakeContract } = useWriteContract();
  // Read stake amount
  const {
    data: stakeAmount,
    error,
    isPending,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getStakeInfo",
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  console.log(stakeAmount);
  if (error) {
    console.log(error);
  }
  if (isPending) {
    console.log(isPending);
  }
  // Stake function
  const { data: stakeReceiptData, isLoading: isStaking } =
  useWaitForTransactionReceipt({
    hash: stakeHash,
  });
  // const stakeContractFn = async (amount: string) => {
  //   writeContract({
  //     address: STAKING_CONTRACT_ADDRESS,
  //     abi: STAKING_CONTRACT_ABI,
  //     functionName: "stake",
  //     args: [convertFromFloat(Number(amount), 6)], // Replace with user input
  //   });
  //   return stakeReceiptData;
  // };

  // Withdraw function

  return { stakeAmount, isConnected, isStaking, writeStakeContract, stakeReceiptData};
}

export function useWithdrawContract() {
  const { data: withdrawHash, writeContract } = useWriteContract();
  const withdrawContractFn = (stakeId: number) => {
    writeContract({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: "withdraw",
      args: [stakeId], // Replace with stake ID
    });
    return withdrawHash;
  };

  return { withdrawContractFn };
}

const TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`; // Replace with actual token address
const TOKEN_ABI = tokenabi;
export function useTokenBalance(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}

const LIQUIDITY_TOKEN_ADDRESS = CONSTANTS.LIQUIDITY_TOKEN_ADDRESS as `0x${string}`;
import liquidityabi from './config/liquidityabi.json'
export function useLiquidityBalance(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: LIQUIDITY_TOKEN_ADDRESS,
    abi: liquidityabi,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: LIQUIDITY_TOKEN_ADDRESS,
    abi: liquidityabi,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}
