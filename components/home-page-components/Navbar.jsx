"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(7, 10, 18, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #8B5CF6, #2DD4BF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              Q
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              fontSize: "18px",
              color: "#F0F0DB",
              letterSpacing: "-0.02em",
            }}
          >
            Quorion
          </span>
        </Link>

        <Link
          href="/transact"
          className="btn-primary"
          style={{ padding: "10px 22px", fontSize: "14px" }}
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
