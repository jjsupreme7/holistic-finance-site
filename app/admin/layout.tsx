"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-dark">
      <AdminNav mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-light bg-admin-card/90 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-secondary">
              Admin
            </p>
            <p className="text-sm font-semibold text-admin-text">Manage site content</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-light bg-admin-surface text-admin-text transition-colors hover:bg-admin-hover"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
