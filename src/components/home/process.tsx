"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const steps = [
  ["Discover", "Understand the business problem and the people affected."],
  ["Define", "Agree on requirements, priorities and architecture."],
  ["Design", "Shape an experience that feels clear and intuitive."],
  ["Develop", "Build, test and refine the solution."],
  ["Deliver", "Prepare, deploy and launch with care."],
  ["Evolve", "Support, improve and scale as needs change."]
] as const;

const LAST = steps.length - 1;
const STEP_MS = 1000;

export function Process({ heading = true }: { heading?: boolean }) {
  const [active, setActive] = useState(-1); // last lit node
  const [current, setCurrent] = useState(-1); // hovered / focused node
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const leave = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const start = useCallback(() => {
    if (leave.current) clearTimeout(leave.current);
    if (timer.current) return;
    setActive((a) => (a < 0 ? 0 : a));
    timer.current = setInterval(() => setActive((a) => Math.min(a + 1, LAST)), STEP_MS);
  }, []);

  const reset = () => {
    stop();
    setActive(-1);
    setCurrent(-1);
  };

  // stop ticking once the last dot is lit
  useEffect(() => {
    if (active >= LAST) stop();
  }, [active]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(LAST);
      return;
    }
    // touch devices have no hover: play once when the journey scrolls into view
    if (window.matchMedia("(hover: none)").matches && root.current) {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        },
        { threshold: 0.55 }
      );
      io.observe(root.current);
      return () => io.disconnect();
    }
    return () => {
      stop();
      if (leave.current) clearTimeout(leave.current);
    };
  }, [start]);

  const onLeave = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    leave.current = setTimeout(reset, 450);
  };

  return (
    <section className="section process-section" id="process">
      <div className="container">
        {heading && (
          <div className="process-head">
            <span className="eyebrow">How we work</span>
            <h2>From first thought<br />to <em>what&apos;s next.</em></h2>
          </div>
        )}
        <div
          ref={root}
          className={`journey${active >= 0 ? " is-playing" : ""}`}
          onPointerEnter={start}
          onPointerLeave={onLeave}
          onFocus={start}
        >
          <ol className="journey-track">
            {steps.map(([title, description], i) => {
              const lit = i <= active;
              return (
                <li
                  key={title}
                  tabIndex={0}
                  className={`journey-step${lit ? " is-lit" : ""}${i === current ? " is-current" : ""}`}
                  onPointerEnter={() => setCurrent(i)}
                  onFocus={() => setCurrent(i)}
                  onBlur={() => setCurrent(-1)}
                >
                  <span className="journey-node" aria-hidden="true">
                    <span className="journey-ring" />
                    <span className="journey-dot" />
                  </span>
                  {i < LAST && (
                    <span className={`journey-link${i < active ? " is-drawn" : ""}`} aria-hidden="true">
                      <b />
                    </span>
                  )}
                  <span className="journey-index">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              );
            })}
          </ol>
          <p className="journey-hint" aria-hidden="true"><i /> Hover to trace the journey</p>
        </div>
      </div>
    </section>
  );
}
