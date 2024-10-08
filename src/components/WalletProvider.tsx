'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { env } from '~/env';
import { useWagmiConfig } from '~/utils/wagmi';

type Props = { children: ReactNode };

const queryClient = new QueryClient();

function OnchainProviders({ children }: Props) {
    const wagmiConfig = useWagmiConfig();

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} chain={base}>
                    <RainbowKitProvider modalSize="compact">
                        {children}
                    </RainbowKitProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default OnchainProviders;
