"use client";

import { useState } from "react";
import { Menu, ChevronRight, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labelMap: Record<string, string> = {
    admin: "Admin",
    analytics: "Analytics",
    blog: "Blog",
    schedule: "Courses & Events",
    "training-modules": "Curriculum",
    submissions: "Submissions",
    subscribers: "Subscribers",
    campaigns: "Campaigns",
    new: "New",
    login: "Login",
  };

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = labelMap[seg] || (seg.length > 8 ? "Edit" : seg.charAt(0).toUpperCase() + seg.slice(1));
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("admin-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("admin-theme", next);
  };

  if (isLogin) {
    return <div data-admin-theme={theme}>{children}</div>;
  }

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div data-admin-theme={theme} className="flex min-h-screen bg-dark">
      <AdminNav mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between border-b border-border-light bg-admin-card px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-light bg-admin-surface text-admin-text-secondary transition-colors hover:bg-admin-hover hover:text-admin-text lg:hidden cursor-pointer"
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>

          <nav className="hidden sm:flex items-center text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center">
                {i > 0 && <ChevronRight size={14} className="mx-1.5 text-admin-text-secondary" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-admin-text font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-admin-text-secondary hover:text-admin-text transition-colors no-underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-light bg-admin-surface text-admin-text-secondary transition-colors hover:bg-admin-hover hover:text-admin-text cursor-pointer"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
