// Create a dashboard page to display previous games
"use client";

import React, { useEffect, useState } from "react";

function DashboardPage() {
  const [games, setGames] = useState<
    { score: number; date: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6">Your Previous Games</h1>
      {loading ? (
        <p>Loading...</p>
      ) : games.length > 0 ? (
        <ul className="w-full max-w-2xl space-y-4">
          {games.map((game, index) => (
            <li
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span>Game {index + 1}</span>
                <span>Score: {game.score}</span>
              </div>
              <div className="text-sm text-gray-400">
                Played on: {game.date} at {game.time}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No games found. Start playing to see your results here!</p>
      )}
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
