import AnimateOnScroll from "./AnimateOnScroll";

const signals = [
  {
    code: "FIPS 204 / 205",
    title: "NIST Standardised",
    desc: "ML-DSA and SLH-DSA are fully standardised post-quantum algorithms, not experimental. NIST-approved since August 2024.",
    color: "#8B5CF6",
    from: "left",
  },
  {
    code: "Winternitz Vault",
    title: "Solana Validated",
    desc: "The same quantum vault architecture cited by Google Quantum AI and aligned with the Solana Winternitz Vault design.",
    color: "#2DD4BF",
    from: "bottom",
  },
  {
    code: "April 2026 Roadmap",
    title: "Anza and Firedancer",
    desc: "Fully aligned with Solana's official post-quantum migration roadmap published by Anza and Firedancer in April 2026.",
    color: "#10B981",
    from: "right",
  },
];

export default function TrustSignals() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimateOnScroll style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="section-label" style={{ marginBottom: "16px" }}>Credibility</span>
          <h2
            className="font-heading"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.15,
              margin: "16px 0 0",
            }}
          >
            Validated By The Industry
          </h2>
        </AnimateOnScroll>

        <div
          className="grid-interactive"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "14px",
          }}
        >
          {signals.map((s, i) => (
            <AnimateOnScroll key={s.code} delay={i * 100} from={s.from}>
              <div
                className="card-hoverable"
                style={{
                  borderRadius: "20px",
                  padding: "28px",
                  height: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${s.color}22`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    background: `${s.color}18`,
                    color: s.color,
                    marginBottom: "16px",
                  }}
                >
                  {s.code}
                </div>
                <h3
                  className="font-heading"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "var(--text-primary)",
                    marginBottom: "10px",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ color: "var(--text-body)", fontSize: "13px", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
