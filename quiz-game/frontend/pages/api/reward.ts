import { ethers } from "ethers";
import { QuizRewardABI } from "../../data/abi"; // Ensure ABI is correctly exported
import { uploadJSONToPinata, getPinataGatewayUrl } from "../../lib/pinata";

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

// Map your Pinata folder CIDs here
const IPFS_CIDS: Record<string, string> = {
  easy: process.env.PINATA_EASY_CID || "",
  medium: process.env.PINATA_MEDIUM_CID || "",
  hard: process.env.PINATA_HARD_CID || "",
};

function getImageUrl(difficulty: string, score: number) {
  const cid = IPFS_CIDS[difficulty];
  // Use ngrok URL for the image URL
  return `https://cdd7-41-203-62-54.ngrok-free.app/${cid}/${score}.png`;
}

function generateMetadata(difficulty: string, score: number) {
  return {
    name: `Quiz Reward (${difficulty}, Score ${score})`,
    description: `NFT reward for quiz score ${score} on ${difficulty} mode.`,
    image: getImageUrl(difficulty, score),
    attributes: [
      { trait_type: "Difficulty", value: difficulty },
      { trait_type: "Score", value: score },
    ],
  };
}

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { walletAddress, score, difficulty } = req.body;

    if (!walletAddress || score === undefined || !difficulty) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    try {
      if (!ethers.isAddress(contractAddress)) {
        console.error("Invalid contract address:", contractAddress);
        return res.status(500).json({ error: "Invalid contract address" });
      }
      if (!ethers.isAddress(walletAddress)) {
        console.error("Invalid wallet address:", walletAddress);
        return res.status(400).json({ error: "Invalid wallet address" });
      }
      if (!IPFS_CIDS[difficulty]) {
        return res.status(400).json({ error: "Invalid difficulty or missing CID" });
      }
      // 1. Generate metadata JSON
      const metadata = generateMetadata(difficulty, score);
      // 2. Upload metadata to Pinata
      const cid = await uploadJSONToPinata(metadata);
      // Use ngrok URL for the tokenURI
      const tokenURI = `https://cdd7-41-203-62-54.ngrok-free.app/${cid}/metadata.json`;
      // 3. Mint NFT with tokenURI
      const quizRewardContract = await getQuizRewardContract();
      const txResult = await quizRewardContract.mintReward(walletAddress, tokenURI);
      await txResult.wait();
      res.status(200).json({ success: true, transactionHash: txResult.hash, tokenURI });
    } catch (error) {
      console.error("Error minting reward:", error);
      res.status(500).json({ error: "Failed to mint reward" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}