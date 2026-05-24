import Navbar from "@/components/home-page-components/Navbar";
import Hero from "@/components/home-page-components/Hero";
import TheProblem from "@/components/home-page-components/TheProblem";
import TheSolution from "@/components/home-page-components/TheSolution";
import HowItWorks from "@/components/home-page-components/HowItWorks";
import FooterCTA from "@/components/home-page-components/FooterCTA";

export default function Home() {
  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#070A12", color: "#F0F0DB", userSelect: "none", cursor: "default" }}
    >
      <Navbar />
      <Hero />
      <TheProblem />
      <TheSolution />
      <HowItWorks />
      <FooterCTA />
    </main>
  );
}
