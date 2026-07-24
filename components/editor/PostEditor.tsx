"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Music2,
  AlertCircle,
} from "lucide-react";
import AudioEmbed from "./AudioEmbed";
import { uploadFile } from "@/lib/uploadFile";

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-amber-600/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400"
          : "text-black/60 hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onError,
}: {
  editor: Editor | null;
  onError: (message: string) => void;
}) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-black/10 bg-white/95 p-1.5 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/95">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <Link2 size={16} />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}>
        <ImagePlus size={16} />
      </ToolbarButton>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            const url = await uploadFile(file);
            editor.chain().focus().setImage({ src: url }).run();
          } catch (err) {
            onError(err instanceof Error ? err.message : "Image upload failed");
          }
        }}
      />

      <ToolbarButton label="Insert audio clip" onClick={() => audioInputRef.current?.click()}>
        <Music2 size={16} />
      </ToolbarButton>
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            const url = await uploadFile(file);
            editor.chain().focus().setAudio(url).run();
          } catch (err) {
            onError(err instanceof Error ? err.message : "Audio upload failed");
          }
        }}
      />
    </div>
  );
}

export default function PostEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      AudioEmbed,
      Placeholder.configure({ placeholder: "Write your post here. Paste an image to add it inline…" }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none dark:prose-invert min-h-[400px] px-5 py-4 focus:outline-none",
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          try {
            const url = await uploadFile(file);
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Image upload failed");
          }
        });
        return true;
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          try {
            const url = await uploadFile(file);
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Image upload failed");
          }
        });
        return true;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Keep external state in sync if initialHtml changes after load (e.g. edit page finishing fetch)
  useEffect(() => {
    if (editor && initialHtml && editor.isEmpty) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm dark:border-white/10">
      <Toolbar editor={editor} onError={setUploadError} />
      {uploadError && (
        <div className="flex items-center gap-2 border-b border-red-600/20 bg-red-600/5 px-4 py-2 text-sm text-red-700 dark:border-red-400/20 dark:text-red-400">
          <AlertCircle size={14} className="shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
