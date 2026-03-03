"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Icon from "@/components/ui/Icon";
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
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-gradient-gold">
      {prefix}{count}{suffix}
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function StatsCounter() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="float-blob w-72 h-72 bg-gold/10 -top-10 -left-20" />
      <div className="float-blob w-56 h-56 bg-primary/8 bottom-0 right-10" />
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="container-site grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="text-center"
          >
            <div className="text-primary mb-3 flex justify-center">
              <Icon name={stat.icon} size={28} />
            </div>
            <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            <p className="text-text-muted text-sm font-medium mt-2 uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
