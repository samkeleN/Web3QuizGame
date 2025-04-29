"use client";

import { useState } from 'react';

export default function KarmaGapEndorsementFrame() {
  const [projectUrl, setProjectUrl] = useState('');
  const [endorsed, setEndorsed] = useState(false);

  const handleEndorse = () => {
    setEndorsed(true);
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold">KarmaGAP Project Endorsement</h1>
      <p className="mt-2">Endorse a KarmaGAP project by entering its URL below!</p>

      <div className="mt-4">
        <input
          type="url"
          placeholder="Enter KarmaGAP Project URL"
          className="p-2 border rounded"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />
      </div>

      {/* Show project info when URL is entered */}
      {projectUrl && !endorsed && (
        <div className="mt-4">
          <h2 className="text-xl">Project: {projectUrl}</h2>
          <button
            className="mt-2 p-2 bg-blue-500 text-white rounded"
            onClick={handleEndorse}
          >
            Endorse Project
          </button>
        </div>
      )}

      {/* Thank you message after endorsement */}
      {endorsed && (
        <div className="mt-4">
          <p className="text-green-500">Thank you for endorsing this project!</p>
        </div>
      )}
    </div>
  );
}
