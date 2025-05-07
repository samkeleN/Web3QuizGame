import { AuditResult, AuditResponse } from "../types/audit";
import { parseAuditResponse } from "../utils/auditUtils";

export const auditRepositoryOld = async (
  githubUrl: string
): Promise<AuditResult> => {
  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      github_urls: githubUrl,
      prompt: "prompts/celo.txt",
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: AuditResponse = await response.json();
  return parseAuditResponse(data);
};

export const auditRepository = async (
  githubUrl: string
): Promise<AuditResult> => {
  // Use a Frame-compatible endpoint
  const frameEndpoint = "api/frame-audit";

  const response = await fetch(frameEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Warpcast-specific headers if needed
    },
    body: JSON.stringify({ github_urls: githubUrl }),
  });

  if (!response.ok) {
    console.error("Audit failed:", response.statusText);
    throw new Error(`Audit failed: ${response.status}`);
  }
  console.log("Audit response:", response);

  const data: AuditResponse = await response.json();
  return parseAuditResponse(data);
};
