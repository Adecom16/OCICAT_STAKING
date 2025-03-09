import { useAccount, useWriteContract, useReadContract } from "wagmi";
import liquidityStakingAbi from "./config/abi.json";
import { CONSTANTS } from "./config/constants";

const LIQUIDITY_STAKING_ADDRESS = CONSTANTS.LIQUIDITY_STAKING_ADDRESS as `0x${string}`;
const LIQUIDITY_STAKING_ADDRESS_ABI = liquidityStakingAbi;

export function useLiquidityStaking() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read Contract Data
  const stakeAmountQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "getUserStake",
    args: [address],
    query: { enabled: !!address },
  });

  const daoPowerQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "getUserDaoPower",
    args: [address],
    query: { enabled: !!address },
  });

  const pendingRewardsQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "getPendingRewards",
    args: [address],
    query: { enabled: !!address },
  });

  const rewardRateQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "rewardRate",
  });

  const coolDownPeriodQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "coolDownPeriod",
  });

  const emergencyUnstakeFeeQuery = useReadContract({
    address: LIQUIDITY_STAKING_ADDRESS,
    abi: LIQUIDITY_STAKING_ADDRESS_ABI,
    functionName: "emergencyUnstakeFee",
  });

  // Transaction Handler
  const executeTransaction = async (functionName: string, args = []) => {
    try {
      const tx = await writeContractAsync({
        address: LIQUIDITY_STAKING_ADDRESS,
        abi: LIQUIDITY_STAKING_ADDRESS_ABI,
        functionName,
        args,
      });
      return { success: true, message: `${functionName} executed successfully`, data: tx };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return { success: false, message: error?.message || `Failed to execute ${functionName}` };
    }
  };

  // Staking Functions
  const stake = async (amount: number) => {
    const response = await executeTransaction("stake", [amount]);
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  const unstake = async (amount: number) => {
    const response = await executeTransaction("unstake", [amount]);
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  const emergencyUnstake = async () => {
    const response = await executeTransaction("emergencyUnstake");
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  const claimRewards = async () => executeTransaction("claimRewards");

  const compoundRewards = async () => executeTransaction("compoundRewards");

  const withdrawAfterCooldown = async () => {
    const response = await executeTransaction("withdrawAfterCooldown");
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  // Admin Functions
  const setRewardRate = async (rate: number) => executeTransaction("setRewardRate", [rate]);

  const setCoolDownPeriod = async (period: number) => executeTransaction("setCoolDownPeriod", [period]);

  const setEmergencyUnstakeFee = async (fee: number) => executeTransaction("setEmergencyUnstakeFee", [fee]);

  const assignDaoPower = async (user: `0x${string}`, power: number) => executeTransaction("assignDaoPower", [user, power]);

  return {
    stakeAmountQuery,
    daoPowerQuery,
    pendingRewardsQuery,
    rewardRateQuery,
    coolDownPeriodQuery,
    emergencyUnstakeFeeQuery,
    stake,
    unstake,
    emergencyUnstake,
    claimRewards,
    compoundRewards,
    withdrawAfterCooldown,
    setRewardRate,
    setCoolDownPeriod,
    setEmergencyUnstakeFee,
    assignDaoPower,
  };
}