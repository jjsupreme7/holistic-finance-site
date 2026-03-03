import FadeIn from "@/components/motion/FadeIn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, light }: SectionHeaderProps) {
  return (
    <FadeIn className="text-center mb-14">
      <h2 className={`text-[2.25rem] font-bold mb-4 ${light ? "text-white" : "text-gradient"}`}>
        {title}
      </h2>
      <div className={`w-20 h-1 mx-auto mb-5 rounded-full ${light ? "bg-gradient-to-r from-gold to-gold-light" : "bg-gradient-to-r from-primary to-primary-light"}`} />
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${light ? "text-white/70" : "text-text-light"}`}>
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
