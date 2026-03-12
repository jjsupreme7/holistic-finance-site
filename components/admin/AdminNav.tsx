"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Schedule", href: "/admin/schedule" },
  { label: "Training Modules", href: "/admin/training-modules" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Subscribers", href: "/admin/subscribers" },
  { label: "Campaigns", href: "/admin/campaigns" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-dark min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="no-underline">
          <h2 className="text-white font-bold text-sm">{SITE_NAME}</h2>
          <p className="text-white/50 text-xs mt-0.5">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                isActive
                  ? "bg-primary text-white font-semibold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
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
    </aside>
  );
}
