import React from "react";

export default function BirthdayDonationView() {
  const celebrant = "Sarah";
  const project = {
    name: "TechBridge",
    description: "Connecting African youths to technology opportunities",
    link: "giveth.io/project/techbridge",
    raised: 3315,
    progress: 0.66
  };

  return (
    <div className="min-h-screen bg-[#2D0C72] px-4 py-10 text-center flex flex-col items-center overflow-hidden">
      {/* Confetti */}
      <svg className="absolute top-6 left-6 w-2 h-2 text-yellow-300" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>
      <svg className="absolute top-10 right-8 w-2 h-2 text-teal-300" viewBox="0 0 10 10"><rect width="10" height="2" fill="currentColor" transform="rotate(45)" /></svg>
      <svg className="absolute bottom-6 left-10 w-2 h-2 text-purple-400" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="currentColor" /></svg>

      {/* Headings */}
      <h1 className="text-[#FFF8C9] text-3xl sm:text-4xl font-bold mb-3">
        Celebrate {celebrant}’s Birthday!
      </h1>
      <p className="text-[#FFF8C9] mb-6 text-base">
        {celebrant} chose to support <strong>{project.name}</strong> for their birthday!
      </p>

      {/* Project Card */}
      <div className="bg-[#FFF8C9] rounded-2xl shadow-lg px-5 py-6 w-full max-w-md text-left space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D0C72]">{project.name}</h2>
          <p className="text-[#2D0C72] text-sm">{project.description}</p>
          <a
            href={`https://${project.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-sm underline block mt-1"
          >
            {project.link}
          </a>
        </div>

        {/* Progress Bar */}
        <div className="bg-teal-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-teal-700 h-3"
            style={{ width: `${project.progress * 100}%` }}
          />
        </div>
        <p className="text-sm text-[#2D0C72] font-medium">
          Raised so far {project.raised}
        </p>

        {/* Donate Button */}
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#2D0C72] font-bold text-lg py-3 rounded-xl transition-all">
          Donate Now
        </button>
      </div>

      <p className="text-[#FFF8C9] text-sm mt-6 max-w-xs">
        All proceeds go directly to {project.name} via Giveth.
      </p>
    </div>
  );
}
