// Print the wallet address for the current ALFAJORES_PRIVATE_KEY
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const privateKey = process.env.ALFAJORES_PRIVATE_KEY;
  if (!privateKey) throw new Error("Missing ALFAJORES_PRIVATE_KEY in .env");
  const { ethers } = require("ethers");
  const wallet = new ethers.Wallet(privateKey);
  console.log("Wallet address:", wallet.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
