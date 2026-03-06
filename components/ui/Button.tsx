import Link from "next/link";

interface ButtonProps {
  href: string;
  variant?: "primary" | "outline" | "dark";
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export default function Button({ href, variant = "primary", children, className = "", external }: ButtonProps) {
  const base =
    "inline-block font-medium text-center transition-colors duration-200 no-underline text-sm uppercase tracking-[0.15em] px-8 py-3.5";

  const variants = {
    primary: "bg-accent text-foreground hover:bg-accent-dark",
    outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    dark: "border border-background text-background hover:bg-background hover:text-foreground",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
