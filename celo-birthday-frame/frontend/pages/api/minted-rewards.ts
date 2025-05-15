import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { QuizRewardABI } from "../../data/abi";

const provider = new ethers.JsonRpcProvider(process.env.CELO_RPC_URL);
const contractAddress = process.env.QUIZ_REWARD_CONTRACT_ADDRESS || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  if (!contractAddress) {
    return res.status(500).json({ error: "QUIZ_REWARD_CONTRACT_ADDRESS not set" });
  }
  try {
    const contract = new ethers.Contract(contractAddress, QuizRewardABI, provider);
    // Query all Transfer events (ERC721/1155 standard)
    const events = await contract.queryFilter('Transfer', 0, 'latest');
    // For each event, get recipient and tokenId (and try to get tokenURI)
    const rewards = await Promise.all(
      events.map(async (event: any) => {
        const to = event.args?.to;
        const tokenId = event.args?.tokenId?.toString();
        let tokenURI = "";
        let score = null;
        try {
          tokenURI = await contract.tokenURI(tokenId);
          // Parse score from tokenURI if it matches /metadata/{score}
          const match = tokenURI.match(/metadata\/(\d+)/);
          if (match) {
            score = parseInt(match[1], 10);
          }
        } catch {}
        return { address: to, tokenId, tokenURI, score };
      })
    );
    res.status(200).json({ rewards });
  } catch (error) {
    console.error("Error fetching minted rewards:", error);
    res.status(500).json({ error: "Failed to fetch minted rewards" });
  }
}
