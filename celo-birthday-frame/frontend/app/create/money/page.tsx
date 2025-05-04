'use client'

import React, { useState } from "react";
import Tokens from "@/components/money/tokens";
import ConfirmationPage from "@/components/donations/Confirmation";
import { useAccount } from "wagmi"
import { Token } from "@/data/token";
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function MoneyPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [token, setToken] = useState<Token | null>(null);
  const [steps, setSteps] = useState(0);

  const handleSteps = () => {
    if (steps == 0) {
      router.push('/create')
    }
    if (steps == 1) {
      setSteps(0)
    }
  }
  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10  overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4 h-screen">

        {/* Back Button */}
        <div className="w-full max-w-sm flex items-start">
          <button className="text-yellow-400 hover:text-yellow-300 text-2xl" onClick={handleSteps}>
            <ArrowLeft />
          </button>
        </div>

        {steps == 0 && <Tokens setTokenFn={setToken} setStepsFn={setSteps} />}

        {steps == 1 && token && <ConfirmationPage
          type="money"
          celebrant="Sarah"
          token={token}
          address={address}
        />}
      </div>

    </div>
  );
}
