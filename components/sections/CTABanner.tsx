import Image from "next/image";
import FadeIn from "@/components/motion/FadeIn";
import Button from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";

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
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-dark to-[#1a3530]">
      <div className="float-blob w-96 h-96 bg-primary/30 -top-32 -left-32" />
      <div className="float-blob w-64 h-64 bg-gold/10 bottom-0 right-10" />

      <FadeIn className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-white mb-5 leading-tight">{title}</h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">{text}</p>
            <Button href={buttonHref}>{buttonText}</Button>
          </div>
          <div className="hidden md:block">
            <div className="gradient-border glow-md rounded-2xl">
              <Image
                src={IMAGES.bgCoast}
                alt="Financial consultation"
                width={500}
                height={375}
                className="rounded-2xl opacity-80"
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
