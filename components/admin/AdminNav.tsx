"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const navItems = [
  { label: "Dashboard", description: "Overview and quick actions", href: "/admin" },
  { label: "Analytics", description: "Traffic and conversions", href: "/admin/analytics" },
  {
    label: "Courses & Events",
    description: "Scheduled classes and community events",
    href: "/admin/schedule",
  },
  {
    label: "Curriculum",
    description: "Evergreen module groups and lessons",
    href: "/admin/training-modules",
  },
  { label: "Submissions", description: "Leads from the contact form", href: "/admin/submissions" },
  { label: "Blog", description: "Drafts and published articles", href: "/admin/blog" },
  {
    label: "Subscribers",
    description: "Email list growth and exports",
    href: "/admin/subscribers",
  },
  { label: "Campaigns", description: "Draft and sent email campaigns", href: "/admin/campaigns" },
];

interface AdminNavProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminNav({ mobileOpen = false, onClose }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onClose?.();
    router.push("/admin/login");
  };

  const renderContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <Link href="/admin" className="no-underline" onClick={onClose}>
            <h2 className="text-white font-bold text-sm">{SITE_NAME}</h2>
            <p className="text-white/50 text-xs mt-0.5">Admin Panel</p>
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block rounded-2xl px-4 py-3 no-underline transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p
                className={`mt-1 text-xs leading-5 ${
                  isActive ? "text-white/80" : "text-white/45"
                }`}
              >
                {item.description}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="block px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors no-underline mb-1"
        >
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer bg-transparent border-none"
        >
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-72 bg-dark min-h-screen flex-col shrink-0">
        {renderContent()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-dark/55"
            aria-label="Close navigation"
          />
          <aside className="relative z-10 flex h-full w-[88vw] max-w-xs flex-col bg-dark shadow-2xl">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
