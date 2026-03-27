"use client";

import { useState, useMemo, useEffect } from "react";
import AdminNotice from "@/components/admin/AdminNotice";
import { SITE_NAME } from "@/lib/constants";

interface CampaignEditorProps {
  initialSubject?: string;
  initialBodyHtml?: string;
  initialPreviewText?: string;
  onSave: (data: { subject: string; bodyHtml: string; previewText: string }) => Promise<void>;
  saving: boolean;
  readOnly?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}

export default function CampaignEditor({
  initialSubject = "",
  initialBodyHtml = "",
  initialPreviewText = "",
  onSave,
  saving,
  readOnly = false,
  onDirtyChange,
}: CampaignEditorProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [bodyHtml, setBodyHtml] = useState(initialBodyHtml);
  const [previewText, setPreviewText] = useState(initialPreviewText);
  const [sendingTest, setSendingTest] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [purify, setPurify] = useState<typeof import("dompurify").default | null>(null);
  const hasInitialContent = Boolean(initialSubject || initialBodyHtml || initialPreviewText);
  const saveLabel = saving
    ? "Saving Email Draft..."
    : hasInitialContent
      ? "Update Email Draft"
      : "Save Email Draft";

  useEffect(() => {
    import("dompurify").then((mod) => setPurify(() => mod.default));
  }, []);

  const initialSnapshot = useMemo(
    () =>
      JSON.stringify({
        subject: initialSubject,
        bodyHtml: initialBodyHtml,
        previewText: initialPreviewText,
      }),
    [initialBodyHtml, initialPreviewText, initialSubject]
  );
  const currentSnapshot = useMemo(
    () => JSON.stringify({ subject, bodyHtml, previewText }),
    [bodyHtml, previewText, subject]
  );
  const isDirty = currentSnapshot !== initialSnapshot;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const sanitizedHtml = useMemo(() => {
    const raw = bodyHtml || '<p style="color:#94a3b8;">Email body preview will appear here...</p>';
    return purify ? purify.sanitize(raw) : raw;
  }, [bodyHtml, purify]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !bodyHtml.trim()) {
      setValidationMessage("Subject and body are required before you save.");
      return;
    }
    setValidationMessage(null);
    await onSave({ subject, bodyHtml, previewText });
  };

  const handleSendTest = async () => {
    if (!subject || !bodyHtml) {
      setTestMessage("Subject and body are required.");
      return;
    }

    setSendingTest(true);
    setTestMessage("");

    try {
      const res = await fetch("/api/admin/campaigns/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, bodyHtml }),
      });

      const data = await res.json();
      setTestMessage(res.ok ? data.message : data.error);
    } catch {
      setTestMessage("Failed to send test email.");
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <form onSubmit={handleSave} className="space-y-4">
        {validationMessage && (
          <AdminNotice
            tone="error"
            message={validationMessage}
            onDismiss={() => setValidationMessage(null)}
          />
        )}

        <div>
          <label className="block text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-1.5">
            Subject Line
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={readOnly}
            placeholder="e.g. March Newsletter: Spring Financial Checkup"
            className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-1.5">
            Preview Text
          </label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            disabled={readOnly}
            placeholder="Short preview shown in inbox (optional)"
            className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-1.5">
            Body (HTML)
          </label>
          <textarea
            required
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            disabled={readOnly}
            rows={16}
            placeholder={`<h1 style="color:#2c5aa0;">Hello!</h1>\n<p>Your newsletter content here...</p>`}
            className="w-full px-4 py-3 rounded-xl border-2 border-border-light bg-admin-surface text-admin-text placeholder:text-admin-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-mono disabled:opacity-60 resize-y"
          />
        </div>

        {!readOnly && (
          <div className="space-y-3">
            <div className="flex gap-3 items-center flex-wrap">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-6 py-2.5 rounded-lg text-sm cursor-pointer border-none hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60"
              >
                {saveLabel}
              </button>

              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest}
                className="bg-admin-surface text-primary-light font-semibold px-5 py-2.5 rounded-lg text-sm border border-border-light hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-60"
              >
                {sendingTest ? "Sending..." : "Send Test Email"}
              </button>

              {testMessage && (
                <span className="text-sm text-admin-text-secondary">{testMessage}</span>
              )}
            </div>
            <p className="text-admin-text-secondary text-sm">
              Saving a draft does not email anyone. Campaigns only go out after you click the send
              button on the campaign page.
            </p>
            <p className="text-admin-text-secondary text-sm">
              {isDirty ? "You have unsaved edits in this email." : "All changes are saved."}
            </p>
          </div>
        )}
      </form>

      {/* Live Preview */}
      <div>
        <label className="block text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-1.5">
          Email Preview
        </label>
        <div className="bg-admin-card rounded-xl border border-border-light overflow-hidden">
          <div className="bg-admin-surface px-4 py-2 border-b border-border-light">
            <p className="text-xs text-admin-text-secondary">
              <strong>Subject:</strong> {subject || "(no subject)"}
            </p>
            {previewText && (
              <p className="text-xs text-admin-text-secondary truncate">
                <strong>Preview:</strong> {previewText}
              </p>
            )}
          </div>
          <div className="p-4">
            {/* Brand header */}
            <div
              style={{
                background: "#2c5aa0",
                padding: "16px 24px",
                textAlign: "center",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>
                {SITE_NAME}
              </span>
            </div>
            {/* Body - sanitized with DOMPurify */}
            <div
              className="text-sm p-4 border border-t-0 border-border-light"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
            {/* Footer */}
            <div
              style={{
                background: "#f0f4ff",
                padding: "12px 24px",
                textAlign: "center",
                fontSize: "10px",
                color: "#64748b",
                borderRadius: "0 0 8px 8px",
                border: "1px solid rgba(44,90,160,0.12)",
                borderTop: "none",
              }}
            >
              <p style={{ margin: 0 }}>
                7017 27th St W, Suite #6, University Place, WA 98466
              </p>
              <p style={{ margin: "4px 0 0", color: "#2c5aa0" }}>
                Unsubscribe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
