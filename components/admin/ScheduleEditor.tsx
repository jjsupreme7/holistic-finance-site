"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/constants";
import { COURSE_ICONS, type CourseScheduleType, type ScheduleKind, type ScheduleStatus } from "@/lib/schedule";

interface ScheduleEditorProps {
  onSave: (data: {
    kind: ScheduleKind;
    status: ScheduleStatus;
    title: string;
    icon: string;
    scheduleType: CourseScheduleType;
    priceLabel: string;
    duration: string;
    format: string;
    dateLabel: string;
    timeLabel: string;
    description: string;
    location: string;
    sponsor: string;
    contactLabel: string;
    highlightsText: string;
    sortOrder: number;
  }) => void;
  saving: boolean;
  initialData?: {
    kind: ScheduleKind;
    status: ScheduleStatus;
    title: string;
    icon?: string | null;
    scheduleType?: string | null;
    priceLabel?: string | null;
    duration?: string | null;
    format?: string | null;
    dateLabel: string;
    timeLabel?: string | null;
    description: string;
    location?: string | null;
    sponsor?: string | null;
    contactLabel?: string | null;
    highlights?: string[] | null;
    sortOrder: number;
  };
}

export default function ScheduleEditor({
  onSave,
  saving,
  initialData,
}: ScheduleEditorProps) {
  const [kind, setKind] = useState<ScheduleKind>(initialData?.kind || "course");
  const [status, setStatus] = useState<ScheduleStatus>(initialData?.status || "published");
  const [title, setTitle] = useState(initialData?.title || "");
  const [icon, setIcon] = useState(initialData?.icon || "finance");
  const [scheduleType, setScheduleType] = useState<CourseScheduleType>(
    initialData?.scheduleType === "paid" ? "paid" : "free"
  );
  const [priceLabel, setPriceLabel] = useState(initialData?.priceLabel || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [format, setFormat] = useState(initialData?.format || "");
  const [dateLabel, setDateLabel] = useState(initialData?.dateLabel || "");
  const [timeLabel, setTimeLabel] = useState(initialData?.timeLabel || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [sponsor, setSponsor] = useState(initialData?.sponsor || "");
  const [contactLabel, setContactLabel] = useState(initialData?.contactLabel || CONTACT.phone);
  const [highlightsText, setHighlightsText] = useState(
    initialData?.highlights?.join("\n") || ""
  );
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const isEditing = !!initialData;

  const kindLabel = kind === "course" ? "Course" : "Event";
  const submitLabel = saving
    ? status === "published"
      ? `Publishing ${kindLabel}...`
      : "Saving Draft..."
    : !isEditing
      ? status === "published"
        ? `Publish ${kindLabel}`
        : `Save ${kindLabel} Draft`
      : status === "published" && initialData?.status !== "published"
        ? `Publish ${kindLabel}`
        : status === "draft"
          ? `Save ${kindLabel} Draft`
          : `Update ${kindLabel}`;

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-border-light bg-white text-dark placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !dateLabel.trim() || !description.trim()) {
      alert("Title, date label, and description are required.");
      return;
    }

    if (kind === "course" && (!duration.trim() || !format.trim())) {
      alert("Course duration and format are required.");
      return;
    }

    if (kind === "event" && (!timeLabel.trim() || !location.trim())) {
      alert("Event time and location are required.");
      return;
    }

    onSave({
      kind,
      status,
      title,
      icon,
      scheduleType,
      priceLabel,
      duration,
      format,
      dateLabel,
      timeLabel,
      description,
      location,
      sponsor,
      contactLabel,
      highlightsText,
      sortOrder,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-border-light p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Kind</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as ScheduleKind)}
              className={inputClass}
            >
              <option value="course">Course</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <p className="text-text-muted text-xs mt-2">
              {status === "published"
                ? `${kindLabel}s with published status appear on the public website.`
                : `${kindLabel} drafts stay hidden until you publish them.`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === "course" ? "Budgeting Basics" : "Community Workshop"}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">
              Date Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="March 22, 2026"
              className={inputClass}
              required
            />
          </div>

          {kind === "event" ? (
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="1:30 PM"
                className={inputClass}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Course Type
              </label>
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value as CourseScheduleType)}
                className={inputClass}
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          )}
        </div>

        {kind === "course" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Icon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className={inputClass}
                >
                  {COURSE_ICONS.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="1 hour"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">
                  Format <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  placeholder="Zoom Webinar"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {scheduleType === "paid" && (
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Price Label</label>
                <input
                  type="text"
                  value={priceLabel}
                  onChange={(e) => setPriceLabel(e.target.value)}
                  placeholder="$29"
                  className={inputClass}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="7017 27th St W, Suite 6, University Place, WA 98466"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Hosted By</label>
                <input
                  type="text"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="HHF Young Entrepreneur Group"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">Contact Label</label>
              <input
                type="text"
                value={contactLabel}
                onChange={(e) => setContactLabel(e.target.value)}
                placeholder={CONTACT.phone}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark mb-1.5">
                Highlights
              </label>
              <textarea
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                rows={4}
                placeholder={"Cash only\nFamily-friendly event\nCommunity market"}
                className={`${inputClass} resize-y`}
              />
              <p className="text-text-muted text-xs mt-2">Enter one highlight per line.</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder={
              kind === "course"
                ? "Describe what attendees will learn."
                : "Describe what makes this event worth attending."
            }
            className={`${inputClass} resize-y`}
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold px-8 py-2.5 rounded-lg text-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer border-none disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
