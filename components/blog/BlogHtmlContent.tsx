"use client";

import { useMemo, useEffect, useState } from "react";

interface BlogHtmlContentProps {
  html: string;
}

// Content is sanitized with DOMPurify before rendering to prevent XSS.
// Only admin-authored blog content reaches this component.
export default function BlogHtmlContent({ html }: BlogHtmlContentProps) {
  const [purify, setPurify] = useState<typeof import("dompurify").default | null>(null);

  useEffect(() => {
    import("dompurify").then((mod) => setPurify(() => mod.default));
  }, []);

  const sanitizedHtml = useMemo(() => {
    if (!purify) return "";
    return purify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "br", "hr",
        "strong", "b", "em", "i", "u", "s", "del", "mark",
        "ul", "ol", "li",
        "blockquote",
        "a", "span",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class", "data-color"],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    });
  }, [html, purify]);

  if (!purify) return null;

  return (
    <div
      className="blog-html-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
