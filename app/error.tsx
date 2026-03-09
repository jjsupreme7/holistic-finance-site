"use client";

import Button from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="heading-lg font-extralight text-foreground mb-4">Something went wrong</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 border border-foreground text-foreground text-sm uppercase tracking-[0.15em] font-medium cursor-pointer bg-transparent hover:bg-foreground hover:text-background transition-colors"
          >
            Try Again
          </button>
          <Button href="/">Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
