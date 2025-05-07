export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  // The .well-known/farcaster.json route is used to provide the configuration for the Frame.
  // You need to generate the accountAssociation payload and signature using this link:

  const config = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    frame: {
      version: "1",
      name: "Proof of ship",
      iconUrl: `${appUrl}/splash.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/splash.png`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
