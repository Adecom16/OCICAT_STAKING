"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CustomBotton } from "./CustomButton";
import { useLiquidityBalance, useTokenBalance } from "@/web3/useStaking";
import { useApprovalContract } from "@/web3/useApproval";
import { CONSTANTS } from "@/web3/config/constants";
import tokenabi from "@/web3/config/token_abi.json";
import { convertFromFloat } from "@/lib/utils";

// token contract addresses and abis
const TOKEN_ABI = tokenabi;
const OCICAT_TOKEN_ADDRESS = CONSTANTS.OCICAT_TOKEN_ADDRESS as `0x${string}`;
const OCICAT_SPENDER =
  CONSTANTS.OCICAT_STAKING_CONTRACT_ADDRESS as `0x${string}`;
const BNBLIQ_SPENDER = CONSTANTS.LIQUIDITY_STAKING_ADDRESS as `0x${string}`;
import STAKING_CONTRACT_ABI from "@/web3/config/abi.json";
import STAKING_LIQ_CONTRACT_ABI from "@/web3/config/liquidityabi.json";



// component switches between different contexts, stake, unstake and claim
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

// this component reads the cointype and displays content that allwos users to stake. unstake, read their current balance etc.
const StakingContent = ({
  coinType,
}: // balance,
{
  coinType: string;
  // balance: string | number;
}) => {
  const [stakeAction, setStakeAction] = useState("Stake");
  const { isConnected, address } = useAccount();
  const tokenBalance = useTokenBalance(address!);
  const liquidityBalance = useLiquidityBalance(address!);
  const [number, setNumber] = useState("");
  const { writeContract } = useWriteContract();

  //read amount staked of wallet (OCICAT)
  const { data: stakeAmount } = useReadContract({
    address: OCICAT_SPENDER,
    abi: STAKING_CONTRACT_ABI,
    functionName: "getStakeInfo",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  //read amount staked of wallet (OCICAT/BNB)
  const { data: liqStakeAmount } = useReadContract({
    address: BNBLIQ_SPENDER,
    abi: STAKING_LIQ_CONTRACT_ABI,
    functionName: "getStakeInfo",
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  console.log(stakeAmount);
  console.log("Liquidity stake amount:", liqStakeAmount);

  const [loading, setLoading] = useState(false);

  //REad allowance of wallet conidtion to read based on what coin is active
  const { allowance, max_allowance, writeApprovalContract } =
    useApprovalContract(address!, (coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER));

  //handle change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Text switch component */}
      <TextSwitch
        options={["Stake", "Unstake", "Claim"]}
        active={stakeAction}
        onChange={setStakeAction}
      />

      
      {stakeAction === "Claim" && (
        // if stake action is currently claim
        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg">Your Rewards:</span>
          <span className="text-2xl font-bold">
            {stakeAmount ? stakeAmount.toString() : "0"} {coinType}
          </span>
          <Button
            className="w-full bg-red-700 hover:bg-red-800"
            size="lg"
            onClick={async () => {
              setLoading(true);
              writeContract(
                {
                  address: OCICAT_SPENDER,
                  abi: STAKING_CONTRACT_ABI,
                  functionName: "claimRewards",
                },
                {
                  onSuccess(data) {
                    console.log(data);
                    setLoading(false);
                  },
                }
              );
            }}
          >
            {loading ? "Claiming..." : "Claim Rewards"}
          </Button>
        </div>
      )}
      <>
    {/* regular component with stake, unstake */}
        <div className="flex items-center justify-between">
          <span>
            {stakeAction === "Stake"
              ? "Available to stake:"
              : "Staked balance:"}
          </span>
          <div className="flex items-center gap-2">
            {/* read cointype and display */}
            <span>
            {coinType === 'OCICAT' ? tokenBalance : liquidityBalance} {coinType}
            </span>
            {/* button to stake max available token */}
            {stakeAction === "Unstake" && (
              <Button disabled={!isConnected} variant="destructive" size="sm">
                Max
              </Button>
            )}
          </div>
        </div>
        {/* input field */}
        <input
          type="number"
          placeholder="0.00"
          value={number}
          className="bg-white text-black text-xl h-10 overflow-hidden w-full rounded-md px-2"
          onChange={handleChange}
          // onFocus={(e) => e.target.select()

          // }
        ></input>
      </>
      {/* if wallet is connected, check for allowance, else show connnect button. If there is allowance show stake/unstake button. If none, show allowance button */}
      {isConnected ? (
        <>
          {(!isNaN(allowance) && allowance !== 0) ? (
            // stake/unstake button
            <Button
              className={`w-full bg-red-700 ${
                stakeAction === "Stake"
                  ? " hover:bg-red-700"
                  : " hover:bg-red-700"
              }`}
              size="lg"
              onClick={async () => {
                if(Number(number) < 10) return;
                setLoading(true);
                if (stakeAction === "Stake") {
                  writeContract(
                    {
                      address: coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER,
                      abi: coinType === 'OCICAT' ? STAKING_CONTRACT_ABI : STAKING_LIQ_CONTRACT_ABI,
                      functionName: "stake",
                      args: [convertFromFloat(Number(number), 6)], // Replace with user input
                    },
                    {
                      onSuccess(data) {
                        console.log(data);
                        setLoading(false);
                      },
                    }
                  );
                } else {
                  writeContract({
                    address: coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER,
                    abi: coinType === 'OCICAT' ? STAKING_CONTRACT_ABI : STAKING_LIQ_CONTRACT_ABI,
                    functionName: "initiateUnstake",
                  });
                }
              }}
            >
              {loading ? "Staking...." : stakeAction}
            </Button>
          ) : (
            // getting allowance button
            <Button
              className={`w-full bg-red-700 ${
                stakeAction === "Stake"
                  ? " hover:bg-red-700"
                  : " hover:bg-red-700"
              }`}
              size="lg"
              onClick={async () => {
                //hello
                await writeApprovalContract({
                  abi: TOKEN_ABI,
                  address: OCICAT_TOKEN_ADDRESS,
                  functionName: "approve",
                  args: [(coinType === 'OCICAT' ? OCICAT_SPENDER : BNBLIQ_SPENDER), max_allowance],
                });
              }}
            >
              Approve
            </Button>
          )}
          {stakeAction === "Unstake" && (
            <div className="text-center text-sm text-gray-400">
              No unstaking in progress
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("coinA");

  // console.log(stakeAmount as string);
  // console.log(tokenBalance);

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
