import FadeIn from "@/components/motion/FadeIn";

export default function MissionStatement() {
  return (
    <section className="relative py-20 px-6 mesh-gradient overflow-hidden">
      <div className="float-blob w-64 h-64 bg-primary/10 top-0 right-0" />
      <FadeIn className="max-w-3xl mx-auto text-center relative z-10">
        <div className="glass rounded-3xl p-10 md:p-14 gradient-border glow-sm">
          <div className="text-3xl mb-5">&#10077;</div>
          <p className="font-heading italic text-2xl md:text-3xl text-dark leading-relaxed mb-4">
            No family left behind &mdash; everyone deserves a financial education and planning.
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-gold mx-auto mb-4 rounded-full" />
          <p className="text-text-muted text-sm uppercase tracking-widest font-medium">
            Our guiding principle
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
