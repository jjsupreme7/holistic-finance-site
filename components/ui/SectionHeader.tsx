import FadeIn from "@/components/motion/FadeIn";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeader({ label, title, subtitle, align = "left", light }: SectionHeaderProps) {
  return (
    <FadeIn className={`mb-14 ${align === "center" ? "text-center" : ""}`}>
      {label && (
        <span className={`label block mb-4 ${light ? "text-background/50" : "text-text-muted"}`}>
          {label}
        </span>
      )}
      <h2 className={`heading-lg font-extralight mb-4 ${light ? "text-background" : ""}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : ""} ${light ? "text-background/60" : "text-text-secondary"}`}>
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
