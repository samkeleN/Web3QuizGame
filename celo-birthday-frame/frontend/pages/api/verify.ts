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
      const { proof, publicSignals, quizId, answers }: { proof: any; publicSignals: any; quizId: string; answers: string[] } = req.body;

      // Update the getGames action to return quizzes for the specific userId
      if (req.body.action === "getGames") {
        try {
          const { userId } = req.body;
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

      // Update the quiz submission logic to store quizzes by userId
      if (req.body.quizId && req.body.answers) {
        try {
          const { quizId, answers, userId } = req.body;

          console.log("Received answers:", answers);

          // Extract the answer field from each object in the answers array
          const userAnswers = answers.map((answerObj: { answer: string }) => answerObj.answer);

          console.log("Processed user answers:", userAnswers);

          // Placeholder logic for quiz verification and scoring
          const correctAnswers = ["A", "B", "C"]; // Example correct answers
          let score = 0;

          userAnswers.forEach((answer: string, index: number) => {
            if (answer === correctAnswers[index]) {
              score++;
            }
          });

          console.log("Calculated score:", score);

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

      if (!proof || !publicSignals) {
        return res
          .status(400)
          .json({ message: "Proof and publicSignals are required" });
      }

      console.log("Proof:", proof);
      console.log("Public signals:", publicSignals);

      const rpc = process.env.NEXT_PUBLIC_RPC_URL as string;

      const address = await getUserIdentifier(publicSignals, "hex");
      console.log("Extracted address from verification result:", address);

      // // Connect to Celo network
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

      console.log(proofData);

      try {
        // VERIFY PROOF
        const tx = await contract.verifySelfProof(proofData);
        await tx.wait();
        console.log("Successfully called verifySelfProof function");

        res.status(200).json({
          status: "success",
          result: true,
          credentialSubject: {},
        });
      } catch (error) {
        console.error("Error calling verifySelfProof function:", error);
        res.status(400).json({
          status: "error",
          result: false,
          message: "Verification failed or date of birth not disclosed",
          details: {},
        });
        throw error;
      }

      if (!quizId || !answers) {
        return res.status(400).json({ message: "Quiz ID and answers are required" });
      }

      // Placeholder logic for quiz verification and scoring
      // This will later be integrated with smart contracts
      const correctAnswers = ["A", "B", "C"]; // Example correct answers
      let score = 0;

      answers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
          score++;
        }
      });

      return res.status(200).json({
        message: "Quiz submitted successfully",
        score,
      });
    } catch (error) {
      console.error("Error verifying proof:", error);
      return res.status(500).json({
        status: "error",
        message: "Error verifying proof",
        result: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
