"use client";

import FadeIn from "@/components/motion/FadeIn";

const credentials = [
  "M.S. Professional Accounting",
  "CPA Candidate",
  "Tax Preparer",
  "CPMA Certified",
  "11+ Years Experience",
  "Licensed Agent",
  "HIPAA Compliant",
];

export default function TrustLogos() {
  return (
    <section className="py-5 bg-muted border-y border-border">
      <div className="container-site">
        <FadeIn>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
            {credentials.map((cred, i) => (
              <div key={cred} className="flex items-center">
                <span className="label text-text-muted px-4 md:px-6">
                  {cred}
                </span>
                {i < credentials.length - 1 && (
                  <span className="hidden md:block w-px h-4 bg-border" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
