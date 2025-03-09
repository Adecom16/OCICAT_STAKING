"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useOcicatStaking } from "../web3/useOcicatStaking";
import { useLiquidityStaking } from "../web3/useLiquidityStaking";
import { useTokenBalance } from "../web3/useTokenBalance";
import { useLiquidityTokenBalance } from "../web3/useLiquidityTokenBalance";

const StakingInterface = () => {
  const { address, isConnected } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [rewardRate, setRewardRate] = useState("");
  const [coolDownPeriod, setCoolDownPeriod] = useState("");
  const [emergencyUnstakeFee, setEmergencyUnstakeFee] = useState("");
  const [daoPowerUser, setDaoPowerUser] = useState("");
  const [daoPowerAmount, setDaoPowerAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remainingCoolDown, setRemainingCoolDown] = useState<number | null>(null);

  // Ocicat Staking Hook
  const {
    stakeAmount: ocicatStakeAmount,
    daoPower: ocicatDaoPower,
    coolDownPeriod: ocicatCoolDownPeriod,
    rewardRate: ocicatRewardRate,
    emergencyUnstakeFee: ocicatEmergencyUnstakeFee,
    isStaking: isOcicatStaking,
    isUnstaking: isOcicatUnstaking,
    isEmergencyUnstaking: isOcicatEmergencyUnstaking,
    isClaimingRewards: isOcicatClaimingRewards,
    isWithdrawing: isOcicatWithdrawing,
    stake: ocicatStake,
    unstake: ocicatUnstake,
    emergencyUnstake: ocicatEmergencyUnstake,
    claimRewards: ocicatClaimRewards,
    withdrawAfterCooldown: ocicatWithdrawAfterCooldown,
    setRewardRate: ocicatSetRewardRate,
    setCoolDownPeriod: ocicatSetCoolDownPeriod,
    setEmergencyUnstakeFee: ocicatSetEmergencyUnstakeFee,
    assignDaoPower: ocicatAssignDaoPower,
  } = useOcicatStaking();

  // Liquidity Staking Hook
  const {
    stakeAmount: liquidityStakeAmount,
    daoPower: liquidityDaoPower,
    coolDownPeriod: liquidityCoolDownPeriod,
    rewardRate: liquidityRewardRate,
    emergencyUnstakeFee: liquidityEmergencyUnstakeFee,
    isStaking: isLiquidityStaking,
    isUnstaking: isLiquidityUnstaking,
    isEmergencyUnstaking: isLiquidityEmergencyUnstaking,
    isClaimingRewards: isLiquidityClaimingRewards,
    isWithdrawing: isLiquidityWithdrawing,
    stake: liquidityStake,
    unstake: liquidityUnstake,
    emergencyUnstake: liquidityEmergencyUnstake,
    claimRewards: liquidityClaimRewards,
    withdrawAfterCooldown: liquidityWithdrawAfterCooldown,
    setRewardRate: liquiditySetRewardRate,
    setCoolDownPeriod: liquiditySetCoolDownPeriod,
    setEmergencyUnstakeFee: liquiditySetEmergencyUnstakeFee,
    assignDaoPower: liquidityAssignDaoPower,
  } = useLiquidityStaking();

  // Token Balance Hooks
  const tokenBalance = useTokenBalance(address || "0x0");
  const liquidityTokenBalance = useLiquidityTokenBalance(address || "0x0");

  // Handle Stake
  const handleStake = async (stakeFunction: (amount: number) => Promise<void>) => {
    if (!stakeAmount) {
      setError("Please enter an amount to stake.");
      return;
    }

    try {
      const amount = Number(Number(stakeAmount) * 1e18); // Convert to wei
      await stakeFunction(amount);
      setStakeAmount("");
      setError(null);
    } catch (err) {
      setError("Failed to stake. Please try again.");
      console.error(err);
    }
  };

  // Handle Unstake
  const handleUnstake = async (unstakeFunction: () => Promise<void>) => {
    try {
      await unstakeFunction();
      setError(null);
    } catch (err) {
      setError("Failed to unstake. Please try again.");
      console.error(err);
    }
  };

  // Handle Set Reward Rate
  const handleSetRewardRate = async (setRewardRateFunction: (rate: number) => Promise<void>) => {
    if (!rewardRate) {
      setError("Please enter a reward rate.");
      return;
    }

    try {
      const rate = Number(rewardRate);
      await setRewardRateFunction(rate);
      setRewardRate("");
      setError(null);
    } catch (err) {
      setError("Failed to set reward rate. Please try again.");
      console.error(err);
    }
  };

  // Handle Set Cool-Down Period
  const handleSetCoolDownPeriod = async (setCoolDownPeriodFunction: (period: number) => Promise<void>) => {
    if (!coolDownPeriod) {
      setError("Please enter a cool-down period.");
      return;
    }

    try {
      const period = Number(coolDownPeriod);
      await setCoolDownPeriodFunction(period);
      setCoolDownPeriod("");
      setError(null);
    } catch (err) {
      setError("Failed to set cool-down period. Please try again.");
      console.error(err);
    }
  };

  // Handle Set Emergency Unstake Fee
  const handleSetEmergencyUnstakeFee = async (setEmergencyUnstakeFeeFunction: (fee: number) => Promise<void>) => {
    if (!emergencyUnstakeFee) {
      setError("Please enter an emergency unstake fee.");
      return;
    }

    try {
      const fee = Number(emergencyUnstakeFee);
      await setEmergencyUnstakeFeeFunction(fee);
      setEmergencyUnstakeFee("");
      setError(null);
    } catch (err) {
      setError("Failed to set emergency unstake fee. Please try again.");
      console.error(err);
    }
  };

  // Handle Assign DAO Power
  const handleAssignDaoPower = async (assignDaoPowerFunction: (user: `0x${string}`, power: number) => Promise<void>) => {
    if (!daoPowerUser || !daoPowerAmount) {
      setError("Please enter a user address and DAO power amount.");
      return;
    }

    try {
      const power = Number(daoPowerAmount);
      await assignDaoPowerFunction(daoPowerUser as `0x${string}`, power);
      setDaoPowerUser("");
      setDaoPowerAmount("");
      setError(null);
    } catch (err) {
      setError("Failed to assign DAO power. Please try again.");
      console.error(err);
    }
  };

  // Cool-Down Countdown Timer
  useEffect(() => {
    if (ocicatCoolDownPeriod) {
      const interval = setInterval(() => {
        setRemainingCoolDown((prev) => (prev ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ocicatCoolDownPeriod]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Staking Interface</h1>
      <p className="text-center text-gray-400">
        {isConnected ? `Connected: ${address}` : "Not Connected"}
      </p>

      {/* Token Balances */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Token Balances</h2>
        <p>Ocicat Token Balance: {tokenBalance}</p>
        <p>Liquidity Token Balance: {liquidityTokenBalance}</p>
      </div>

      {/* Staking Sections */}
      {[
        {
          title: "Ocicat Staking",
          stakedAmount: ocicatStakeAmount,
          daoPower: ocicatDaoPower,
          coolDownPeriod: ocicatCoolDownPeriod,
          rewardRate: ocicatRewardRate,
          emergencyUnstakeFee: ocicatEmergencyUnstakeFee,
          isStaking: isOcicatStaking,
          stakeFunction: ocicatStake,
          unstakeFunction: ocicatUnstake,
          emergencyUnstakeFunction: ocicatEmergencyUnstake,
          claimRewardsFunction: ocicatClaimRewards,
          withdrawFunction: ocicatWithdrawAfterCooldown,
          setRewardRateFunction: ocicatSetRewardRate,
          setCoolDownPeriodFunction: ocicatSetCoolDownPeriod,
          setEmergencyUnstakeFeeFunction: ocicatSetEmergencyUnstakeFee,
          assignDaoPowerFunction: ocicatAssignDaoPower,
        },
        {
          title: "Liquidity Staking",
          stakedAmount: liquidityStakeAmount,
          daoPower: liquidityDaoPower,
          coolDownPeriod: liquidityCoolDownPeriod,
          rewardRate: liquidityRewardRate,
          emergencyUnstakeFee: liquidityEmergencyUnstakeFee,
          isStaking: isLiquidityStaking,
          stakeFunction: liquidityStake,
          unstakeFunction: liquidityUnstake,
          emergencyUnstakeFunction: liquidityEmergencyUnstake,
          claimRewardsFunction: liquidityClaimRewards,
          withdrawFunction: liquidityWithdrawAfterCooldown,
          setRewardRateFunction: liquiditySetRewardRate,
          setCoolDownPeriodFunction: liquiditySetCoolDownPeriod,
          setEmergencyUnstakeFeeFunction: liquiditySetEmergencyUnstakeFee,
          assignDaoPowerFunction: liquidityAssignDaoPower,
        },
      ].map(
        (
          {
            title,
            stakedAmount,
            daoPower,
            coolDownPeriod,
            rewardRate,
            emergencyUnstakeFee,
            isStaking,
            stakeFunction,
            unstakeFunction,
            emergencyUnstakeFunction,
            claimRewardsFunction,
            withdrawFunction,
            setRewardRateFunction,
            setCoolDownPeriodFunction,
            setEmergencyUnstakeFeeFunction,
            assignDaoPowerFunction,
          },
          index
        ) => (
          <div key={index} className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p>Staked Amount: {stakedAmount?.toString()}</p>
            <p>DAO Power: {daoPower?.toString()}</p>
            <p>Cool-Down Period: {coolDownPeriod?.toString()} seconds</p>
            <p>Reward Rate: {rewardRate?.toString()} per second</p>
            <p>Emergency Unstake Fee: {emergencyUnstakeFee?.toString()}%</p>

            {/* Cool-Down Countdown */}
            {remainingCoolDown !== null && (
              <p>Remaining Cool-Down: {remainingCoolDown} seconds</p>
            )}

            {/* Stake Input */}
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Amount to stake"
              className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Stake Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleStake(stakeFunction)}
                disabled={isStaking}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md disabled:opacity-50"
              >
                {isStaking ? "Staking..." : "Stake"}
              </button>
              <button
                onClick={() => handleUnstake(unstakeFunction)}
                disabled={isStaking}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md disabled:opacity-50"
              >
                Unstake
              </button>
              <button
                onClick={emergencyUnstakeFunction}
                disabled={isStaking}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-md disabled:opacity-50"
              >
                Emergency Unstake
              </button>
              <button
                onClick={claimRewardsFunction}
                disabled={isStaking}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md disabled:opacity-50"
              >
                Claim Rewards
              </button>
              <button
                onClick={withdrawFunction}
                disabled={isStaking}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md disabled:opacity-50"
              >
                Withdraw After Cooldown
              </button>
            </div>

            {/* Admin Functions */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Admin Functions</h3>
              <input
                type="number"
                value={rewardRate}
                onChange={(e) => setRewardRate(e.target.value)}
                placeholder="Set Reward Rate"
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSetRewardRate(setRewardRateFunction)}
                className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Set Reward Rate
              </button>

              <input
                type="number"
                value={coolDownPeriod}
                onChange={(e) => setCoolDownPeriod(e.target.value)}
                placeholder="Set Cool-Down Period (in seconds)"
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSetCoolDownPeriod(setCoolDownPeriodFunction)}
                className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Set Cool-Down Period
              </button>

              <input
                type="number"
                value={""}
                onChange={(e) => (e.target.value)}
                placeholder="Set Emergency Unstake Fee (%)"
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSetEmergencyUnstakeFee(setEmergencyUnstakeFeeFunction)}
                className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Set Emergency Unstake Fee
              </button>

              <input
                type="text"
                value={daoPowerUser}
                onChange={(e) => setDaoPowerUser(e.target.value)}
                placeholder="User Address"
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={daoPowerAmount}
                onChange={(e) => setDaoPowerAmount(e.target.value)}
                placeholder="DAO Power Amount"
                className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAssignDaoPower(assignDaoPowerFunction)}
                className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Assign DAO Power
              </button>
            </div>
          </div>
        )
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default StakingInterface;