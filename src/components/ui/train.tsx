"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const COPIES = 3; // [A][B][C] – we always stay inside B so it loops seamlessly

type Props = {
  children: ReactNode;
  label: string;
  /** auto-drift speed in px per second */
  speed?: number;
};

export function Train({ children, label, speed = 36 }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const items = Children.toArray(children);
  const s = useRef({ paused: false, drag: false, moved: false, startX: 0, startLeft: 0, pos: 0, visible: true, timer: 0 as number | ReturnType<typeof setTimeout> });

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const st = s.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.querySelectorAll("[data-clone]").forEach((node) => {
      node.setAttribute("inert", "");
      node.setAttribute("aria-hidden", "true");
    });

    const setW = () => el.scrollWidth / COPIES;
    const progress = () => {
      const w = setW();
      if (!w || !bar.current) return;
      const f = Math.min(1, Math.max(0, (el.scrollLeft - w) / w));
      bar.current.style.setProperty("--p", String(0.12 + 0.88 * f));
    };
    const wrap = () => {
      const w = setW();
      if (!w) return;
      const l = el.scrollLeft;
      if (l >= 2 * w) el.scrollLeft = l - w;
      else if (l < w - 2) el.scrollLeft = l + w;
      st.pos = el.scrollLeft;
    };

    el.scrollLeft = setW();
    st.pos = el.scrollLeft;
    progress();

    const onScroll = () => {
      wrap();
      progress();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!reduced && !st.paused && !st.drag && st.visible && document.visibilityState === "visible") {
        const w = setW();
        st.pos += (speed * dt) / 1000;
        if (w && st.pos >= 2 * w) st.pos -= w;
        el.scrollLeft = st.pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => (st.visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      clearTimeout(st.timer);
    };
  }, [speed]);

  const pause = () => {
    clearTimeout(s.current.timer);
    s.current.paused = true;
  };
  const resume = (delay = 0) => {
    clearTimeout(s.current.timer);
    s.current.timer = setTimeout(() => {
      const el = viewport.current;
      if (el) s.current.pos = el.scrollLeft;
      s.current.paused = false;
    }, delay);
  };

  const nudge = (dir: 1 | -1) => {
    const el = viewport.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-train-item]");
    const step = (card?.offsetWidth ?? 320) + 20;
    pause();
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    resume(2600);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) {
      pause();
      return;
    }
    const el = viewport.current!;
    const st = s.current;
    st.drag = true;
    st.moved = false;
    st.startX = e.clientX;
    st.startLeft = el.scrollLeft;
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (!st.drag) return;
    const el = viewport.current!;
    const dx = e.clientX - st.startX;
    if (!st.moved && Math.abs(dx) > 5) {
      st.moved = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    }
    if (st.moved) el.scrollLeft = st.startLeft - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    const el = viewport.current!;
    if (st.drag && st.moved && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    st.drag = false;
    el.classList.remove("is-dragging");
    if (e.pointerType !== "mouse") resume(2500);
  };

  return (
    <div className="train" onPointerEnter={(e) => e.pointerType === "mouse" && pause()} onPointerLeave={(e) => e.pointerType === "mouse" && !s.current.drag && resume(250)}>
      <div
        ref={viewport}
        className="train-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={() => {
          pause();
          resume(1500);
        }}
        onFocus={pause}
        onBlur={() => resume(400)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") nudge(1);
          if (e.key === "ArrowLeft") nudge(-1);
        }}
        onClickCapture={(e) => {
          if (s.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            s.current.moved = false;
          }
        }}
      >
        <div className="train-track">
          {Array.from({ length: COPIES }, (_, copy) =>
            items.map((child, i) => (
              <div className="train-item" data-train-item key={`${copy}-${i}`} {...(copy !== 1 ? { "data-clone": "" } : {})}>
                {child}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="train-controls">
        <span className="train-hint">Drag, swipe or use the arrows</span>
        <div className="train-progress" aria-hidden="true"><i ref={bar} /></div>
        <div className="train-buttons">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}
