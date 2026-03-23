"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function useUnsavedChangesGuard(isDirty: boolean) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleClickCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        isModifiedClick(event)
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      if (anchor.getAttribute("target") === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      const currentPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

      if (nextPath === currentPath) {
        return;
      }

      event.preventDefault();
      setPendingHref(nextPath);
    };

    document.addEventListener("click", handleClickCapture, true);

    return () => {
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [isDirty]);

  const continueNavigation = useCallback(() => {
    if (!pendingHref) {
      return;
    }

    const nextHref = pendingHref;
    setPendingHref(null);
    router.push(nextHref);
  }, [pendingHref, router]);

  const stayOnPage = useCallback(() => {
    setPendingHref(null);
  }, []);

  return {
    pendingHref,
    continueNavigation,
    stayOnPage,
  };
}
