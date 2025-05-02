'use client';

import React from 'react';
import QrWrapper from '@/components/wrappers/QrWrapper';
import {
  useAppKitAccount,
} from '@reown/appkit/react'
import { ConnectButton } from "@/components/buttons/ConnectButton";

function VerifyPage() {
  const { address, embeddedWalletInfo } = useAppKitAccount();

  console.log(embeddedWalletInfo);

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">

        <div className="relative  flex flex-col items-center mb-4 mx-8">

          <h1 className="text-[#FFF8C9] text-4xl font-bold leading-tight z-2 mt-8">
            🎉 So It&apos;s your birthday?
          </h1>

          <h2 className="text-[#FFF8C9] text-4xl font-semibold mb-6 text-center ">
            Let&apos;s verify
          </h2>
        </div>

        <ConnectButton />

        {address && <QrWrapper address={address} />}
      </div>
    </div >
  );
}

export default VerifyPage;
