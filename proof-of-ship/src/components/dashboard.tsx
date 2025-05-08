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
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155]">
        <div className="flex flex-col items-center">
          <span className="loader mb-4" />
          <div className="text-white text-lg font-semibold animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    );
  }
  if (!address) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155]">
        <ConnectButton />
      </div>
    );
  }

  if (isVerificationLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155]">
        <div className="flex flex-col items-center">
          <span className="loader mb-4" />
          <div className="text-white text-lg font-semibold animate-pulse">
            Checking verification status...
          </div>
        </div>
      </div>
    );
  }

  const selfApp = new SelfAppBuilder({
    appName: "Proof of ship",
    scope: "proof-of-ship-scope",
    endpoint: `${window.location.origin}/api/verify`,
    userId: address,
    userIdType: "hex",
    endpointType: "https",
  }).build();
  console.log("selfApp", selfApp);
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
      className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#334155] flex items-center justify-center"
    >
      <div className="max-h-screen flex flex-col items-center justify-center p-4 w-full">
        <div className="w-full max-w-md mx-auto py-8 px-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 relative">
          <h1
            className={`text-3xl font-bold text-center text-white ${londrina.className}`}
          >
            PROOF OF SHIP
          </h1>
          <div>
            <div className="mb-8 flex flex-col justify-center items-center gap-4">
              {!isVerified && !isVerificationLoading && selfApp && (
                <div className="mt-6 flex flex-col items-center">
                  <h2 className="text-2xl font-bold mb-2 text-white drop-shadow">
                    Verify Your Identity
                  </h2>
                  <p className="mb-4 text-gray-200 text-center max-w-xs">
                    Scan the QR code with your Self app to verify your identity
                  </p>
                  <div className="p-3 rounded-2xl bg-white/20 border border-white/30 shadow-lg animate-pulse-slow">
                    <SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={async () => {
                        await fetch(`/api/builder-score/${address}`, {
                          method: "POST",
                        });
                        setIsVerified(true);
                        if (address) {
                          await refetchBuilderScore();
                        }
                      }}
                      size={300}
                    />
                  </div>
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
              <Leaderboard
                isVerified={isVerified}
                builderScore={builderScore || 0}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
