"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAccount } from "wagmi";
import { CustomBotton } from "./CustomButton";
import { useTokenBalance } from "../web3/useTokenBalance";
import { useLiquidityTokenBalance } from "../web3/useLiquidityTokenBalance";
import { useApprovalContract } from "@/web3/useApproval";
import { CONSTANTS } from "@/web3/config/constants";
import tokenabi from "@/web3/config/token_abi.json";
import { convertFromFloat } from "@/lib/utils";
import { useLiquidityStaking } from "../web3/useLiquidityStaking";
import { useOcicatStaking } from "../web3/useOcicatStaking";

// token contract addresses and abis
const TOKEN_ABI = tokenabi;
const OCICAT_TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const OCICAT_SPENDER = CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const BNBLIQ_SPENDER = CONSTANTS.LIQUIDITY_STAKING_ADDRESS as `0x${string}`;

const TextSwitch = ({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (option: string) => void;
}) => (
  <div className="flex space-x-4 mb-4">
    {options.map((option) => (
      <button
        key={option}
        className={`text-sm font-medium ${
          active === option
            ? "text-red-500 border-b-2 border-red-500"
            : "text-gray-400 hover:text-gray-300"
        }`}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
);

const StakingContent = ({
  coinType,
}: {
  coinType: string;
}) => {
  const [stakeAction, setStakeAction] = useState("Stake");
  const { isConnected, address } = useAccount();
  const tokenBalance = useTokenBalance(address!);
  const liquidityBalance = useLiquidityTokenBalance(address!);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const { stakeAmount, stake, unstake, claimRewards, coolDownPeriod } = useOcicatStaking();
  const { stakeAmountQuery, stake: stakeLiquidity, unstake: unstakeLiquidity, claimRewards: claimRewardsLiquidity, coolDownPeriod: coolDownPeriodLiquidity } = useLiquidityStaking();

  const { allowance, max_allowance, writeApprovalContract } =
    useApprovalContract(address!, (coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };

  const handleStake = async () => {
    if (Number(number) < 10) return;
    setLoading(true);
    try {
      if (coinType === 'OCICAT') {
        // No x6 multiplier for OCICAT staking
        await stake(Number(number));
      } else {
        // Apply x6 multiplier for liquidity staking
        await stakeLiquidity(convertFromFloat(Number(number), 6));
      }
    } catch (error) {
      console.error("Staking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (Number(number) <= 0) return;
    setLoading(true);
    try {
      if (coinType === 'OCICAT') {
        // No x6 multiplier for OCICAT unstaking
        await unstake(Number(number));
      } else {
        // Apply x6 multiplier for liquidity unstaking
        await unstakeLiquidity(convertFromFloat(Number(number), 6));
        // Set cooldown for liquidity staking
        const cooldownPeriod = await coolDownPeriodLiquidity();
        setCooldownEndTime(Date.now() + cooldownPeriod * 1000);
      }
    } catch (error) {
      console.error("Unstaking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    setLoading(true);
    try {
      if (coinType === 'OCICAT') {
        await claimRewards();
      } else {
        await claimRewardsLiquidity();
      }
    } catch (error) {
      console.error("Claiming rewards failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaxClick = () => {
    if (coinType === 'OCICAT') {
      setNumber(stakeAmount?.toString() || "0");
    } else {
      setNumber(stakeAmountQuery.data?.toString() || "0");
    }
  };

  useEffect(() => {
    if (cooldownEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = cooldownEndTime - now;
        if (remaining <= 0) {
          setCooldownEndTime(null);
          setRemainingTime(null);
          clearInterval(interval);
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownEndTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-4">
      <TextSwitch
        options={["Stake", "Unstake", "Claim"]}
        active={stakeAction}
        onChange={setStakeAction}
      />

      {stakeAction === "Claim" && (
        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg">Your Rewards:</span>
          <span className="text-2xl font-bold">
            {coinType === 'OCICAT' ? stakeAmount : stakeAmountQuery.data} {coinType}
          </span>
          <Button
            className="w-full bg-red-700 hover:bg-red-800"
            size="lg"
            onClick={handleClaimRewards}
          >
            {loading ? "Claiming..." : "Claim Rewards"}
          </Button>
        </div>
      )}

      {stakeAction !== "Claim" && (
        <>
          <div className="flex items-center justify-between">
            <span>
              {stakeAction === "Stake"
                ? "Available to stake:"
                : "Staked balance:"}
            </span>
            <div className="flex items-center gap-2">
              <span>
                {coinType === 'OCICAT' ? tokenBalance : liquidityBalance} {coinType}
              </span>
              {stakeAction === "Unstake" && (
                <Button disabled={!isConnected} variant="destructive" size="sm" onClick={handleMaxClick}>
                  Max
                </Button>
              )}
            </div>
          </div>

          <input
            type="number"
            placeholder="0.00"
            value={number}
            className="bg-white text-black text-xl h-10 overflow-hidden w-full rounded-md px-2"
            onChange={handleChange}
          />
        </>
      )}

      {isConnected ? (
        <>
          {(!isNaN(allowance) && allowance !== 0) ? (
            <Button
              className={`w-full bg-red-700 ${
                stakeAction === "Stake"
                  ? " hover:bg-red-700"
                  : " hover:bg-red-700"
              }`}
              size="lg"
              onClick={stakeAction === "Stake" ? handleStake : handleUnstake}
              disabled={loading}
            >
              {loading ? "Processing..." : stakeAction}
            </Button>
          ) : (
            <Button
              className={`w-full bg-red-700 ${
                stakeAction === "Stake"
                  ? " hover:bg-red-700"
                  : " hover:bg-red-700"
              }`}
              size="lg"
              onClick={async () => {
                await writeApprovalContract({
                  abi: TOKEN_ABI,
                  address: OCICAT_TOKEN_ADDRESS,
                  functionName: "approve",
                  args: [(coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER), max_allowance],
                });
              }}
              disabled={loading}
            >
              Approve
            </Button>
          )}
          {stakeAction === "Unstake" && (
            <div className="text-center text-sm text-gray-400">
              {remainingTime !== null ? `Cooldown: ${formatTime(remainingTime)}` : "No unstaking in progress"}
            </div>
          )}
        </>
      ) : (
        <CustomBotton className="w-full" />
      )}
    </div>
  );
};

const Voting = () => {
  const [activeTab, setActiveTab] = useState("coinA");

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#0a0b14] text-white">
      <CardHeader>
        <Tabs
          defaultValue="coinA"
          className="w-full "
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md transition"
              value="coinA"
            >
              Stake Ocicat
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md transition"
              value="coinB"
            >
              Stake Ocicat/BNB
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coinA" className="mt-4">
            <StakingContent coinType="OCICAT" />
          </TabsContent>

          <TabsContent value="coinB" className="mt-4">
            <StakingContent coinType="OCICAT/BNB" />
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default Voting;