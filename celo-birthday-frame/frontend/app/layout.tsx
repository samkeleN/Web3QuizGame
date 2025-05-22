import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@farcaster/auth-kit/styles.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Game",
  description: "Happy Birthday!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  return (
    <html lang="en">
      <head>
        {/* Remove the preload for globals.css to avoid hydration mismatch */}
        {/* <link rel="preload" href="./globals.css" as="style" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
