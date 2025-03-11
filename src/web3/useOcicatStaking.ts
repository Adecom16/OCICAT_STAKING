import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { CONSTANTS } from "./config/constants";
import ocicatStakingAbi from "./config/abi.json";

const OCICAT_STAKING_CONTRACT_ADDRESS = CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const OCICAT_STAKING_CONTRACT_ABI = ocicatStakingAbi;

export function useOcicatStaking() {
  const { address, isConnected } = useAccount();

  // Contract Interactions (Write)
  const { writeContractAsync } = useWriteContract();

  // Contract Reads
  const stakeAmountQuery = useReadContract({
    address: OCICAT_STAKING_CONTRACT_ADDRESS,
    abi: OCICAT_STAKING_CONTRACT_ABI,
    functionName: "getUserStake",
    args: [address],
    query: { enabled: !!address },
  });

  const daoPowerQuery = useReadContract({
    address: OCICAT_STAKING_CONTRACT_ADDRESS,
    abi: OCICAT_STAKING_CONTRACT_ABI,
    functionName: "getUserDaoPower",
    args: [address],
    query: { enabled: !!address },
  });

  const rewardRateQuery = useReadContract({
    address: OCICAT_STAKING_CONTRACT_ADDRESS,
    abi: OCICAT_STAKING_CONTRACT_ABI,
    functionName: "rewardRate",
  });

  const coolDownPeriodQuery = useReadContract({
    address: OCICAT_STAKING_CONTRACT_ADDRESS,
    abi: OCICAT_STAKING_CONTRACT_ABI,
    functionName: "coolDownPeriod",
  });

  const emergencyUnstakeFeeQuery = useReadContract({
    address: OCICAT_STAKING_CONTRACT_ADDRESS,
    abi: OCICAT_STAKING_CONTRACT_ABI,
    functionName: "emergencyUnstakeFee",
  });

  // Generic Transaction Handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeTransaction = async (functionName: string, args: any[] = []) => {
    try {
      const tx = await writeContractAsync({
        address: OCICAT_STAKING_CONTRACT_ADDRESS,
        abi: OCICAT_STAKING_CONTRACT_ABI,
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
    if (response.success) {
      stakeAmountQuery.refetch()

         // Set cooldown end time
         const cooldownPeriod = Number(coolDownPeriodQuery.data);
         const cooldownEndTime = Date.now() + cooldownPeriod * 1000; // Convert to milliseconds
         return { ...response, cooldownEndTime };
    };
    return response;
  };

  const emergencyUnstake = async () => {
    const response = await executeTransaction("emergencyUnstake");
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  const claimRewards = async () => executeTransaction("claimRewards");

  const withdrawAfterCooldown = async () => {
    const response = await executeTransaction("withdrawAfterCooldown");
    if (response.success) stakeAmountQuery.refetch();
    return response;
  };

  // Admin Functions
  const setRewardRate = async (rate: number) => executeTransaction("setRewardRate", [rate]);

  const setCoolDownPeriod = async (period: number) => executeTransaction("setCoolDownPeriod", [period]);

  const setEmergencyUnstakeFee = async (fee: number) => executeTransaction("setEmergencyUnstakeFee", [fee]);

  const assignDaoPower = async (user: `0x${string}`, power: number) =>
    executeTransaction("assignDaoPower", [user, power]);

  return {
    isConnected,
    stakeAmount: stakeAmountQuery.data,
    daoPower: daoPowerQuery.data,
    rewardRate: rewardRateQuery.data,
    coolDownPeriod: coolDownPeriodQuery.data,
    emergencyUnstakeFee: emergencyUnstakeFeeQuery.data,
    stake,
    unstake,
    emergencyUnstake,
    claimRewards,
    withdrawAfterCooldown,
    setRewardRate,
    setCoolDownPeriod,
    setEmergencyUnstakeFee,
    assignDaoPower,
  };
}
