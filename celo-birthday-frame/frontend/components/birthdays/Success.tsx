import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function DonationSuccessPage() {
  const celebrant = "Sarah";

  return (
    <div className="min-h-screen bg-[#2D0C72] px-4 py-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Confetti */}
      <svg className="absolute top-6 left-6 w-2 h-2 text-yellow-300" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>
      <svg className="absolute top-8 right-6 w-2 h-2 text-purple-400" viewBox="0 0 10 10"><rect width="10" height="2" fill="currentColor" transform="rotate(45)" /></svg>
      <svg className="absolute bottom-6 left-8 w-2 h-2 text-teal-400" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>
      <svg className="absolute bottom-10 right-6 w-2 h-2 text-yellow-400" viewBox="0 0 10 10"><rect width="10" height="2" fill="currentColor" transform="rotate(-45)" /></svg>

      {/* Success Icon */}
      <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-[#FFF8C9]" />
      </div>

      {/* Success Text */}
      <h1 className="text-[#FFF8C9] text-3xl font-bold mb-3">Donation successful!</h1>
      <p className="text-[#FFF8C9] text-lg max-w-xs">
        You helped {celebrant} celebrate their birthday.
      </p>
    </div>
  );
}
