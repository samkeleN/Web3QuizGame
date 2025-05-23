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

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    if (isConnected) {
      checkIfUserRegistered();
    }
    // Simulate loading for a short period (or replace with real loading logic)
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isConnected, checkIfUserRegistered]);

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 flex flex-col items-center text-white">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#2D0C72] w-full rounded-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
            <span className="text-white text-xl font-semibold">Loading...</span>
          </div>
        ) : (
          !isConnected && (
            <div className="relative flex flex-col items-center mb-4 mx-8">
              <h1 className="text-black text-4xl font-bold leading-tight z-2 mt-8">
                🎉Ready to Play?🎉
              </h1>
              <h2 className="text-white text-2xl font-semibold mb-6 text-center">
                Let&apos;s make sure you&apos;re connected!
              </h2>
            </div>
          )
        )}

        {!isLoading && <ConnectButton />}

        {!isLoading && address && (
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  router.push("/quiz");
                }, 500);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                "Start Quiz Game"
              )}
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
