/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { createStore } from "mipd";
import { useAccount } from "wagmi";
import SelfQRcodeWrapper, { SelfAppBuilder } from "@selfxyz/qrcode";
import Leaderboard from "./leaderboard";
import UserScore from "./user-score";
import Countdown from "./countdown";
import { useVerification } from "~/hooks/useVerification";
import { useBuilderScore } from "~/hooks/useBuilderScore";
import { Londrina_Solid } from "next/font/google";

const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Dashboard() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const {
    isVerified,
    setIsVerified,
    isLoading: isVerificationLoading,
  } = useVerification();
  const { address } = useAccount();
  const {
    builderScore,
    rank,
    mutate: refetchBuilderScore,
    isLoadingScore,
  } = useBuilderScore(isVerified);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
      });
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (isVerified) {
      refetchBuilderScore();
    }
  }, [isVerified, refetchBuilderScore]);

  if (!isSDKLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ConnectButton />
      </div>
    );
  }

  if (isVerificationLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-white">Checking verification status...</div>
      </div>
    );
  }

  const selfApp = new SelfAppBuilder({
    appName: "Proof of ship",
    scope: "proof-of-ship-scope",
    endpoint: `${process.env.NEXT_PUBLIC_URL}api/verify`,
    userId: address,
    userIdType: "hex",
    endpointType: "https",
  }).build();
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="max-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto py-6 px-4 bg-card rounded-xl shadow-sm">
          <h1
            className={`text-3xl font-bold text-center text-white ${londrina.className}`}
          >
            PROOF OF SHIP
          </h1>
          <div>
            <div className="mb-6 flex flex-col justify-center items-center gap-4">
              {!isVerified && !isVerificationLoading && selfApp && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    Verify Your Identity
                  </h2>
                  <p className="mb-4 text-gray-300">
                    Scan the QR code with your Self app to verify your identity
                  </p>
                  <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={async () => {
                      setIsVerified(true);
                      await fetch(`/api/builder-score/${address}`, {
                        method: "POST",
                      });
                      if (address) {
                        await refetchBuilderScore();
                      }
                    }}
                    size={300}
                  />
                </div>
              )}
            </div>
          </div>
          {isVerified && (
            <>
              {builderScore && builderScore < 40 ? (
                <UserScore
                  rank={0}
                  score={builderScore || 0}
                  isLoading={isLoadingScore}
                />
              ) : (
                <UserScore
                  rank={rank || 0}
                  score={builderScore || 0}
                  isLoading={isLoadingScore}
                />
              )}
              <div className="flex justify-end items-center mb-4">
                <Countdown />
              </div>
              <Leaderboard />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
