import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function LearnMoreFooter() {
  return (
    <>
      <section style={{ padding: "100px 24px 80px", position: "relative", textAlign: "center" }}>
        <div className="divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />

        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
          <AnimateOnScroll>
            <h2
              className="font-heading"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                color: "var(--text-primary)",
                lineHeight: 1.15,
                marginBottom: "16px",
              }}
            >
              Ready to secure your assets?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                fontSize: "16px",
                lineHeight: 1.7,
                marginBottom: "40px",
              }}
            >
              Three steps. Three minutes. Quantum safe.
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/transactions" className="btn-primary">
                Get Started
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

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
