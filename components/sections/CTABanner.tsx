import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";

interface CTABannerProps {
  title: string;
  text: string;
  buttonText: string;
  buttonHref?: string;
}

export default function CTABanner({
  title,
  text,
  buttonText,
  buttonHref = "/contact",
}: CTABannerProps) {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient-dark" />
      <div className="float-blob w-96 h-96 bg-primary/20 -top-32 -left-32" />
      <div className="float-blob w-64 h-64 bg-gold/10 bottom-0 right-10" />

      <FadeIn className="max-w-[800px] mx-auto text-center relative z-10">
        <div className="glass-dark rounded-3xl p-12 md:p-16">
          <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-5 leading-tight">{title}</h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">{text}</p>
          <Button href={buttonHref}>{buttonText}</Button>
        </div>
      </FadeIn>
    </section>
  );
}
