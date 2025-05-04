import { Address } from "viem";
import { ContractAddress, ContractAbi } from "@/data/abi";
import { getTokenByAddress } from "@/data/token";
import React, { useCallback, useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { TokenIcon } from "../tokens/TokenIcon";
import { useAppKitAccount } from "@reown/appkit/react";
import { ConnectButton } from "../buttons/ConnectButton";
import { TransactionLoader } from "../loader";

export default function SendMoneyView({ celebrantAddress, token, setStatusFn }:
  {
    celebrantAddress: string,
    token: string, setStatusFn:
    React.Dispatch<React.SetStateAction<boolean>>
  }) {

  const [amount, setAmount] = useState(50);
  const [celebrantName, setCelebrantName] = useState("");
  const [txHash, setTxhash] = useState<Address | "">("");

  const { isConnected } = useAppKitAccount();

  const readCelebrantName = useReadContract({
    address: ContractAddress,
    abi: ContractAbi,
    functionName: "getName",
    args: [celebrantAddress],
    query: {
      enabled: false,
    },
  })

  const getCelebrantName = useCallback(async () => {
    const { data } = await readCelebrantName.refetch();
    console.log("data: ", data);
    setCelebrantName("celebrant")
  }, [readCelebrantName]);

  useEffect(() => {

    if (!celebrantName) {
      getCelebrantName()
    }

  }, [celebrantName, getCelebrantName])

  const tokenInfo = getTokenByAddress(token as Address);

  const { writeContract, isSuccess, data } = useWriteContract();

  const handleSuccess = () => {
    setStatusFn(true)
  }


  const handleSendGift = () => {

    if (amount < 0) {
      return
    }

    writeContract({
      address: ContractAddress,
      abi: ContractAbi,
      functionName: "sendBirthdayGift",
      args: [
        celebrantAddress,
        amount
      ],
    });
  };

  useEffect(() => {
    if (isConnected && isSuccess) {

      setTxhash(data);
    }
  }, [isSuccess, isConnected, data])

  return (
    <div className="w-full flex flex-col items-center justify-start">

      {/* Headline */}
      <h1 className="text-[#FFF8C9] text-3xl sm:text-4xl font-bold mb-6">
        Celebrate {celebrantName ? celebrantName : ""}’s Birthday!
      </h1>

      {/* Card */}
      <div className="bg-[#FFF8C9] rounded-2xl px-5 py-6 w-full max-w-md shadow-lg text-left space-y-4">
        {/* Birthday Icon */}
        <div className="text-center">
          <span className="text-5xl">🎂</span>
        </div>

        {/* Heading and Subtext */}
        <h2 className="text-center text-[#2D0C72] text-lg font-bold">It’s  {celebrantName ? celebrantName : ""}’s Birthday!</h2>
        <div className="bg-white rounded-xl px-4 py-2 text-sm text-[#2D0C72] text-center">
          Hey! I’m raising funds this birthday <span className="text-purple-600">♥</span>
        </div>

        <TokenIcon token={tokenInfo} />

        {/* Amount Input */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-[#2D0C72]">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
            className="flex-1 px-3 py-2 border-2 border-[#2D0C72] rounded-xl text-[#2D0C72] text-lg font-semibold outline-none"
          />
          <span className="text-[#2D0C72] font-semibold">USD</span>
        </div>

        {/* Wallet Button */}
        {!isConnected ? (
          <ConnectButton />
        ) : (
          txHash ? (
            <TransactionLoader txHash={txHash} handleSuccess={handleSuccess} />
          ) : (
            <button
              onClick={() => handleSendGift()}
              className="w-full bg-[#066D6D] hover:bg-[#055a5a] text-[#FFF8C9] font-bold text-lg py-3 rounded-xl transition-all"
            >
              Send with Wallet
            </button>
          )
        )}

        {/* Footer */}
        <p className="flex items-center gap-2 text-sm text-[#2D0C72] mt-1">
          <span className="text-teal-600">✔</span> Verified Birthday with Self Protocol
        </p>
      </div>
    </div>
  );
}
