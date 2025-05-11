"use client";

import React from "react";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start mt-4">
        {/* Header Balloon Illustration */}
        <div className="relative flex flex-col items-center mb-4 mx-8">
          {/* Main Headline */}
          <h1 className="text-[#FFF8C9] text-5xl font-bold leading-tight max-w-min z-2">
            Welcome to Quiz Game
          </h1>

          <p className="text-lg mb-4">Test your knowledge and have fun!</p>
        </div>

        {/* CTA Card */}
        <div className="bg-[#FFF8C9] rounded-2xl px-5 py-6 w-full max-w-md shadow-lg text-left space-y-4 ">
          <div className="grid grid-cols-3 gap-4 items-center mb-4">
            <div className="col-span-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-gray-800 leading-tight">
                🎉 Ready to test your <br />
                knowledge and <br />
                have fun? 🎉
              </h2>

              <p className="text-xs sm:text-sm md:text-base mt-2 md:mt-4 text-gray-600 max-w-[200px] sm:max-w-none">
                🌟 Start the quiz and challenge yourself to see how much you
                know! 🌟
              </p>
            </div>

            {/* Quiz Illustration */}
            <div className="col-span-1">
              <img
                src="/quiz.png"
                alt="Quiz illustration"
                className="w-full h-auto object-contain scale-150 transform"
              />
            </div>
          </div>

          {/* Start Quiz Button */}
          <button
            onClick={() => router.push("/verify")}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all shadow-md transform hover:scale-105"
          >
            🚀 Start the Quiz 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
