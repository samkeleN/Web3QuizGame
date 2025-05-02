import React from "react";

type Props = {
  type: "money" | "donation";
  celebrant: string;
  token?: string;
  address?: string;
  category?: string;
  projectTitle?: string;
  projectUrl?: string;
};

export default function ConfirmationPage({
  type,
  celebrant,
  token,
  address,
  category,
  projectTitle,
  projectUrl,
}: Props) {
  return (
    <div className="min-h-screen bg-[#2D0C72] px-6 py-10 overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 py-8 text-center flex flex-col items-center justify-start">

        <div className="relative flex flex-col items-center mb-4 mx-8">

          <h1 className="text-[#FFF8C9] text-3xl font-bold mb-2">Confirm your birthday record!</h1>

        </div>

        <div className="bg-[#FFF8C9] w-full max-w-md rounded-2xl px-6 py-6 text-left space-y-4 shadow-lg">
          {type === "money" ? (
            <>
              <div>
                <p className="text-[#2D0C72] font-semibold">Wallet Address:</p>
                <p className="text-[#2D0C72] text-sm">{address}</p>
              </div>
              <div>
                <p className="text-[#2D0C72] font-semibold">Token:</p>
                <p className="text-[#2D0C72] text-sm">{token}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[#2D0C72] font-semibold">Category:</p>
                <p className="text-[#2D0C72] text-sm">{category}</p>
              </div>
              <div>
                <p className="text-[#2D0C72] font-semibold">Project:</p>
                <p className="text-[#2D0C72] text-sm">{projectTitle}</p>
              </div>
              <div>
                <p className="text-[#2D0C72] font-semibold">Project Link:</p>
                <a
                  href={`https://${projectUrl}`}
                  className="text-blue-600 text-sm underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectUrl}
                </a>
              </div>
            </>
          )}
        </div>
        <button
          className="w-40 mt-5 bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 px-4 rounded-xl text-lg transition-all"
        >
          Create
        </button>
      </div>

    </div>
  );
}
