import AnimateOnScroll from "./AnimateOnScroll";

const steps = [
  {
    number: "01",
    title: "Initialise Your Vault",
    description: "Connect your Phantom wallet. Quorion creates a personal Quantum Vault: a Program Derived Address on Solana. No private key controls it. Only the contract's rules can open it.",
    tags: ["Phantom Wallet", "PDA", "On-Chain"],
    highlight: false,
    from: "left",
  },
  {
    number: "02",
    title: "Deposit Your Assets",
    description: "Transfer SOL from your regular wallet into the vault. Three signatures required: Ed25519, ML-DSA, and SLH-DSA. Once done, your main wallet is empty. Quantum attacks find nothing there.",
    tags: ["Ed25519", "ML-DSA", "SLH-DSA"],
    highlight: true,
    from: "right",
  },
  {
    number: "03",
    title: "Transact With Confidence",
    description: "When sending funds, pick a classical algorithm plus one PQC algorithm. At least one post-quantum signature is always mandatory. Verified by a decentralised agent network before hitting the Solana pipeline.",
    tags: ["Agent DAO", "PQC Mandatory", "Solana"],
    highlight: false,
    from: "left",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimateOnScroll style={{ textAlign: "center", marginBottom: "72px" }}>
          <span className="section-label" style={{ marginBottom: "16px" }}>How It Works</span>
          <h2
            className="font-heading"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.12,
              margin: "16px 0 0",
            }}
          >
            Three Steps to Quantum Safety
          </h2>
        </AnimateOnScroll>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 80} from={step.from}>
              <div
                className="card-hoverable"
                style={{
                  borderRadius: "20px",
                  padding: "28px 32px",
                  background: step.highlight ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.025)",
                  border: step.highlight ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.055)",
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  className="font-heading"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                    fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
                    lineHeight: 1,
                    flexShrink: 0,
                    color: step.highlight ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.05)",
                    userSelect: "none",
                  }}
                >
                  {step.number}
                </span>
                <div>
                  <h3
                    className="font-heading"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "var(--text-primary)",
                      marginBottom: "10px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: 1.75, marginBottom: "16px" }}>
                    {step.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "12px",
                          fontWeight: 500,
                          background: step.highlight ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)",
                          color: step.highlight ? "#A78BFA" : "var(--text-faint)",
                          border: step.highlight ? "1px solid rgba(139,92,246,0.22)" : "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
