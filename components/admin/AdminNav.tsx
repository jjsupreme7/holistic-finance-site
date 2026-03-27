"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LayoutDashboard, BarChart2, FileText, Calendar, GraduationCap, Inbox, Users, Send, LogOut, ExternalLink } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Courses & Events", href: "/admin/schedule", icon: Calendar },
      { label: "Curriculum", href: "/admin/training-modules", icon: GraduationCap },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Submissions", href: "/admin/submissions", icon: Inbox },
      { label: "Subscribers", href: "/admin/subscribers", icon: Users },
      { label: "Campaigns", href: "/admin/campaigns", icon: Send },
    ],
  },
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

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <div className="h-16 px-5 flex items-center border-b border-border-light shrink-0">
        <Link href="/admin" className="no-underline flex items-center gap-3" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">HF</span>
          </div>
          <div>
            <p className="text-admin-text font-semibold text-sm leading-tight">
              {SITE_NAME.split(" ").slice(0, 2).join(" ")}
            </p>
            <p className="text-admin-text-secondary text-[10px] leading-tight">Admin Panel</p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-light bg-admin-surface text-admin-text-secondary transition-colors hover:bg-admin-hover hover:text-admin-text lg:hidden cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-admin-text-secondary">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-admin-text-secondary hover:bg-admin-hover hover:text-admin-text"
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border-light space-y-0.5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-admin-text-secondary hover:text-admin-text hover:bg-admin-hover transition-colors no-underline"
        >
          <ExternalLink size={16} className="shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-admin-text-secondary hover:text-admin-text hover:bg-admin-hover transition-colors cursor-pointer bg-transparent border-none text-left"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-admin-card border-r border-border-light min-h-screen flex-col shrink-0">
        {renderContent()}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
          />
          <aside className="relative z-10 flex h-full w-[85vw] max-w-[280px] flex-col bg-admin-card shadow-2xl">
            {renderContent()}
          </aside>
        </div>
      )}
    </>
  );
}
