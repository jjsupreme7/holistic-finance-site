"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Type,
  Highlighter,
  RemoveFormatting,
} from "lucide-react";
import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { marked } from "marked";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Black", value: "#1a1a1a" },
  { label: "Dark Gray", value: "#4a4a4a" },
  { label: "Gray", value: "#6b7280" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Gold", value: "#d4952e" },
  { label: "Green", value: "#16a34a" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", value: "" },
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Purple", value: "#ddd6fe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Red", value: "#fecaca" },
];

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-colors cursor-pointer border-none ${
        active
          ? "bg-primary/20 text-primary-light"
          : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-hover"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border-light mx-1" />;
}

function ColorDropdown({
  colors,
  onSelect,
  activeColor,
  icon,
  title,
}: {
  colors: { label: string; value: string }[];
  onSelect: (color: string) => void;
  activeColor: string | undefined;
  icon: React.ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={title}
        className={`p-1.5 rounded-md transition-colors cursor-pointer border-none flex items-center gap-0.5 ${
          activeColor
            ? "bg-primary/20 text-primary-light"
            : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-hover"
        }`}
      >
        {icon}
        <svg width="8" height="8" viewBox="0 0 8 8" className="ml-0.5 opacity-50">
          <path d="M1 3l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-admin-card border border-border-light rounded-lg shadow-lg p-2 z-50 grid grid-cols-4 gap-1 min-w-[140px]">
          {colors.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              onClick={() => {
                onSelect(color.value);
                setOpen(false);
              }}
              className={`w-7 h-7 rounded-md border cursor-pointer transition-transform hover:scale-110 ${
                (activeColor || "") === color.value
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border-light"
              }`}
              style={{
                background: color.value || "linear-gradient(135deg, #fff 45%, #ccc 45%, #ccc 55%, #fff 55%)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function isHtml(text: string): boolean {
  return /^\s*</.test(text);
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  // Convert markdown to HTML for existing posts; pass HTML content through as-is
  const initialContent = useMemo(() => {
    if (!content) return "";
    if (isHtml(content)) return content;
    return marked.parse(content, { async: false }) as string;
  }, [content]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-admin focus:outline-none min-h-[400px] px-4 py-3 text-sm leading-relaxed",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  // Sync external content changes (e.g. when loading initial data after mount)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt("Enter URL:");
    if (!url) return;

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleTextColor = useCallback(
    (color: string) => {
      if (!editor) return;
      if (!color) {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const handleHighlight = useCallback(
    (color: string) => {
      if (!editor) return;
      if (!color) {
        editor.chain().focus().unsetHighlight().run();
      } else {
        editor.chain().focus().setHighlight({ color }).run();
      }
    },
    [editor]
  );

  const handleClearFormatting = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border-2 border-border-light bg-admin-card overflow-hidden">
        <div className="h-10 bg-admin-surface border-b border-border-light animate-pulse" />
        <div className="min-h-[400px]" />
      </div>
    );
  }

  const iconSize = 16;
  const activeTextColor = editor.getAttributes("textStyle").color as string | undefined;
  const activeHighlight = editor.getAttributes("highlight").color as string | undefined;

  return (
    <div className="rounded-xl border-2 border-border-light bg-admin-card overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border-light bg-admin-surface">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ColorDropdown
          colors={TEXT_COLORS}
          onSelect={handleTextColor}
          activeColor={activeTextColor}
          icon={<Type size={iconSize} />}
          title="Text Color"
        />
        <ColorDropdown
          colors={HIGHLIGHT_COLORS}
          onSelect={handleHighlight}
          activeColor={activeHighlight}
          icon={<Highlighter size={iconSize} />}
          title="Highlight Color"
        />
        <ToolbarButton
          onClick={handleClearFormatting}
          title="Clear Formatting"
        >
          <RemoveFormatting size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            // toggleBlockquote handles both wrap and unwrap reliably
            const success = editor.chain().focus().toggleBlockquote().run();
            // Fallback: if toggle didn't remove it, force clear
            if (!success || editor.isActive("blockquote")) {
              editor.chain().focus().selectAll().clearNodes().run();
            }
          }}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={handleLink}
          active={editor.isActive("link")}
          title="Link"
        >
          <LinkIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
