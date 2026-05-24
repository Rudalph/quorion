import Navbar from "@/components/home-page-components/Navbar";
import LearnMoreHero from "@/components/learnmore-components/LearnMoreHero";
import AlgorithmEngine from "@/components/learnmore-components/AlgorithmEngine";
import AgentVerification from "@/components/learnmore-components/AgentVerification";
import Governance from "@/components/learnmore-components/Governance";
import TrustSignals from "@/components/learnmore-components/TrustSignals";
import LearnMoreFooter from "@/components/learnmore-components/LearnMoreFooter";

export const metadata = {
  title: "How It Works — Quorion",
  description: "The full technical picture: six algorithms, agent DAO verification, and crypto-agile governance for quantum-safe Solana transactions.",
};

export default function LearnMorePage() {
  return (
    <main style={{ userSelect: "none", cursor: "default" }}>
      <Navbar />
      <LearnMoreHero />
      <AlgorithmEngine />
      <AgentVerification />
      <Governance />
      <TrustSignals />
      <LearnMoreFooter />
    </main>
  );
}
