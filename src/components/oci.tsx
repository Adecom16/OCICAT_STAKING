"use client";
import { useState, useEffect } from "react";
import { useLiquidityStaking } from "../web3/useLiquidityStaking";
import { useOcicatStaking } from "../web3/useOcicatStaking";
import { useAccount } from "wagmi";

const StakingInterface = () => {
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [period, setPeriod] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [userAddress] = useState<`0x${string}`>("0x");
  const [power, setPower] = useState<number>(0);
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);

  const ocicatStaking = useOcicatStaking();
  const liquidityStaking = useLiquidityStaking();
  const { isConnected } = useAccount();

  // Countdown for cooldown period
  useEffect(() => {
    if (cooldownTime !== null && cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleUnstake = async (unstakeFunction: (amount: number) => Promise<any>) => {
    const response = await unstakeFunction(amount);
    if (response.success) {
      // Safely convert cooldown period to a number
      const cooldownPeriod = Number(ocicatStaking.coolDownPeriod) || 0;
      setCooldownTime(cooldownPeriod);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Staking Dashboard</h1>

      {/* Ocicat Staking Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ocicat Staking</h2>

        {/* Staking Actions */}
        <div className="space-y-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 p-2 rounded w-full"
            placeholder="Amount to stake/unstake"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => ocicatStaking.stake(amount)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex-1"
            >
              Stake
            </button>
            <button
              onClick={() => handleUnstake(ocicatStaking.unstake)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex-1"
            >
              Unstake
            </button>
            <button
              onClick={ocicatStaking.emergencyUnstake}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded flex-1"
            >
              Emergency Unstake
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={ocicatStaking.claimRewards}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1"
            >
              Claim Rewards
            </button>
            <button
              onClick={ocicatStaking.withdrawAfterCooldown}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded flex-1"
            >
              Withdraw After Cooldown
            </button>
          </div>
        </div>

        {/* Cooldown Timer */}
        {cooldownTime !== null && cooldownTime > 0 && (
          <div className="mt-4 text-center">
            <p>Cooldown: {cooldownTime} seconds remaining</p>
          </div>
        )}

        {/* Display Data */}
        <div className="mt-6 space-y-2">
          <p>Staked Amount: {ocicatStaking.stakeAmount?.toString()}</p>
          <p>DAO Power: {ocicatStaking.daoPower?.toString()}</p>
          <p>Reward Rate: {ocicatStaking.rewardRate?.toString()}</p>
          <p>Cooldown Period: {ocicatStaking.coolDownPeriod?.toString()}</p>
          <p>Emergency Unstake Fee: {ocicatStaking.emergencyUnstakeFee?.toString()}</p>
        </div>
      </div>

      {/* Liquidity Staking Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Liquidity Staking</h2>

        {/* Staking Actions */}
        <div className="space-y-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 p-2 rounded w-full"
            placeholder="Amount to stake/unstake"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => liquidityStaking.stake(amount)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex-1"
            >
              Stake
            </button>
            <button
              onClick={() => handleUnstake(liquidityStaking.unstake)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded flex-1"
            >
              Unstake
            </button>
            <button
              onClick={liquidityStaking.emergencyUnstake}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded flex-1"
            >
              Emergency Unstake
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={liquidityStaking.claimRewards}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1"
            >
              Claim Rewards
            </button>
            <button
              onClick={liquidityStaking.compoundRewards}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded flex-1"
            >
              Compound Rewards
            </button>
            <button
              onClick={liquidityStaking.withdrawAfterCooldown}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded flex-1"
            >
              Withdraw After Cooldown
            </button>
          </div>
        </div>

        {/* Display Data */}
        <div className="mt-6 space-y-2">
          <p>Staked Amount: {liquidityStaking.stakeAmountQuery.data?.toString()}</p>
          <p>DAO Power: {liquidityStaking.daoPowerQuery.data?.toString()}</p>
          <p>Pending Rewards: {liquidityStaking.pendingRewardsQuery.data?.toString()}</p>
          <p>Reward Rate: {liquidityStaking.rewardRateQuery.data?.toString()}</p>
          <p>Cooldown Period: {liquidityStaking.coolDownPeriodQuery.data?.toString()}</p>
          <p>Emergency Unstake Fee: {liquidityStaking.emergencyUnstakeFeeQuery.data?.toString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;