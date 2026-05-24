import { Mulish, Space_Grotesk } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "../context/SolanaProvider";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Quorion — Quantum Vault for Solana",
  description:
    "Move your assets into an on-chain Quantum Vault protected by post-quantum cryptography. Zero changes to Solana. Deployable today.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${mulish.variable} ${spaceGrotesk.variable}`}
    >
      <body className={mulish.className}>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
