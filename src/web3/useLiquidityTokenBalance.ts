// useLiquidityTokenBalance.ts
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONSTANTS } from "./config/constants";
import liquidityTokenAbi from "./config/liquidityTokenAbi.json"; // Replace with the actual ABI for the liquidity token

const LIQUIDITY_TOKEN_ADDRESS = CONSTANTS.LIQUIDITY_TOKEN_ADDRESS as `0x${string}`;
const LIQUIDITY_TOKEN_ABI = liquidityTokenAbi;

export function useLiquidityTokenBalance(walletAddress: string) {
  const { data: rawBalance } = useReadContract({
    address: LIQUIDITY_TOKEN_ADDRESS,
    abi: LIQUIDITY_TOKEN_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  const { data: decimals } = useReadContract({
    address: LIQUIDITY_TOKEN_ADDRESS,
    abi: LIQUIDITY_TOKEN_ABI,
    functionName: "decimals",
  });
  const formattedBalance =
    rawBalance && decimals
      ? formatUnits(BigInt(rawBalance as string), decimals as number)
      : "0";
  return formattedBalance;
}