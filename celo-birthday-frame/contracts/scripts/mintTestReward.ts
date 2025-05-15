// Mint a test reward NFT with a tokenURI containing a score
import { QuizRewardABI } from "../../frontend/data/abi";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // Use ALFAJORES_PRIVATE_KEY and ALFAJORES_RPC_URL first for testnet
  const contractAddress = process.env.QUIZ_REWARD_CONTRACT_ADDRESS || "<YOUR_CONTRACT_ADDRESS_HERE>";
  const privateKey = process.env.ALFAJORES_PRIVATE_KEY || process.env.CELO_KEY || process.env.PRIVATE_KEY;
  const rpcUrl = process.env.ALFAJORES_RPC_URL || process.env.CELO_RPC_URL || "https://alfajores-forno.celo-testnet.org";

  if (!privateKey) throw new Error("Missing CELO_KEY or PRIVATE_KEY in .env");
  if (!contractAddress || !contractAddress.startsWith("0x")) throw new Error("QUIZ_REWARD_CONTRACT_ADDRESS must be a hex address");

  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, QuizRewardABI, wallet);

  // Use the wallet address as recipient
  const recipient = wallet.address;
  const score = 7;
  const tokenURI = `https://example.com/metadata/${score}`;

  // Manually set only gas limit, let ethers determine gas price
  const tx = await contract.mintReward(recipient, tokenURI, {
    gasLimit: 500_000,
  });
  console.log("Minting test reward...", tx.hash);
  await tx.wait();
  console.log(`Test reward minted to ${recipient} with tokenURI: ${tokenURI}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
