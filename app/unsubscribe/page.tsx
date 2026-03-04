"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing unsubscribe token.");
      return;
    }

    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f8faff]">
      <div className="glass rounded-3xl p-10 md:p-14 gradient-border glow-md text-center max-w-lg w-full">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-dark mb-2">Processing...</h1>
            <p className="text-text-light">Unsubscribing you from our mailing list.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Unsubscribed</h1>
            <p className="text-text-light mb-6">{message}</p>
            <p className="text-text-muted text-sm mb-6">
              We&apos;re sorry to see you go. If you change your mind, you can always resubscribe
              from our website.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-white font-bold py-3 px-8 rounded-full no-underline hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Oops</h1>
            <p className="text-text-light mb-6">{message}</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-white font-bold py-3 px-8 rounded-full no-underline hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
