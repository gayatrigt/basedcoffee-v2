import "~/styles/globals.css";
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import { type Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { accentFont, baseFont } from "~/font";
import dynamic from "next/dynamic";
import SideMenu from "~/components/SideMenu";

export const metadata: Metadata = {
  title: "BasedCoffee",
  description: "Fund Creators, Fuel Dreams",
  icons: [{ rel: "icon", url: "/favicon.png" }],
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};


const Providers = dynamic(
  () => import('src/components/WalletProvider'),
  {
    ssr: false,
  },
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={twMerge(baseFont.variable, accentFont.variable)}>
      <body>
        <Providers>
          {children}
          <SideMenu />
        </Providers>
      </body>
    </html>
  );
}
