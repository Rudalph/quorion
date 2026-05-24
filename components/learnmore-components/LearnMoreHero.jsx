import AnimateOnScroll from "./AnimateOnScroll";

export default function LearnMoreHero() {
  return (
    <section style={{ padding: "100px 24px 80px", position: "relative", textAlign: "center" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <AnimateOnScroll from="bottom">
          <span className="section-label" style={{ marginBottom: "20px" }}>Deep Dive</span>
          <h1
            className="font-heading"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 6vw, 4rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
              margin: "20px 0 24px",
            }}
          >
            How Quorion Works
          </h1>
          <p
            style={{
              color: "var(--text-body)",
              fontSize: "17px",
              lineHeight: 1.75,
              maxWidth: "580px",
              margin: "0 auto",
            }}
          >
            The full technical picture. Six algorithms, a decentralised agent network,
            and a governance layer built to stay quantum-resistant forever.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
