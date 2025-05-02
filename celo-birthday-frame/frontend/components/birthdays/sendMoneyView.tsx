import React, { useState } from "react";

export default function SendMoneyView() {
  const [amount, setAmount] = useState("50");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-[#2D0C72] px-4 py-10 text-center flex flex-col items-center overflow-hidden">
      {/* Confetti */}
      <svg className="absolute top-6 left-6 w-2 h-2 text-yellow-300" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>
      <svg className="absolute top-8 right-8 w-2 h-2 text-teal-300" viewBox="0 0 10 10"><rect width="10" height="2" fill="currentColor" transform="rotate(45)" /></svg>
      <svg className="absolute bottom-6 left-10 w-2 h-2 text-purple-400" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>

      {/* Headline */}
      <h1 className="text-[#FFF8C9] text-3xl sm:text-4xl font-bold mb-6">
        Celebrate Sarah’s Birthday!
      </h1>

      {/* Card */}
      <div className="bg-[#FFF8C9] rounded-2xl px-5 py-6 w-full max-w-md shadow-lg text-left space-y-4">
        {/* Birthday Icon */}
        <div className="text-center">
          <span className="text-5xl">🎂</span>
        </div>

        {/* Heading and Subtext */}
        <h2 className="text-center text-[#2D0C72] text-lg font-bold">It’s Sarah’s Birthday!</h2>
        <div className="bg-white rounded-xl px-4 py-2 text-sm text-[#2D0C72] text-center">
          Hey! I’m raising funds this birthday <span className="text-purple-600">♥</span>
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-2">
          <label className="font-semibold text-[#2D0C72]">Amount:</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-[#2D0C72] rounded-xl text-[#2D0C72] text-lg font-semibold outline-none"
          />
          <span className="text-[#2D0C72] font-semibold">USD</span>
        </div>

        {/* Wallet Button */}
        <button className="w-full bg-[#066D6D] hover:bg-[#055a5a] text-[#FFF8C9] font-bold text-lg py-3 rounded-xl transition-all">
          Send with Wallet
        </button>

        {/* Optional Message */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
          className="w-full px-4 py-3 rounded-xl border border-[#D8D8D8] text-[#2D0C72] outline-none text-sm"
        />

        {/* Footer */}
        <p className="flex items-center gap-2 text-sm text-[#2D0C72] mt-1">
          <span className="text-teal-600">✔</span> Verified Birthday with Self Protocol
        </p>
      </div>
    </div>
  );
}
