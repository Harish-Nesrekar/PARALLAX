"use client";

import { useEffect, useRef } from "react";

export function ParallaxGeometry() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        element.style.setProperty("--mx", `${x * 13}px`);
        element.style.setProperty("--my", `${y * 13}px`);
      });
    };

    const reset = () => {
      element.style.setProperty("--mx", "0px");
      element.style.setProperty("--my", "0px");
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", reset);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div className="geometry" ref={root} aria-label="Abstract layered geometry representing a shift in perspective">
      <div className="geometry-orbit" />
      <div className="geometry-plane plane-back" />
      <div className="geometry-plane plane-mid" />
      <div className="geometry-plane plane-front" />
      <div className="geometry-ring" />
      <div className="geometry-crosshair"><span /></div>
      <div className="geometry-spinner geometry-spinner-a"><i /></div>
      <div className="geometry-spinner geometry-spinner-b"><i /></div>
      <span className="geometry-index">Perspective · 2026</span>
    </div>
  );
}
