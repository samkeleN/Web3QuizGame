// Add a new page for the quiz game
// Add options to go to the homepage or replay the quiz game
// Highlight wrong answers in red and correct answers in green
// Add a timer for quiz difficulty

"use client";

import React, { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { QuizRewardAddress, QuizRewardABI } from "@/data/abi";
import { ethers } from "ethers";

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(14); // Default to easy difficulty
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintError, setMintError] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const { address: walletAddress, isConnected } = useAppKitAccount();

  const questions = [
    {
      questionText: "What is the capital of France?",
      answerOptions: [
        { answerText: "Berlin", isCorrect: false },
        { answerText: "Madrid", isCorrect: false },
        { answerText: "Paris", isCorrect: true },
        { answerText: "Lisbon", isCorrect: false },
      ],
    },
    {
      questionText: "Who is the CEO of Tesla?",
      answerOptions: [
        { answerText: "Jeff Bezos", isCorrect: false },
        { answerText: "Elon Musk", isCorrect: true },
        { answerText: "Bill Gates", isCorrect: false },
        { answerText: "Tony Stark", isCorrect: false },
      ],
    },
    {
      questionText: "What is the largest planet in our solar system?",
      answerOptions: [
        { answerText: "Earth", isCorrect: false },
        { answerText: "Jupiter", isCorrect: true },
        { answerText: "Mars", isCorrect: false },
        { answerText: "Saturn", isCorrect: false },
      ],
    },
    {
      questionText: "What is the chemical symbol for water?",
      answerOptions: [
        { answerText: "H2O", isCorrect: true },
        { answerText: "O2", isCorrect: false },
        { answerText: "CO2", isCorrect: false },
        { answerText: "NaCl", isCorrect: false },
      ],
    },
    {
      questionText:
        "Which programming language is primarily used for web development?",
      answerOptions: [
        { answerText: "Python", isCorrect: false },
        { answerText: "JavaScript", isCorrect: true },
        { answerText: "C++", isCorrect: false },
        { answerText: "Java", isCorrect: false },
      ],
    },
    {
      questionText: "What is the smallest unit of life?",
      answerOptions: [
        { answerText: "Atom", isCorrect: false },
        { answerText: "Molecule", isCorrect: false },
        { answerText: "Cell", isCorrect: true },
        { answerText: "Organ", isCorrect: false },
      ],
    },
    {
      questionText: "What is the speed of light?",
      answerOptions: [
        { answerText: "300,000 km/s", isCorrect: true },
        { answerText: "150,000 km/s", isCorrect: false },
        { answerText: "450,000 km/s", isCorrect: false },
        { answerText: "600,000 km/s", isCorrect: false },
      ],
    },
    {
      questionText: "Which country is known as the Land of the Rising Sun?",
      answerOptions: [
        { answerText: "China", isCorrect: false },
        { answerText: "Japan", isCorrect: true },
        { answerText: "South Korea", isCorrect: false },
        { answerText: "Thailand", isCorrect: false },
      ],
    },
    {
      questionText: "What is the main ingredient in guacamole?",
      answerOptions: [
        { answerText: "Tomato", isCorrect: false },
        { answerText: "Avocado", isCorrect: true },
        { answerText: "Onion", isCorrect: false },
        { answerText: "Lime", isCorrect: false },
      ],
    },
    {
      questionText: "What is the square root of 64?",
      answerOptions: [
        { answerText: "6", isCorrect: false },
        { answerText: "8", isCorrect: true },
        { answerText: "10", isCorrect: false },
        { answerText: "12", isCorrect: false },
      ],
    },
  ];

  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswerOptionClick(false, null); // Automatically move to the next question if time runs out
    }
  }, [timeLeft, showScore]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  const handleAnswerOptionClick = (
    isCorrect: boolean,
    selectedIndex: number | null
  ) => {
    setSelectedAnswer(selectedIndex);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setTimeLeft(
          difficulty === "hard" ? 3 : difficulty === "medium" ? 5 : 14
        ); // Reset timer based on difficulty
      } else {
        setShowScore(true);
        // Submit quiz results with correct score and answers
        fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId: "exampleQuizId",
            answers: questions.map((q, idx) => {
              const selected = idx === currentQuestion ? selectedIndex : null;
              return selected !== null
                ? q.answerOptions[selected].answerText
                : null;
            }),
            score: isCorrect ? score + 1 : score,
            userId: walletAddress, // Pass the wallet address as userId
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Quiz results submitted successfully:", data);
          })
          .catch((error) => {
            console.error("Error submitting quiz results:", error);
          });
      }
    }, 2000); // Delay to show correct/incorrect answers
  };

  const replayQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setTimeLeft(difficulty === "hard" ? 3 : difficulty === "medium" ? 5 : 14);
  };

  const handleDifficultyChange = (level: string) => {
    setDifficulty(level);
    setTimeLeft(level === "hard" ? 3 : level === "medium" ? 5 : 14);
  };

  // Replace the backend claimReward logic with frontend minting
  async function claimReward(tokenURI: string) {
    setMinting(true);
    setMintError("");
    setTransactionHash("");
    try {
      if (!(window as any).ethereum) {
        setMintError(
          "No wallet found. Please install MetaMask or Celo Extension Wallet."
        );
        setMinting(false);
        return;
      }
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        QuizRewardAddress,
        QuizRewardABI,
        signer
      );
      // Use the connected wallet address as recipient
      const recipient = await signer.getAddress();
      const tx = await contract.mintReward(recipient, tokenURI);
      setTransactionHash(tx.hash);
      await tx.wait();
      setMintSuccess(true);
    } catch (error: any) {
      setMintError(error?.message || "Failed to mint reward");
    } finally {
      setMinting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
        <span className="text-white text-xl font-semibold">Loading...</span>
      </div>
    );
  }
  if (minting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D0C72] w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6"></div>
        <span className="text-white text-xl font-semibold">
          Minting your reward...
        </span>
      </div>
    );
  }
  if (mintSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D0C72] w-full text-white">
        <h1 className="text-3xl font-bold mb-6">
          Reward claimed successfully!
        </h1>
        {transactionHash && (
          <button
            className="mb-4 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
            onClick={() =>
              window.open(
                `https://alfajores.celoscan.io/tx/${transactionHash}`,
                "_blank"
              )
            }
          >
            View Transaction on CeloScan
          </button>
        )}
        <button
          onClick={replayQuiz}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105 mr-4"
        >
          Replay Quiz
        </button>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }
  if (mintError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D0C72] w-full text-white">
        <h1 className="text-3xl font-bold mb-6">{mintError}</h1>
        <button
          onClick={replayQuiz}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105 mr-4"
        >
          Replay Quiz
        </button>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Remove the difficulty selection UI when the quiz has started
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-[#2D0C72] px-6 py-10 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-6">Select Difficulty to Start</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => handleDifficultyChange("easy")}
            className="py-2 px-4 rounded-lg text-white font-semibold transition-all shadow-md transform hover:scale-105 bg-green-500"
          >
            Easy (14s)
          </button>
          <button
            onClick={() => handleDifficultyChange("medium")}
            className="py-2 px-4 rounded-lg text-white font-semibold transition-all shadow-md transform hover:scale-105 bg-yellow-500"
          >
            Medium (5s)
          </button>
          <button
            onClick={() => handleDifficultyChange("hard")}
            className="py-2 px-4 rounded-lg text-white font-semibold transition-all shadow-md transform hover:scale-105 bg-red-500"
          >
            Hard (3s)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6">
        Selected Difficulty: {difficulty}
      </h1>
      {showScore ? (
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold">
            {score > 5 ? "🎉 Great Job! 🎉" : "😢 Better Luck Next Time! 😢"}
          </h1>
          <h2 className="text-xl mt-4">
            You scored {score} out of {questions.length}
          </h2>
          <div className="mt-6">
            <button
              onClick={replayQuiz}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105 mr-4"
            >
              Replay Quiz
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
            >
              Go to Homepage
            </button>
            {showScore && !mintSuccess && (
              <button
                className="mt-6 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
                onClick={() =>
                  claimReward(
                    "https://your-token-uri.com/" + walletAddress + "-" + score
                  )
                }
                disabled={minting}
              >
                {minting ? "Claiming..." : "Claim Reward"}
              </button>
            )}
            {mintSuccess && (
              <div className="mt-6 text-green-400">
                Reward claimed!
                <br />
                <a
                  href={`https://alfajores.celoscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-300"
                >
                  View Transaction
                </a>
              </div>
            )}
            {mintError && <div className="mt-4 text-red-400">{mintError}</div>}
          </div>
        </div>
      ) : (
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">
            {questions[currentQuestion].questionText}
          </h1>
          <div className="text-lg mb-4">Time Left: {timeLeft} seconds</div>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(option.isCorrect, index)}
                className={`py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105 ${
                  selectedAnswer === index
                    ? option.isCorrect
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
                disabled={selectedAnswer !== null} // Disable all buttons after one is selected
              >
                {option.answerText}
              </button>
            ))}
          </div>
          {selectedAnswer !== null &&
            !questions[currentQuestion].answerOptions[selectedAnswer]
              .isCorrect && (
              <div className="mt-4 text-green-500">
                Correct Answer:{" "}
                {questions[currentQuestion].answerOptions.find(
                  (option) => option.isCorrect
                )?.answerText ?? "No correct answer found"}
              </div>
            )}
        </div>
      )}
      {/* Function to handle claiming rewards */}
      <script>
        {`
          async function claimReward() {
            try {
              const response = await fetch('/api/reward', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  walletAddress: '${walletAddress}',
                  score: ${score},
                }),
              });

              const data = await response.json();
              if (data.success) {
                alert('Reward claimed successfully! Transaction Hash: ' + data.transactionHash);
              } else {
                alert('Failed to claim reward.');
              }
            } catch (error) {
              console.error('Error claiming reward:', error);
              alert('An error occurred while claiming the reward.');
            }
          }
        `}
      </script>
    </div>
  );
}

export default QuizPage;
