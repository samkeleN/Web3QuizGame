import { ethers } from "ethers";
import { QuizRewardABI } from "../../data/abi"; // Ensure ABI is correctly exported

const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL); // Updated to match ethers v6

async function getSigner() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not defined in environment variables.");
  }
  return new ethers.Wallet(privateKey, provider);
}

const contractAddress = process.env.QUIZ_REWARD_CONTRACT_ADDRESS || ""; // Added fallback to empty string

if (!contractAddress) {
  throw new Error("QUIZ_REWARD_CONTRACT_ADDRESS is not defined in environment variables.");
}

async function getQuizRewardContract() {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, QuizRewardABI, signer);
}

export default async function handler(req: any, res: any) { // Explicitly typed req and res
  if (req.method === "POST") {
    const { walletAddress, score } = req.body;

    if (!walletAddress || score === undefined) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    try {
      // Use the wallet address provided by the user (from verify step)
      // This should be the user's actual wallet address, not a hardcoded or backend address
      if (!ethers.isAddress(contractAddress)) {
        console.error("Invalid contract address:", contractAddress);
        return res.status(500).json({ error: "Invalid contract address" });
      }
      if (!ethers.isAddress(walletAddress)) {
        console.error("Invalid wallet address:", walletAddress);
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      console.log("Minting to user wallet address (from verify):", walletAddress);
      const quizRewardContract = await getQuizRewardContract();
      const tokenURI = `https://example.com/metadata/${score}`; // Replace with actual metadata logic
      const tx = await quizRewardContract.mintReward(walletAddress, tokenURI);
      await tx.wait();

      res.status(200).json({ success: true, transactionHash: tx.hash });
    } catch (error) {
      console.error("Error minting reward:", error);
      res.status(500).json({ error: "Failed to mint reward" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}