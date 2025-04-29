"use client";

import { useState } from "react";

export default function KarmaGapEndorsementFrame() {
  const [projectUrl, setProjectUrl] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Karma GAP Endorsement</h1>
          <p className="text-gray-600 text-sm mt-1">
            Paste your Karma GAP project link to generate a shareable endorsement frame.
          </p>
        </div>

        <input
          type="url"
          placeholder="https://karmagap.com/project/your-project"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-celo"
        />

        {/* Preview placeholder */}
        <div className="border border-dashed border-gray-400 rounded-lg p-4 text-center text-gray-500">
          {projectUrl ? (
            <p>🔍 Preview of: <br /> <span className="text-blue-600">{projectUrl}</span></p>
          ) : (
            <p>Your project preview will appear here.</p>
          )}
        </div>

        <button
          disabled={!projectUrl}
          className="w-full bg-celo text-white py-2 px-4 rounded-lg font-semibold hover:bg-celo-dark disabled:opacity-50"
        >
          Generate Frame
        </button>
      </div>
    </div>
  );
}
