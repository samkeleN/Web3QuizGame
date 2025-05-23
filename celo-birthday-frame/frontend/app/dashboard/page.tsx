// Create a dashboard page to display previous games
"use client";

import React, { useEffect, useState } from "react";
import { QuizRewardAddress } from "@/data/abi";

function DashboardPage() {
  const [games, setGames] = useState<
    { score: number; date: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [mintedRewards, setMintedRewards] = useState<
    Array<{
      address: string;
      tokenId: string;
      tokenURI: string;
      score?: number;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null); // Add state for user address
  const [metadataMap, setMetadataMap] = useState<Record<string, any>>({});
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  // Try to detect wallet address from window.ethereum (MetaMask/Celo Extension Wallet)
  useEffect(() => {
    async function detectAddress() {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (err) {
          // Ignore errors
        }
      }
    }
    detectAddress();
  }, []);

  // Update the API call to fetch and display actual user quizzes
  useEffect(() => {
    // Fetch previous games from the API
    fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "getGames" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setGames(data.games || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    async function fetchMintedRewards() {
      setLoading(true);
      setError(null);
      try {
        // Use absolute path to avoid 404 in nested routes
        const res = await fetch("/api/minted-rewards");
        const data = await res.json();
        console.log("minted-rewards API data:", data); // DEBUG: log API response
        if (data.rewards) {
          // Only show tokens for the connected wallet address
          const filtered = address
            ? data.rewards.filter(
                (reward: any) =>
                  reward.address?.toLowerCase() === address.toLowerCase()
              )
            : [];
          setMintedRewards(filtered);
        } else {
          setMintedRewards([]);
        }
      } catch (err) {
        setError("Failed to fetch minted rewards");
        setMintedRewards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMintedRewards();
  }, [address]);

  // Fetch metadata for each minted reward
  useEffect(() => {
    async function fetchAllMetadata() {
      const newMetadataMap: Record<string, any> = {};
      const newImageMap: Record<string, string> = {};
      await Promise.all(
        mintedRewards.map(async (reward) => {
          if (reward.tokenURI && reward.tokenURI.startsWith("http")) {
            try {
              const res = await fetch(reward.tokenURI);
              if (res.ok) {
                const metadata = await res.json();
                newMetadataMap[reward.tokenId] = metadata;
                if (metadata.image)
                  newImageMap[reward.tokenId] = metadata.image;
              }
            } catch (e) {
              // Ignore fetch errors
            }
          }
        })
      );
      setMetadataMap(newMetadataMap);
      setImageMap(newImageMap);
    }
    if (mintedRewards.length > 0) fetchAllMetadata();
  }, [mintedRewards]);

  function truncateAddress(address: string) {
    if (!address) return "-";
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D0C72] w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
        <span className="text-white text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-6">Quiz Game Dashboard</h1>
      <div className="bg-gray-800 rounded-xl p-6 mb-8 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-2">
          QuizReward Contract Address
        </h2>
        <div className="break-all text-green-400 font-mono">
          {QuizRewardAddress}
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Minted Quiz Rewards</h2>
        {/* Filtered by Token Holder */}
        <div className="mb-2 flex items-center text-sm text-gray-300">
          <span className="font-semibold mr-2">Filtered by Token Holder:</span>
          {address ? (
            <span
              className="font-mono bg-gray-700 px-2 py-1 rounded text-green-300"
              title={address}
            >
              {truncateAddress(address)}
            </span>
          ) : (
            <span className="text-yellow-300">No wallet connected</span>
          )}
        </div>
        <div className="mb-4 text-xs text-gray-400">
          {address
            ? "Only tokens minted to your connected wallet are shown."
            : "Connect your wallet to view your minted rewards."}
        </div>
        {loading ? (
          <div>Loading minted rewards...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : mintedRewards.length === 0 ? (
          <div>No rewards minted yet.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Token ID</th>
                <th className="py-2 px-4">Score</th>
                <th className="py-2 px-4">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {mintedRewards.map((reward, idx) => {
                // Compose short URL for display: https://your-tok...6D16d-10
                let shortUrl = reward.tokenURI;
                if (reward.tokenURI && reward.tokenURI.startsWith("http")) {
                  try {
                    const url = new URL(reward.tokenURI);
                    // If Pinata gateway, show as your-token-uri.com/CID/tokenId.json
                    if (url.hostname.includes("pinata.cloud")) {
                      // Extract CID and filename
                      const pathParts = url.pathname.split("/").filter(Boolean);
                      // pathParts[0] = 'ipfs', pathParts[1] = CID, pathParts[2] = filename
                      if (pathParts.length >= 2) {
                        const cid = pathParts[1];
                        const file = pathParts.slice(2).join("/");
                        shortUrl = `your-token-uri.com/${cid}/${file}`;
                      }
                    } else {
                      // fallback: show host...last8
                      const host = url.hostname;
                      const path = url.pathname;
                      shortUrl = `https://${host.slice(0, 8)}...${host.slice(
                        -5
                      )}${path.slice(-8)}`;
                    }
                  } catch {}
                }
                return (
                  <tr key={idx} className="border-t border-gray-700">
                    <td className="py-2 px-4 font-mono text-yellow-300">
                      {reward.tokenId}
                    </td>
                    <td className="py-2 px-4 font-mono text-pink-300">
                      {typeof reward.score !== "undefined"
                        ? reward.score !== null && !isNaN(Number(reward.score))
                          ? reward.score
                          : "-"
                        : metadataMap[reward.tokenId]?.attributes?.find(
                            (a: any) => a.trait_type === "Score"
                          )?.value || "-"}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-1 px-3 rounded transition-all shadow-md"
                        onClick={() =>
                          window.open(
                            `https://alfajores.celoscan.io/token/${QuizRewardAddress}?a=${reward.tokenId}`,
                            "_blank"
                          )
                        }
                      >
                        View Tx
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            window.location.href = "/verify";
          }, 500); // short delay for loading effect
        }}
        className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
      >
        {loading ? "Loading..." : "Back"}
      </button>
    </div>
  );
}

export default DashboardPage;
