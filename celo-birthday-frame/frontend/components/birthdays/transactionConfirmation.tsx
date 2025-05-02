import React from "react";
import { Loader2 } from "lucide-react";

export default function TransactionConfirmationPage() {
  const celebrant = "Sarah";
  const amount = "50";
  const currency = "USD";
  const message = "Happy Birthday 🎉";

  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 text-center flex flex-col items-center justify-center relative">
      {/* Confetti Sprinkles */}
      <svg className="absolute top-6 left-6 w-2 h-2 text-yellow-300" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>
      <svg className="absolute top-10 right-6 w-2 h-2 text-purple-400" viewBox="0 0 10 10"><rect width="10" height="2" fill="currentColor" transform="rotate(45)" /></svg>
      <svg className="absolute bottom-6 left-6 w-2 h-2 text-teal-400" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>

      {/* Heading */}
      <h1 className="text-[#FFF8C9] text-3xl font-bold mb-2">
        Confirm your gift 🎁
      </h1>
      <p className="text-[#FFF8C9] text-base mb-6">
        You’re about to send {amount} {currency} to celebrate {celebrant}’s birthday.
      </p>

      {/* Transaction Summary Card */}
      <div className="bg-[#FFF8C9] w-full max-w-md rounded-2xl px-6 py-6 text-left space-y-4 shadow-lg">
        <div>
          <p className="text-[#2D0C72] font-semibold">Recipient:</p>
          <p className="text-[#2D0C72] text-sm">{celebrant}</p>
        </div>
        <div>
          <p className="text-[#2D0C72] font-semibold">Amount:</p>
          <p className="text-[#2D0C72] text-sm">
            {amount} {currency}
          </p>
        </div>
        <div>
          <p className="text-[#2D0C72] font-semibold">Message:</p>
          <p className="text-[#2D0C72] text-sm">{message || "No message"}</p>
        </div>

        <div className="w-full pt-4">
          <button
            className="w-full bg-[#066D6D] hover:bg-[#055a5a] text-[#FFF8C9] font-bold py-3 rounded-xl text-lg transition-all flex items-center justify-center gap-2"
          >
            <Loader2 className="animate-spin w-5 h-5" />
            Confirm & Send
          </button>
        </div>
      </div>

      <p className="text-[#FFF8C9] text-sm mt-6 max-w-xs">
        This transaction is final and will be processed via wallet.
      </p>
    </div>
  );
}
