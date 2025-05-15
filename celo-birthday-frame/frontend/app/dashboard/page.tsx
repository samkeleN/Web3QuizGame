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
        if (data.rewards) {
          setMintedRewards(data.rewards);
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
  }, []);

  function truncateAddress(address: string) {
    if (!address) return "-";
    return address.slice(0, 6) + "..." + address.slice(-4);
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
                <th className="py-2 px-4">Recipient Address</th>
                <th className="py-2 px-4">Token ID</th>
                <th className="py-2 px-4">Token URI</th>
                <th className="py-2 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {mintedRewards.map((reward, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="py-2 px-4 font-mono text-green-300">
                    {truncateAddress(reward.address)}
                  </td>
                  <td className="py-2 px-4 font-mono text-yellow-300">
                    {reward.tokenId}
                  </td>
                  <td
                    className="py-2 px-4 break-all text-blue-300"
                    title={reward.tokenURI}
                  >
                    {reward.tokenURI && reward.tokenURI.length > 32
                      ? reward.tokenURI.slice(0, 16) +
                        "..." +
                        reward.tokenURI.slice(-8)
                      : reward.tokenURI || "-"}
                  </td>
                  <td className="py-2 px-4 font-mono text-pink-300">
                    {typeof reward.score === "number" && !isNaN(reward.score)
                      ? reward.score
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={() => (window.location.href = "/verify")}
        className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
      >
        Back to Verify
      </button>
    </div>
  );
}

export default DashboardPage;
