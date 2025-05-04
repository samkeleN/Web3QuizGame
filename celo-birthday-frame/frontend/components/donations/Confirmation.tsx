import { Project } from "@/apollo/types";
import { Token } from "@/data/token";
import { decodeBase64Url, encodeBase64Url, projectUrl } from "@/lib/helpers";
import React from "react";

type Props = {
  type: "money" | "donation";
  celebrant: string;
  token?: Token;
  address?: string;
  category?: string;
  project?: Project;

};

export default function ConfirmationPage({
  type,
  celebrant,
  token,
  address,
  category,
  project
}: Props) {


  const add = encodeBase64Url(address || "");
  console.log(add);
  const addr = decodeBase64Url(add);

  console.log(addr)

  return (
    <div className="w-full flex flex-col items-center justify-start mt-4">

      <div className="relative flex flex-col items-center mb-4 mx-8">

        <h1 className="text-[#FFF8C9] text-3xl font-bold mb-2 max-w-xs">Confirm your birthday request record!</h1>
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
              {token && <p className="text-[#2D0C72] text-sm">{token.name}</p>}
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
              <p className="text-[#2D0C72] text-sm">{project?.title}</p>
            </div>
            <div>
              <p className="text-[#2D0C72] font-semibold">Project Link:</p>
              <a
                href={projectUrl(project?.slug)}
                className="text-blue-600 text-sm underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {projectUrl(project?.slug)}
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

  );
}
