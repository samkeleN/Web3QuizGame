import { useState, FormEvent } from "react";

type AuditResult = {
  repoName?: string;
  analysis?: string;
  score?: number;
  metrics?: {
    stars?: number;
    forks?: number;
    contributors?: number;
    commits?: number;
    languages?: Record<string, number>;
  };
  criteria?: {
    name: string;
    score: string;
    justification: string;
  }[];
};

export default function EvaluateRepo() {
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string>("");
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!githubUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    if (!githubUrl.match(/^https?:\/\/github\.com\/[^/]+\/[^/]+/)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
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

      const data = await response.json();
      const analysisText = data.analyses[Object.keys(data.analyses)[0]];

      // Parse the criteria scores from the analysis text
      const criteria = parseCriteriaScores(analysisText);

      setAuditResult({
        repoName: Object.keys(data.analyses)[0],
        analysis: analysisText,
        score: parseOverallScore(analysisText),
        metrics: parseMetrics(analysisText),
        criteria,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to audit repository. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const parseOverallScore = (text: string): number | undefined => {
    const scoreMatch = text.match(/Overall Score.*?(\d+\.\d+)/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
  };

  const parseMetrics = (text: string) => {
    return {
      stars: extractNumber(text, /Stars:\s*(\d+)/i),
      forks: extractNumber(text, /Forks:\s*(\d+)/i),
      contributors: extractNumber(text, /Contributors:\s*(\d+)/i),
      commits: extractNumber(text, /Commits:\s*(\d+)/i),
      languages: extractLanguages(text),
    };
  };

  const parseCriteriaScores = (text: string) => {
    const criteria: { name: string; score: string; justification: string }[] =
      [];
    const criteriaSection = text.match(
      /Project Scores([\s\S]*?)Repository Metrics/i
    );

    if (criteriaSection) {
      const lines = criteriaSection[1]
        .split("\n")
        .filter((line) => line.trim());

      lines.forEach((line) => {
        if (line.includes("|") && !line.includes("Criteria")) {
          const parts = line
            .split("|")
            .map((part) => part.trim())
            .filter((part) => part);
          if (parts.length >= 3) {
            criteria.push({
              name: parts[0],
              score: parts[1],
              justification: parts[2],
            });
          }
        }
      });
    }

    return criteria;
  };

  const extractNumber = (text: string, regex: RegExp): number | undefined => {
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : undefined;
  };

  const extractLanguages = (text: string): Record<string, number> => {
    const languages: Record<string, number> = {};
    const langSection = text.match(
      /Language Distribution[\s\S]*?Codebase Breakdown/i
    );

    if (langSection) {
      const langLines = langSection[0]
        .split("\n")
        .filter((line) => line.includes("%"))
        .map((line) => line.trim());

      langLines.forEach((line) => {
        const parts = line.split(":");
        if (parts.length === 2) {
          const lang = parts[0].trim();
          const percent = parseFloat(parts[1].trim().replace("%", ""));
          if (!isNaN(percent)) {
            languages[lang] = percent;
          }
        }
      });
    }

    return languages;
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
        <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          GitHub Repo Auditor
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
              />
              {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                isLoading
                  ? "bg-blue-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md"
              }`}
            >
              {isLoading ? (
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
                  Auditing...
                </div>
              ) : (
                "Inspect Repository"
              )}
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Audit Results</h2>
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md`}
            >
              Audit Other Repository
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Enter a public GitHub repository URL to analyze its security and
            quality
          </p>
        </div>
      </div>
    </div>
  );
}
