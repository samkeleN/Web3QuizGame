import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function DonationSuccessPage() {
  const celebrant = "Sarah";

  return (
    <div className="min-h-screen bg-[#2D0C72] px-4 py-12 flex flex-col items-center justify-center text-center relative overflow-hidden">

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
