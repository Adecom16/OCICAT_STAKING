// useTokenBalance.ts
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONSTANTS } from "./config/constants";
import tokenAbi from "./config/token_abi.json" // Replace with the actual ABI for the token

const TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const TOKEN_ABI = tokenAbi;

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