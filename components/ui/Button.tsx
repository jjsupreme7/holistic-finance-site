import Link from "next/link";

interface ButtonProps {
  href: string;
  variant?: "gold" | "outline" | "primary";
  children: React.ReactNode;
  className?: string;
}

export default function Button({ href, variant = "gold", children, className = "" }: ButtonProps) {
  const base =
    "inline-block font-bold text-center rounded-full transition-all duration-300 no-underline";

  const variants = {
    gold: "bg-gradient-to-r from-gold to-gold-dark text-dark px-8 py-3.5 text-[1.05rem] hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-1",
    outline:
      "border border-primary/30 text-primary px-6 py-2.5 hover:bg-primary/5 hover:border-primary/50 hover:-translate-y-0.5 backdrop-blur-sm",
    primary:
      "bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3.5 text-[1.05rem] hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1",
  };

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
