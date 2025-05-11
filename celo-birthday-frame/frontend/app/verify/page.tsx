"use client";

import React, { useEffect, useCallback } from "react";
import QrWrapper from "@/components/wrappers/QrWrapper";
import { useAppKitAccount } from "@reown/appkit/react";
import { ConnectButton } from "@/components/buttons/ConnectButton";

import { useReadContract } from "wagmi";
import { ContractAbi, ContractAddress } from "@/data/abi";

import { BirthdayRecord } from "@/data/types";
import { useRouter } from "next/navigation";

function VerifyPage() {
  const router = useRouter();

  const { address, isConnected } = useAppKitAccount();

  const readContract = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "isCelebrantRegistered",
    args: [address],
    query: {
      enabled: false,
    },
  });

  const readBirthdayRecord = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "getBirthdayRecord",
    args: [address],
    query: {
      enabled: false,
    },
  });

  const getBirthdayRecord = useCallback(async () => {
    const { data } = await readBirthdayRecord.refetch();
    const record = data as unknown as BirthdayRecord;
    return record;
  }, [readBirthdayRecord]);

  const checkIfUserRegistered = useCallback(async () => {
    const { data } = await readContract.refetch();
    if (data) {
      const record = await getBirthdayRecord();
      if (record.route == 0) {
        router.push("/create");
      } else {
        router.push(`/birthday/${address}`);
      }
    }
  }, [address, getBirthdayRecord, readContract, router]);

  useEffect(() => {
    if (isConnected) {
      checkIfUserRegistered();
    }
  }, [isConnected, checkIfUserRegistered]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">
        {!address && (
          <div className="relative flex flex-col items-center mb-4 mx-8">
            <h1 className="text-gray-800 text-4xl font-bold leading-tight z-2 mt-8">
              🎉 Ready to verify?
            </h1>

            <h2 className="text-gray-600 text-2xl font-semibold mb-6 text-center">
              Let&apos;s make sure you&apos;re all set for the quiz game!
            </h2>
          </div>
        )}

        <ConnectButton />

        {address && (
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button
              onClick={() => router.push("/quiz")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
            >
              Start Quiz Game
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
