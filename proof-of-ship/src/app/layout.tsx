import type { Metadata } from "next";

import { getSession } from "~/auth";
import "~/app/globals.css";
import { Providers } from "~/app/providers";

export const metadata: Metadata = {
  title: "Proof of Ship",
  description: "Proof of Ship Frame",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
        }}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
