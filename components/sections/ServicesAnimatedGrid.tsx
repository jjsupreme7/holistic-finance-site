"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function titleToId(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

interface Service {
  icon: string;
  title: string;
  price: string;
  description: string;
}

interface ServicesAnimatedGridProps {
  services: Service[];
  bookingUrl: string;
}

export default function ServicesAnimatedGrid({ services, bookingUrl }: ServicesAnimatedGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
    >
      {services.map((service) => (
        <motion.div
          key={service.title}
          id={titleToId(service.title)}
          variants={item}
          className="bg-background p-6 group hover:bg-muted transition-colors"
        >
          <div className="text-text-muted mb-4">
            <Icon name={service.icon} size={28} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-foreground">{service.title}</h3>
          </div>
          <span className={`text-xs font-medium px-3 py-1 inline-block mb-3 ${
            service.price === "Free Quote"
              ? "bg-success/10 text-success"
              : "bg-accent/10 text-accent-dark"
          }`}>
            {service.price}
          </span>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {service.description}
          </p>
          <Button href={bookingUrl} external variant="outline" className="text-xs w-full text-center">
            Get Started
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
