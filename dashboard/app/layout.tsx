import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PumpFun 3D Agent | Simulation Dashboard",
  description:
    "Supervised, simulation-first AI trading agent for pump.fun on Solana. No real capital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
