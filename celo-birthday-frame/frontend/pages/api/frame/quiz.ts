import type { NextApiRequest, NextApiResponse } from "next";

// Farcaster Frame endpoint for quiz app
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Frame metadata for Farcaster
  if (req.method === "GET") {
    // Open Graph and Frame tags for quiz entry
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="og:title" content="Celo Quiz: Win an NFT!" />
        <meta property="og:description" content="Take the quiz and claim your Celo NFT reward based on your score!" />
        <meta property="og:image" content="https://your-domain.com/quiz.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-domain.com/quiz.png" />
        <meta property="fc:frame:button:1" content="Start Quiz" />
        <meta property="fc:frame:post_url" content="https://your-domain.com/api/frame/quiz" />
      </head>
      <body></body>
      </html>
    `);
    return;
  }

  // POST: handle frame actions (e.g., quiz answer, mint)
  if (req.method === "POST") {
    // You can parse req.body for user actions and respond with next frame step
    // For demo, just return a static frame
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="og:title" content="Quiz Started!" />
        <meta property="og:description" content="Answer the questions to win your NFT!" />
        <meta property="og:image" content="https://your-domain.com/quiz.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-domain.com/quiz.png" />
        <meta property="fc:frame:button:1" content="Go to Quiz" />
        <meta property="fc:frame:post_url" content="https://your-domain.com/quiz" />
      </head>
      <body></body>
      </html>
    `);
    return;
  }

  res.status(405).end();
}
