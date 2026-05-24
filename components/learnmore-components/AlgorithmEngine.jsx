import AnimateOnScroll from "./AnimateOnScroll";

const algorithms = [
  {
    name: "Ed25519",
    desc: "Solana native default",
    detail: "Fast, lightweight, battle-tested elliptic curve signature scheme. Every Solana transaction uses this today.",
    phase: "Deposit + Transfer",
    pqc: false,
    standard: null,
    from: "left",
  },
  {
    name: "ECDSA secp256k1",
    desc: "Ethereum compatible",
    detail: "The same elliptic curve used by Ethereum and Bitcoin. Brings cross-chain familiarity to the vault.",
    phase: "Transfer only",
    pqc: false,
    standard: null,
    from: "bottom",
  },
  {
    name: "Schnorr secp256k1",
    desc: "Bitcoin Taproot",
    detail: "Enables signature aggregation and linear multi-sig. Used in Bitcoin Taproot for compact, private scripts.",
    phase: "Transfer only",
    pqc: false,
    standard: null,
    from: "right",
  },
  {
    name: "RSA-PSS",
    desc: "Classical standard",
    detail: "Based on integer factorisation. Widely deployed and well-understood. Included for institutional compatibility.",
    phase: "Transfer only",
    pqc: false,
    standard: null,
    from: "left",
  },
  {
    name: "ML-DSA",
    desc: "Dilithium · Lattice-based",
    detail: "Structured lattice cryptography. Shor's algorithm cannot touch it. Selected by NIST as the primary PQC signature standard.",
    phase: "Deposit + Transfer",
    pqc: true,
    standard: "NIST FIPS 204",
    from: "bottom",
  },
  {
    name: "SLH-DSA",
    desc: "SPHINCS+ · Hash-based",
    detail: "Security based only on hash function properties. Conservative assumptions. Quantum safe by mathematical design.",
    phase: "Deposit + Transfer",
    pqc: true,
    standard: "NIST FIPS 205",
    from: "right",
  },
];

export default function AlgorithmEngine() {
  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <AnimateOnScroll style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="section-label" style={{ marginBottom: "16px" }}>Algorithm Engine</span>
          <h2
            className="font-heading"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.15,
              margin: "16px 0 16px",
            }}
          >
            Six Algorithms.{" "}
            <span style={{ color: "var(--text-muted)" }}>One Non-Negotiable Rule.</span>
          </h2>
          <p style={{ color: "var(--text-body)", maxWidth: "520px", margin: "0 auto", fontSize: "15px", lineHeight: 1.75 }}>
            At least one post-quantum algorithm must always be present. No transaction leaves
            the vault without it.
          </p>
        </AnimateOnScroll>

        <div
          className="grid-interactive algo-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {algorithms.map((algo, i) => (
            <AnimateOnScroll key={algo.name} delay={i * 70} from={algo.from}>
              <div
                className="card-hoverable"
                style={{
                  borderRadius: "18px",
                  padding: "24px",
                  height: "100%",
                  background: algo.pqc ? "rgba(45,212,191,0.04)" : "rgba(255,255,255,0.025)",
                  border: algo.pqc
                    ? "1px solid rgba(45,212,191,0.2)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: algo.pqc ? "0 0 30px rgba(45,212,191,0.04)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <p
                      className="font-heading"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: algo.pqc ? "#2DD4BF" : "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {algo.name}
                    </p>
                    <p style={{ fontSize: "11px", color: algo.pqc ? "#0D9488" : "var(--text-faint)" }}>
                      {algo.desc}
                    </p>
                  </div>
                  {algo.pqc && (
                    <span className="pqc-badge" style={{ flexShrink: 0 }}>
                      QR
                    </span>
                  )}
                </div>

                <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.65, marginBottom: "16px" }}>
                  {algo.detail}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 10px",
                      borderRadius: "100px",
                      background: algo.pqc ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.05)",
                      color: algo.pqc ? "#2DD4BF" : "var(--text-faint)",
                    }}
                  >
                    {algo.phase}
                  </span>
                  {algo.standard && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#0D9488",
                        fontFamily: "monospace",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {algo.standard}
                    </span>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={200}>
          <div
            style={{
              marginTop: "16px",
              borderRadius: "16px",
              padding: "20px 24px",
              background: "rgba(139,92,246,0.05)",
              border: "1px solid rgba(139,92,246,0.14)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(139,92,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              ⚡
            </div>
            <p style={{ color: "var(--text-body)", fontSize: "14px", lineHeight: 1.65 }}>
              Classical algorithms provide compatibility during the industry transition period.
              Post-quantum algorithms provide the guarantee that{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                no quantum computer can ever forge your signature.
              </span>
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
