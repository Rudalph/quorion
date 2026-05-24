import AnimateOnScroll from "./AnimateOnScroll";

const properties = [
  {
    label: "Byzantine Fault Tolerant",
    detail: "Even if one or two agents are compromised, the honest majority still produces the correct outcome.",
    color: "#8B5CF6",
  },
  {
    label: "One-Time Signatures",
    detail: "Agent voting keys use hash-based OTS: natively quantum safe, lightweight, and tamper-proof.",
    color: "#2DD4BF",
  },
  {
    label: "Everything On-Chain",
    detail: "Transaction intents locked in vault PDA. Votes stored on-chain. Non-custodial and censorship-resistant.",
    color: "#10B981",
  },
];

const agentVotes = [true, true, false, true, true];

export default function AgentVerification() {
  return (
    <section style={{ padding: "112px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <AnimateOnScroll>
            <span className="section-label" style={{ marginBottom: "16px" }}>Verification Layer</span>
            <h2
              className="font-heading"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 700,
                fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
                color: "#F0F0DB",
                lineHeight: 1.15,
                margin: "16px 0 20px",
              }}
            >
              Trust No Single Point.{" "}
              <span className="gradient-text">Trust The Network.</span>
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: 1.75, marginBottom: "28px" }}>
              Every transaction leaving your vault is verified by a decentralised network of
              automated agents. An odd number (five, seven, or nine), each independently verify
              every signature you selected. Every agent must confirm all algorithms pass.
              A majority vote decides whether the transaction proceeds.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {properties.map((p) => (
                <div
                  key={p.label}
                  className="card-hoverable"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: p.color,
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#F0F0DB", marginBottom: "3px" }}>
                      {p.label}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Right: visual */}
          <AnimateOnScroll delay={150}>
            <div
              className="glass-card"
              style={{ borderRadius: "20px", padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#4B5563" }}>
                  agent-dao-network
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "100px",
                    background: "rgba(16,185,129,0.1)",
                    color: "#10B981",
                  }}
                >
                  live
                </span>
              </div>

              {/* Transaction intent */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                <p style={{ fontSize: "11px", color: "#A78BFA", fontFamily: "monospace" }}>
                  transaction intent
                </p>
                <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                  locked in vault PDA · awaiting vote
                </p>
              </div>

              {/* Agent vote grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "8px",
                  marginBottom: "14px",
                }}
              >
                {agentVotes.map((vote, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: "10px",
                      padding: "10px 6px",
                      textAlign: "center",
                      background: vote ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${vote ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748B" }}>
                      A{i + 1}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        marginTop: "4px",
                        color: vote ? "#10B981" : "#EF4444",
                      }}
                    >
                      {vote ? "✓" : "✗"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Result */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "12px 16px",
                  background: "rgba(16,185,129,0.07)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                <p style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>
                  majority vote
                </p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#10B981", marginTop: "4px" }}>
                  4/5 TRUE · Transaction Proceeds
                </p>
              </div>

              <div
                style={{
                  borderRadius: "10px",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "11px", color: "#4B5563" }}>
                  Agent 3 compromised. Honest majority prevails.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
