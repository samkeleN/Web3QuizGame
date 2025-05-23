import { run } from "hardhat";

export const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract verified successfully!");
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified");
    } else {
      console.error("Verification failed:", e);
    }
  }
};