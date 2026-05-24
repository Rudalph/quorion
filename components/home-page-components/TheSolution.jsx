import AnimateOnScroll from "./AnimateOnScroll";

export default function TheSolution() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimateOnScroll style={{ textAlign: "center", marginBottom: "72px" }}>
          <span className="section-label" style={{ marginBottom: "16px" }}>The Solution</span>
          <h2
            className="font-heading"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.12,
              margin: "16px 0 16px",
            }}
          >
            Introducing the Quantum Vault
          </h2>
          <p style={{ color: "var(--text-body)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.75, fontSize: "15px" }}>
            Quorion changes the mathematics protecting your assets. If a quantum computer
            cracks your classical key and enters your wallet, it finds nothing.
            Everything lives in the vault.
          </p>
        </AnimateOnScroll>

        {/* Before / After — cards fly in from opposite sides */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Before */}
          <AnimateOnScroll from="left">
            <div
              className="card-hoverable"
              style={{
                borderRadius: "20px",
                padding: "28px",
                background: "rgba(239,68,68,0.03)",
                border: "1px solid rgba(239,68,68,0.1)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: "rgba(239,68,68,0.1)",
                  color: "#EF4444",
                  marginBottom: "22px",
                }}
              >
                Without Quorion
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ borderRadius: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-faint)", fontFamily: "monospace", marginBottom: "4px" }}>main wallet</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>124.5 SOL (exposed)</p>
                  <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px" }}>Public key visible on-chain forever</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "22px", color: "#EF4444" }}>↑</span>
                </div>
                <div style={{ borderRadius: "12px", padding: "14px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                  <p style={{ fontSize: "11px", color: "#EF4444", fontFamily: "monospace", marginBottom: "4px" }}>quantum attack</p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#EF4444" }}>Derives key. Full access. Assets gone.</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* After */}
          <AnimateOnScroll from="right">
            <div
              className="card-hoverable"
              style={{
                borderRadius: "20px",
                padding: "28px",
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.15)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: "rgba(45,212,191,0.1)",
                  color: "#2DD4BF",
                  marginBottom: "22px",
                }}
              >
                With Quorion
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ borderRadius: "12px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-faint)", fontFamily: "monospace", marginBottom: "4px" }}>main wallet</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-faint)" }}>0 SOL (empty shell)</p>
                  <p style={{ fontSize: "12px", color: "var(--text-faint)", marginTop: "4px" }}>Attack succeeds. Finds nothing.</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "22px", color: "#2DD4BF" }}>↓</span>
                </div>
                <div style={{ borderRadius: "12px", padding: "14px 16px", background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.2)" }}>
                  <p style={{ fontSize: "11px", color: "#2DD4BF", fontFamily: "monospace", marginBottom: "4px" }}>quantum vault (PDA)</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>124.5 SOL (secured)</p>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                    <span className="pqc-badge">ML-DSA</span>
                    <span className="pqc-badge">SLH-DSA</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
