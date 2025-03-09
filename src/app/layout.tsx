import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import{ AppWagmiProvider} from '@/context/WagmiProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-production-domain.com'),
  title: "Ocicat Staking",
  description: "Stake Ocicat and earn rewards",
  openGraph: {
    title: "Ocicat Staking",
    description: "Stake Ocicat and Earn Rewards",
    url: "https://your-site-url.com", 
    siteName: "Stake Ocicat",
    images: [
      {
        url: "/public/logo.svg", 
        width: 800,
        height: 600,
        alt: "Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", 
    site: "@your-twitter-handle", 
    creator: "@your-twitter-handle", 
    title: "Ocicat Staking",
    description: "Stake Ocicat and earn rewards",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
      <body className={` ${geistSans.variable} ${geistMono.variable}`}>
      <AppWagmiProvider>
        <Navbar />
        <main className="relative overflow-hidden bg-slate-800 text-white">
          {children}
        </main>
      </AppWagmiProvider>
      </body>
    </html>
  );
}
