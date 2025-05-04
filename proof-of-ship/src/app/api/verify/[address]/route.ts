import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  if (req.method === "POST") {
    try {
      const { proof, publicSignals } = await req.json();
      const { address } = await params;

      if (!proof || !publicSignals) {
        return NextResponse.json(
          { message: "Proof and publicSignals are required" },
          { status: 400 }
        );
      }

      const userId = await getUserIdentifier(publicSignals);
      console.log("Extracted userId:", userId);

      // Initialize and configure the verifier
      const selfBackendVerifier = new SelfBackendVerifier(
        "builder-reward-celo-scope",
        `${process.env.NEXT_PUBLIC_API_URL}/api/verify`,
        "hex",
        true
      );

      // Verify the proof
      const result = await selfBackendVerifier.verify(proof, publicSignals);

      if (result.isValid) {
        console.log("userId", userId);
        await prisma.builderProfile.create({
          data: {
            wallet: address,
            isVerified: true,
            talentScore: 0,
          },
        });
        // Return successful verification response
        return NextResponse.json(
          {
            status: "success",
            result: true,
            credentialSubject: result.credentialSubject,
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: "Verification failed",
          details: result.isValidDetails,
        },
        { status: 500 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          status: "error",
          result: false,
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
