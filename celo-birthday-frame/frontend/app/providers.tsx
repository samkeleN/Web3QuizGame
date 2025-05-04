"use client";

// import dynamic from "next/dynamic";
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter, projectId, networks } from '@/config'
import {
  AuthKitProvider,
} from "@farcaster/auth-kit";
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { ApolloWrapper } from '@/apollo/apolloClient';
const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://example.com/login",
  domain: "example.com",
};

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'celo-birthday-frame',
  description: 'celo-birthday-frame',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#F97316',
  }

})

export function Providers({ children, cookies }: { children: React.ReactNode, cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
  return (
    <AuthKitProvider config={config}>
      <ApolloWrapper >
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
      </ApolloWrapper>
    </AuthKitProvider>
  );
}
