import AnimateOnScroll from "./AnimateOnScroll";

const threats = [
  {
    icon: "⚠",
    stat: "Ed25519",
    label: "Broken by Shor's Algorithm",
    detail: "Solana's elliptic curve scheme. A quantum computer running Shor's algorithm can derive your private key from your public key in minutes.",
    color: "#EF4444",
    from: "left",
  },
  {
    icon: "◎",
    stat: "Public key",
    label: "Permanently visible on-chain",
    detail: "Your public key is stored forever on the blockchain. It is not a secret. When quantum computers arrive, it becomes an open door.",
    color: "#F59E0B",
    from: "bottom",
  },
  {
    icon: "⏱",
    stat: "Today",
    label: "Harvest now, decrypt later",
    detail: "Nation states are already storing blockchain data. When quantum computers are powerful enough, they decrypt the backlog. By then it is too late.",
    color: "#8B5CF6",
    from: "right",
  },
];

export default function TheProblem() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimateOnScroll style={{ textAlign: "center", marginBottom: "72px" }}>
          <span className="section-label" style={{ marginBottom: "16px" }}>The Problem</span>
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
            The Threat Is Real
          </h2>
        </AnimateOnScroll>

        <div
          className="grid-interactive"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {threats.map((item, i) => (
            <AnimateOnScroll key={item.stat} delay={i * 80} from={item.from}>
              <div
                className="card-hoverable"
                style={{
                  borderRadius: "20px",
                  padding: "28px",
                  height: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    marginBottom: "18px",
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}28`,
                  }}
                >
                  {item.icon}
                </div>
                <p
                  className="font-heading"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: item.color,
                    marginBottom: "4px",
                  }}
                >
                  {item.stat}
                </p>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px", fontSize: "14px" }}>
                  {item.label}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.7 }}>
                  {item.detail}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
