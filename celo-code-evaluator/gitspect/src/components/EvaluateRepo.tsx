"use client";

import { useCallback, useState, FormEvent, useEffect } from "react";
import {
  useSendTransaction,
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { AuditResult } from "../../types/audit";
import { auditRepository } from "../../services/auditService";
import { celo } from "wagmi/chains";
import sdk from "@farcaster/frame-sdk";

export default function EvaluateRepo() {
  const { isConnected } = useAccount();
  const {
    data: hash,
    sendTransaction,
    isPending: isPaymentProcessing,
  } = useSendTransaction();

  const { switchChain } = useSwitchChain();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const [githubUrl, setGithubUrl] = useState<string>("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string>("");
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);
  const [isAwaitingPayment, setIsAwaitingPayment] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle audit after confirmation
  useEffect(() => {
    if (isConfirmed && isProcessing) {
      performAudit();
    }
  }, [isConfirmed, isProcessing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!githubUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!githubUrl.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+/)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }
    setIsAwaitingPayment(true);
    try {
      setIsProcessing(true);

      // Switch to Celo network
      await switchChain({ chainId: celo.id });

      // Send transaction
      sendTransaction({
        to: "0xC00DA57cDE8dcB4ED4a8141784B5B4A5CBf62551",
        value: parseEther("0.01"),
      });
      setIsAwaitingPayment(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
      setIsAwaitingPayment(false);
      setIsProcessing(false);
    }
  };

  const performAudit = async () => {
    try {
      const result = await auditRepository(githubUrl);
      setAuditResult(result);
    } catch (err) {
      setError("Failed to perform audit");
      console.error("Audit error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const openWarpcastUrl = useCallback(() => {
    sdk.actions.composeCast({
      text: `Review a Celo project! `,
      embeds: ["https://lazy-symbols-sit.loca.lt/"],
    });
    //sdk.actions.close();
    //sdk.actions.openUrl("https://warpcast.com/~/compose");
  }, []);

  const shareAuditResult = async () => {
    if (!auditResult) return;
    await sdk.actions.composeCast({
      text:
        `I just reviewed ${auditResult?.repoName} on Celo! \n` +
        `Overall Score: ${auditResult?.score}/10\n`,
      embeds: ["https://lazy-symbols-sit.loca.lt/"],
    });
    //sdk.actions.openUrl("https://warpcast.com/~/compose");
  };

  const toggleCriteria = (name: string) => {
    setExpandedCriteria(expandedCriteria === name ? null : name);
  };

  const renderCriteria = () => {
    if (!auditResult?.criteria?.length) return null;

    return (
      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-lg mb-2">Project Scores</h3>
        {auditResult.criteria.map((criterion) => (
          <div key={criterion.name} className="border-b border-gray-700 pb-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleCriteria(criterion.name)}
            >
              <span className="font-semibold">{criterion.name}</span>
              <span className="font-bold text-blue-400">{criterion.score}</span>
            </div>
            {expandedCriteria === criterion.name && (
              <div className="mt-2 text-sm text-gray-300">
                {criterion.justification}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!auditResult?.metrics) return null;

    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {auditResult.metrics.stars !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Stars</div>
            <div className="text-xl font-bold">{auditResult.metrics.stars}</div>
          </div>
        )}
        {auditResult.metrics.forks !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Forks</div>
            <div className="text-xl font-bold">{auditResult.metrics.forks}</div>
          </div>
        )}
        {auditResult.metrics.contributors !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Contributors</div>
            <div className="text-xl font-bold">
              {auditResult.metrics.contributors}
            </div>
          </div>
        )}
        {auditResult.metrics.commits !== undefined && (
          <div className="bg-gray-700/50 p-3 rounded-lg">
            <div className="text-gray-400 text-sm">Commits</div>
            <div className="text-xl font-bold">
              {auditResult.metrics.commits}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLanguages = () => {
    if (!auditResult?.metrics?.languages) return null;

    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Language Distribution:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(auditResult.metrics.languages).map(
            ([lang, percent]) => (
              <span
                key={lang}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {lang}: {percent}%
              </span>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          GitSpect
        </h1>
        <h1 className="text-xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Celo Project Auditor
        </h1>

        {!auditResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="repoUrl"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="repoUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                disabled={isPaymentProcessing || isProcessing}
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isPaymentProcessing || isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                isPaymentProcessing || isProcessing
                  ? "bg-blue-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
              }`}
            >
              {isPaymentProcessing || isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isAwaitingPayment
                    ? "Confirm Payment in Wallet..."
                    : "Processing..."}
                </div>
              ) : (
                "Inspect Repository (0.01 CELO)"
              )}
            </button>

            <div className="text-center text-sm text-gray-400 mt-2">
              {isConnected ? (
                <p>A 0.01 CELO payment is required to perform the audit</p>
              ) : (
                <p>Please connect your wallet to perform an audit</p>
              )}
            </div>
          </form>
        ) : (
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Audit Results</h2>
              <div className="text-sm text-green-400">Paid: 0.01 CELO</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Repository:</span>
                <span className="font-medium">{auditResult.repoName}</span>
              </div>

              {auditResult.score !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Overall Score:</span>
                  <span
                    className={`font-bold text-xl ${
                      auditResult.score >= 8
                        ? "text-green-400"
                        : auditResult.score >= 5
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {auditResult.score.toFixed(1)}/10
                  </span>
                </div>
              )}

              {renderMetrics()}
              {renderLanguages()}
              {renderCriteria()}
            </div>
            <button
              onClick={() => {
                setAuditResult(null);
                setGithubUrl("");
              }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md`}
            >
              Audit Another Repository
            </button>
            <button
              onClick={() => {
                shareAuditResult();
              }}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md`}
            >
              Share Audit Result
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Professional code reviews for Celo blockchain projects. Each audit
            requires a 0.01 CELO fee.
          </p>
        </div>
        <button
          onClick={() => {
            openWarpcastUrl();
          }}
          className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md`}
        >
          Share GitInspect
        </button>
      </div>
    </div>
  );
}
