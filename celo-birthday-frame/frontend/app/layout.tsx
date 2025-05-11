import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@farcaster/auth-kit/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Self Happy Birthday",
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
        <link rel="preload" href="/globals.css" as="style" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
