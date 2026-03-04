"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/layout/StickyCTA";
import BackToTop from "@/components/ui/BackToTop";
import PageTransition from "@/components/motion/PageTransition";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isUnsubscribe = pathname.startsWith("/unsubscribe");

  if (isAdmin || isUnsubscribe) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <StickyCTA />
      <BackToTop />
    </>
  );
}
