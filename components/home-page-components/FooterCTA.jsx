import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function FooterCTA() {
  return (
    <>
      <section style={{ padding: "120px 24px 96px", position: "relative", textAlign: "center" }}>
        <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

        {/* Background glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto" }}>
          <AnimateOnScroll>
            <h2
              className="font-heading"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                color: "var(--text-primary)",
                lineHeight: 1.12,
                marginBottom: "16px",
              }}
            >
              The quantum threat is not waiting.
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                fontSize: "16px",
                lineHeight: 1.7,
                marginBottom: "40px",
              }}
            >
              Move your assets into a Quantum Vault today. Three steps. Three minutes.
            </p>

            {/* Two buttons */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/transactions" className="btn-primary">
                Get Started
              </Link>
              <Link href="/learnmore" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer bar */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 24px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #8B5CF6, #2DD4BF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "11px", fontFamily: "var(--font-space-grotesk)" }}>Q</span>
            </div>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
              Quorion
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-faint)", textAlign: "center" }}>
            Blockchain x Quantum Hackathon · Dogpatch Labs, Dublin · May 2026
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            <span className="pqc-badge" style={{ fontSize: "9px" }}>NIST FIPS 204</span>
            <span className="pqc-badge" style={{ fontSize: "9px" }}>NIST FIPS 205</span>
          </div>
        </div>
      </footer>
    </>
  );
}
