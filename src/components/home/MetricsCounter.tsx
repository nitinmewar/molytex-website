"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Metric = {
  target: number | null;
  suffix: string;
  staticText: string | null;
  label: string;
};

const metrics: Metric[] = [
  { target: 10, suffix: "+", staticText: null, label: "Product Categories" },
  { target: 50, suffix: "+", staticText: null, label: "Healthcare Partners" },
  { target: null, suffix: "", staticText: "Pan-India", label: "Distribution Network" },
  { target: 100, suffix: "%", staticText: null, label: "Quality Commitment" },
  { target: null, suffix: "", staticText: "Growing", label: "Institutional Presence" },
];

/* ------------------------------------------------------------------ */
/*  Counter hook                                                       */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, running: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!running) return;

    const mq =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) {
      setValue(target);
      return;
    }

    let start: number | null = null;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [running, target, duration]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Single metric cell                                                 */
/* ------------------------------------------------------------------ */

function MetricCell({
  metric,
  animate,
}: {
  metric: Metric;
  animate: boolean;
}) {
  const count = useCountUp(metric.target ?? 0, animate && metric.target !== null);

  if (metric.staticText === "Pan-India") {
    return (
      <div className="metric">
        <div className="num">Pan<span className="grn">-</span>India</div>
        <div className="label">{metric.label}</div>
      </div>
    );
  }

  if (metric.staticText !== null) {
    return (
      <div className="metric">
        <div className="num">{metric.staticText}</div>
        <div className="label">{metric.label}</div>
      </div>
    );
  }

  return (
    <div className="metric">
      <div className="num">
        <span>{count}</span>
        <span className="grn">{metric.suffix}</span>
      </div>
      <div className="label">{metric.label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function MetricsCounter() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) setVisible(true);
    },
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <section ref={ref} className="metrics">
      <div className="wrap">
        <div className="metrics-grid">
          {metrics.map((m) => (
            <MetricCell key={m.label} metric={m} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
