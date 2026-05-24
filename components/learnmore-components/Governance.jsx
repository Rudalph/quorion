import AnimateOnScroll from "./AnimateOnScroll";

const proposalTypes = [
  {
    icon: "＋",
    label: "Add Algorithm",
    desc: "Propose a new algorithm to the supported set",
    color: "#10B981",
  },
  {
    icon: "⚑",
    label: "Deprecate Algorithm",
    desc: "Flag a compromised or weakened algorithm",
    color: "#F59E0B",
  },
  {
    icon: "⊙",
    label: "Change Default",
    desc: "Update the default signing algorithm policy",
    color: "#8B5CF6",
  },
  {
    icon: "◎",
    label: "Update Risk Score",
    desc: "Adjust the risk assessment of an algorithm",
    color: "#06B6D4",
  },
  {
    icon: "⏸",
    label: "Emergency Freeze",
    desc: "Halt all vault operations under active threat",
    color: "#EF4444",
  },
];

export default function Governance() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Left: DAO dashboard visual */}
          <AnimateOnScroll from="left">
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
                <span style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-faint)" }}>
                  governance-dao
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
                  5 proposal types
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {proposalTypes.map((p) => (
                  <div
                    key={p.label}
                    className="card-hoverable"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "9px",
                        background: `${p.color}18`,
                        border: `1px solid ${p.color}28`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        color: p.color,
                        flexShrink: 0,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {p.label}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-faint)", marginTop: "1px" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right: text */}
          <AnimateOnScroll from="right" delay={100}>
            <span className="section-label" style={{ marginBottom: "16px" }}>Governance DAO</span>
            <h2
              className="font-heading"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 700,
                fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
                color: "var(--text-primary)",
                lineHeight: 1.15,
                margin: "16px 0 20px",
              }}
            >
              Crypto Agility.{" "}
              <span style={{ color: "#A78BFA" }}>Built In.</span>
            </h2>
            <p style={{ color: "var(--text-body)", fontSize: "15px", lineHeight: 1.75, marginBottom: "16px" }}>
              No algorithm is safe forever. Quorion is built for the reality that today's
              post-quantum standards may need to change tomorrow. A decentralised human governance
              DAO manages the algorithm registry.
            </p>
            <p style={{ color: "var(--text-body)", fontSize: "15px", lineHeight: 1.75, marginBottom: "28px" }}>
              When NIST updates its standards, when researchers find new vulnerabilities, when the
              threat landscape changes: Quorion adapts. Without disruption. Without downtime.
              Without waiting for blockchain protocol updates.
            </p>

            <div
              style={{
                borderRadius: "14px",
                padding: "18px 20px",
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.15)",
              }}
            >
              <p style={{ fontSize: "13px", color: "#A78BFA", fontWeight: 600, marginBottom: "6px" }}>
                True Crypto Agility
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.65 }}>
                Not just quantum resistance today. The infrastructure to stay quantum
                resistant forever. No hard fork. No protocol changes. No ecosystem disruption.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
