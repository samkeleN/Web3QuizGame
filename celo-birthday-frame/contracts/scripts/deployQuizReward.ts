import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    throw new Error("No signers available. Ensure your environment is properly configured.");
  }

  const [deployer] = signers;
  if (!deployer || !deployer.address) {
    throw new Error("Deployer address is undefined. Check your Hardhat configuration and environment variables.");
  }

  console.log("Deploying contract with the account:", deployer.address);

  const QuizReward = await ethers.getContractFactory("QuizReward");
  console.log("Deploying QuizReward contract...");

  const quizReward = await QuizReward.deploy(deployer.address);
  const deployedContract = await quizReward.waitForDeployment(); // Wait for deployment

  console.log("QuizReward deployed to:", deployedContract.target); // Use target to get the deployed address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });