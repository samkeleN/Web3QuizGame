import { AuditResult, AuditResponse } from "../types/audit";
import { parseAuditResponse } from "../utils/auditUtils";

export const auditRepository = async (
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
