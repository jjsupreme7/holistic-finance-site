"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/constants";

function AnimatedNumber({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-extralight text-background">
      {prefix}{count}{suffix}
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function StatsCounter() {
  return (
    <section className="section-dark py-24 px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container-site grid grid-cols-2 md:grid-cols-4 gap-px bg-background/10"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="bg-foreground text-center py-12 px-6"
          >
            <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            <p className="label text-background/50 mt-3">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
