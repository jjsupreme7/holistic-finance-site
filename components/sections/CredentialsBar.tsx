"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Icon from "@/components/ui/Icon";
import { CREDENTIALS } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function CredentialsBar() {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-dark">
      <div className="float-blob w-80 h-80 bg-primary/30 -top-20 right-20" />
      <div className="float-blob w-56 h-56 bg-gold/10 bottom-0 -left-10" />

      <div className="container-site">
        <SectionHeader title="Why Trust Us" light />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {CREDENTIALS.map((cred) => (
            <motion.div
              key={cred.label}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-dark gradient-border rounded-2xl p-6 text-center"
            >
              <div className="text-gold mb-3 flex justify-center">
                <Icon name={cred.icon} size={28} />
              </div>
              <div className="font-bold text-white text-sm mb-1">{cred.label}</div>
              <div className="text-xs text-white/50">{cred.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
