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
        <meta property="og:title" content="Quiz Game: Win an NFT!" />
        <meta property="og:description" content="Take the quiz and claim your NFT reward!" />
        <meta property="og:image" content="https://quiz-game-ten-eta.vercel.app/quiz.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://quiz-game-ten-eta.vercel.app/quiz.png" />
        <meta property="fc:frame:button:1" content="Start Quiz" />
        <meta property="fc:frame:post_url" content="https://quiz-game-ten-eta.vercel.app/api/frame/quiz" />
      </head>
      <body></body>
      </html>
    `);
    return;
  }

  // POST: handle frame actions (e.g., quiz answer, mint)
  if (req.method === "POST") {
    // For demo, show first quiz question (static)
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="og:title" content="Quiz Question 1" />
        <meta property="og:description" content="What is the capital of France?" />
        <meta property="og:image" content="https://quiz-game-ten-eta.vercel.app/quiz.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://quiz-game-ten-eta.vercel.app/quiz.png" />
        <meta property="fc:frame:button:1" content="Paris" />
        <meta property="fc:frame:button:2" content="Berlin" />
        <meta property="fc:frame:button:3" content="Madrid" />
        <meta property="fc:frame:button:4" content="Lisbon" />
        <meta property="fc:frame:post_url" content="https://quiz-game-ten-eta.vercel.app/api/frame/quiz" />
      </head>
      <body></body>
      </html>
    `);
    return;
  }

  res.status(405).end();
}
