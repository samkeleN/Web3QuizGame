import { NextApiRequest, NextApiResponse } from "next";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ethers } from "ethers";
import { ContractAbi, ContractAddress } from "@/data/abi";

// Update the in-memory storage to group quizzes by userId
const quizzes: Record<string, { score: number; date: string; time: string }[]> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      console.log("Incoming /api/verify request body:", req.body);
      const { proof, publicSignals, quizId, answers, userId, action } = req.body;

      // Handle getGames action
      if (action === "getGames") {
        try {
          const userQuizzes = quizzes[userId] || [];
          return res.status(200).json({
            message: "Games fetched successfully",
            games: userQuizzes,
          });
        } catch (error) {
          console.error("Error fetching games:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      }

      // Handle quiz submission (no proof required)
      if (quizId && answers) {
        try {
          // Accept answers as array of objects or strings
          let userAnswers: string[] = [];
          if (Array.isArray(answers)) {
            if (typeof answers[0] === "object" && answers[0] !== null && "answer" in answers[0]) {
              userAnswers = answers.map((a: any) => a.answer);
            } else {
              userAnswers = answers;
            }
          }
          console.log("Processed user answers:", userAnswers);

          // Placeholder logic for quiz verification and scoring
          const correctAnswers = ["Paris", "Elon Musk", "Jupiter", "H2O", "JavaScript", "Cell", "300,000 km/s", "Japan", "Avocado", "8"];
          let score = 0;
          userAnswers.forEach((answer: string, index: number) => {
            if (answer === correctAnswers[index]) {
              score++;
            }
          });

          // Store the quiz result by userId
          const now = new Date();
          if (!quizzes[userId]) {
            quizzes[userId] = [];
          }
          quizzes[userId].push({
            score,
            date: now.toISOString().split("T")[0],
            time: now.toTimeString().split(" ")[0],
          });

          return res.status(200).json({
            message: "Quiz submitted successfully",
            score,
          });
        } catch (error) {
          console.error("Error handling quiz submission:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      }

      // Only run proof verification if proof and publicSignals are present
      if (proof && publicSignals) {
        console.log("Proof:", proof);
        console.log("Public signals:", publicSignals);
        const rpc = process.env.NEXT_PUBLIC_RPC_URL as string;
        const address = await getUserIdentifier(publicSignals, "hex");
        console.log("Extracted address from verification result:", address);
        const provider = new ethers.JsonRpcProvider(rpc);
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const contract = new ethers.Contract(
          ContractAddress,
          ContractAbi,
          signer
        );
        const proofData = {
          a: proof.a,
          b: [
            [proof.b[0][1], proof.b[0][0]],
            [proof.b[1][1], proof.b[1][0]],
          ],
          c: proof.c,
          pubSignals: publicSignals,
        };
        try {
          const tx = await contract.verifySelfProof(proofData);
          await tx.wait();
          console.log("Successfully called verifySelfProof function");
          return res.status(200).json({
            status: "success",
            result: true,
            credentialSubject: {},
          });
        } catch (error) {
          console.error("Error calling verifySelfProof function:", error);
          return res.status(400).json({
            status: "error",
            result: false,
            message: "Verification failed or date of birth not disclosed",
            details: {},
          });
        }
      }

      // If none of the above matched, return error
      return res.status(400).json({ message: "Invalid request payload" });
    } catch (error) {
      console.error("Error verifying proof or handling quiz:", error);
      return res.status(500).json({
        status: "error",
        message: "Error verifying proof or handling quiz",
        result: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
