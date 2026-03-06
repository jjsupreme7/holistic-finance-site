"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Icon from "@/components/ui/Icon";
import { PILLARS } from "@/lib/constants";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function PillarsGrid() {
  return (
    <section className="py-24 px-6 bg-[#f8faff] relative overflow-hidden">
      <div className="float-blob w-72 h-72 bg-primary/10 top-10 -left-20" />
      <div className="container-site">
        <SectionHeader title="Our Approach" />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-3xl p-9 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary">
                <Icon name={pillar.icon} size={28} />
              </div>
              <h3 className="text-xl font-bold text-gradient mb-3">{pillar.title}</h3>
              <p className="text-text-light leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
