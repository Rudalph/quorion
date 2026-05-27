import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* Glow orbs — kept subtle, no grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "5%",
          left: "0%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Two-column layout */}
      <div
        className="hero-grid"
        style={{
          position: "relative",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* LEFT: text */}
        <div>
          {/* Monospace identifier — replaces badge pill */}
          <p
            className="animate-hero-1"
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#374151",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "36px",
            }}
          >
            Quantum Vault · Built on Solana
          </p>

          {/* Headline — NO gradient, pure typographic contrast */}
          <h1
            className="font-heading animate-hero-2"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              marginBottom: "0",
            }}
          >
            {/* First statement: large, bright */}
            <span
              style={{
                display: "block",
                fontSize: "clamp(3rem, 6.5vw, 5.2rem)",
                color: "#F0F0DB",
              }}
            >
              Quantum computers
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(3rem, 6.5vw, 5.2rem)",
                color: "#F0F0DB",
                marginBottom: "20px",
              }}
            >
              are coming.
            </span>

            {/* Divider — thin rule instead of color/gradient */}
            <span
              style={{
                display: "block",
                width: "48px",
                height: "2px",
                background: "#374151",
                marginBottom: "20px",
              }}
            />

            {/* Second statement: smaller, muted — hierarchy through size + weight, not color */}
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                color: "#4B5563",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Your wallet is not ready.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="animate-hero-3"
            style={{
              fontSize: "15px",
              color: "#64748B",
              maxWidth: "480px",
              marginTop: "32px",
              marginBottom: "40px",
              lineHeight: 1.75,
            }}
          >
            Quorion moves your assets into an on-chain Quantum Vault, protected by
            post-quantum cryptography that no quantum computer can break. Your visible
            wallet stays empty. Your real assets stay safe.
          </p>

          {/* CTA */}
          <div className="animate-hero-4" style={{ marginTop: "40px" }}>
            <Link href="/transact" className="btn-primary" style={{ display: "inline-flex" }}>
              Get Started
            </Link>
            <p
              style={{
                fontSize: "12px",
                color: "#374151",
                fontFamily: "monospace",
                marginTop: "14px",
              }}
            >
              No changes to Solana required
            </p>
          </div>
        </div>

        {/* RIGHT: terminal card */}
        <div className="animate-hero-5">
          <div
            className="glass-card"
            style={{
              borderRadius: "20px",
              padding: "22px 24px",
              boxShadow: "0 0 60px rgba(139,92,246,0.07), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "18px",
                paddingBottom: "14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(239,68,68,0.5)" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(34,197,94,0.5)" }} />
              <span style={{ fontSize: "11px", color: "#374151", fontFamily: "monospace", marginLeft: "8px" }}>
                quantum-vault.sol
              </span>
            </div>

            {/* Vault state rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontFamily: "monospace", fontSize: "13px" }}>
              <div>
                <p style={{ fontSize: "10px", color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Deposit signatures required
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#94A3B8" }}>Ed25519</span>
                    <span style={{ color: "#10B981", fontSize: "12px" }}>✓ signed</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#2DD4BF" }}>ML-DSA</span>
                    <span style={{ color: "#10B981", fontSize: "12px" }}>✓ signed</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#2DD4BF" }}>SLH-DSA</span>
                    <span style={{ color: "#10B981", fontSize: "12px" }}>✓ signed</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "14px",
                }}
              >
                <p style={{ fontSize: "10px", color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                  Main wallet balance
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#4B5563" }}>visible balance</span>
                  <span style={{ color: "#4B5563", fontSize: "12px" }}>0 SOL</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                  <span style={{ color: "#F0F0DB" }}>vault balance</span>
                  <span style={{ color: "#F0F0DB", fontSize: "12px" }}>124.5 SOL</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#4B5563", fontSize: "12px" }}>vault status</span>
                <span className="pqc-badge">quantum safe</span>
              </div>
            </div>
          </div>

          {/* Small note below card */}
          <p
            style={{
              fontSize: "11px",
              color: "#374151",
              fontFamily: "monospace",
              marginTop: "14px",
              textAlign: "center",
              letterSpacing: "0.05em",
            }}
          >
            NIST FIPS 204 · NIST FIPS 205 · Solana Devnet
          </p>
        </div>
      </div>
    </section>
  );
}
