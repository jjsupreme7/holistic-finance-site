import Link from "next/link";
import { SITE_NAME, CONTACT, SOCIAL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" role="contentinfo">
      <div className="mesh-gradient-dark pt-16 pb-0">
        {/* Floating orbs */}
        <div className="float-blob w-72 h-72 bg-primary/20 -top-20 -left-20" />
        <div className="float-blob w-56 h-56 bg-gold/10 -bottom-10 right-20" />

        <div className="relative z-10 container-site grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-12">
          <div>
            <h4 className="text-white text-lg mb-4 font-bold">{SITE_NAME}</h4>
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-medium text-primary-light bg-primary/15 px-3 py-1 rounded-full border border-primary/20">
                Financial Planning
              </span>
              <span className="text-xs font-medium text-gold-light bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Investment Strategies
              </span>
            </div>
            <p className="italic text-xs text-white/60 leading-relaxed">
              Holistic Health &amp; Finance provides insurance and financial planning services.
              Mortgage, tax preparation, investment advisory, and legal services are provided
              through appropriately licensed professionals and strategic partners.
            </p>
          </div>

          <div>
            <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-5">Company</h4>
            <ul className="list-none space-y-3 text-sm">
              {[
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Events", href: "/events" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 no-underline hover:text-gold transition-all hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-5">Legal</h4>
            <ul className="list-none space-y-3 text-sm">
              <li><span className="text-white/60 cursor-default">Privacy Policy</span></li>
              <li><span className="text-white/60 cursor-default">Terms and Conditions</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-5">Contact</h4>
            <ul className="list-none space-y-3 text-sm">
              <li>
                <a href={CONTACT.phoneTel} className="text-white/60 no-underline hover:text-gold transition-colors">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="text-white/60 no-underline hover:text-gold transition-colors break-all text-xs">
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-white/60 text-xs">{CONTACT.address}</li>
              <li className="flex gap-3 pt-2">
                {[
                  { label: "Facebook", href: SOCIAL.facebook },
                  { label: "Instagram", href: SOCIAL.instagram },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit us on ${s.label}`}
                    className="text-white/60 text-xs no-underline hover:text-gold transition-all border border-white/10 px-3 py-1 rounded-full hover:border-gold/30"
                  >
                    {s.label}
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 text-center py-5 text-xs text-white/60">
          &copy; 2026 {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
