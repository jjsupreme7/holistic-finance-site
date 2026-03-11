"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

interface CheckoutButtonProps {
  productSlug: string;
  productTitle: string;
  selectedSize?: string;
  requiresSize?: boolean;
  className?: string;
}

export default function CheckoutButton({
  productSlug,
  productTitle,
  selectedSize,
  requiresSize = false,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (requiresSize && !selectedSize) {
      setError("Select a size first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          size: selectedSize,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || `Unable to start checkout for ${productTitle}.`);
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout right now.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        <Icon name="shop" size={16} />
        {loading ? "Redirecting..." : "Buy with Stripe"}
      </button>
      {error ? <p className="text-sm text-[#8b2c2c]">{error}</p> : null}
    </div>
  );
}
