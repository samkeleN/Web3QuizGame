'use client'
import React, { useState } from "react";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { useCallback, useEffect } from "react";
import { useReadContract } from "wagmi";
import { BirthdayRecord } from "@/data/types";
import BirthdayDonationView from "./sendDonationView";
import SendMoneyView from "./sendMoneyView";
import DonationSuccessPage from "./Success";

export default function BirthdayPage({ address }: { address: string }) {
  const [birthDayRecord, setBirthdayRecord] = useState<BirthdayRecord | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const readContract = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "isCelebrantRegistered",
    args: [address],
    query: {
      enabled: false,
    },
  })

  const checkIfUserRegistered = useCallback(async () => {
    const { data } = await readContract.refetch();
    console.log("data: ", data);
  }, [readContract]);

  useEffect(() => {
    checkIfUserRegistered()
  }, [checkIfUserRegistered])


  const readContract2 = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "getBirthdayRecord",
    args: [address],
    query: {
      enabled: false,
    },
  })

  const getBirthdayRecord = useCallback(async () => {
    const { data } = await readContract2.refetch();
    console.log(data as unknown as BirthdayRecord)
    setBirthdayRecord(data as unknown as BirthdayRecord);
  }, [readContract2]);

  useEffect(() => {
    if (!birthDayRecord) {
      getBirthdayRecord()
    }

  }, [birthDayRecord, getBirthdayRecord])

  if (!birthDayRecord) {
    return (
      <p className="text-[#FFF8C9] text-2xl font-bold mt-4">
        Loading birthday record...
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start mt-4">

      {transactionSuccess ?

        <>
          {birthDayRecord.route == 2 && birthDayRecord.donationProjectid && birthDayRecord.donationProjectUrl &&
            <BirthdayDonationView celebrantAddress={address} projectId={Number(birthDayRecord.donationProjectid)} projectUrl={birthDayRecord.donationProjectUrl} setStatusFn={setTransactionSuccess} />
          }

          {birthDayRecord.route == 1 && birthDayRecord.token &&
            <SendMoneyView celebrantAddress={address} token={birthDayRecord.token} setStatusFn={setTransactionSuccess} />
          }

        </>
        :
        <>
          <DonationSuccessPage />
        </>
      }

    </div>
  )
}
