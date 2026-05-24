"use client";

import { useEffect, useRef, useState } from "react";

const getHiddenTransform = (from) => {
  switch (from) {
    case "left":   return "translateX(-52px) scale(0.97)";
    case "right":  return "translateX(52px) scale(0.97)";
    default:       return "translateY(28px) scale(0.98)";
  }
};

export default function AnimateOnScroll({
  children,
  className = "",
  style = {},
  delay = 0,
  from = "bottom",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) translateY(0) scale(1)" : getHiddenTransform(from),
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
