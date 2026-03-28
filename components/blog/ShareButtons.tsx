"use client";

import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

const btnClass =
  "border border-border text-text-muted text-xs px-3 py-1.5 hover:border-accent hover:text-accent transition-colors bg-transparent cursor-pointer";

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function shareOnX() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(
      `https://x.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted text-xs mr-1">Share</span>
      <button onClick={shareOnX} className={btnClass} type="button">
        X
      </button>
      <button onClick={shareOnFacebook} className={btnClass} type="button">
        Facebook
      </button>
      <button onClick={shareOnLinkedIn} className={btnClass} type="button">
        LinkedIn
      </button>
      <button onClick={copyLink} className={btnClass} type="button">
        <span className="inline-flex items-center gap-1">
          <LinkIcon size={12} />
          {copied ? "Copied!" : "Copy Link"}
        </span>
      </button>
    </div>
  );
}
