"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import AudioEmbed from "./AudioEmbed";
import { uploadFile } from "@/lib/uploadFile";

function Toolbar({ editor }: { editor: Editor | null }) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded px-2 py-1 text-sm font-medium ${
      active
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "hover:bg-black/5 dark:hover:bg-white/10"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-black/10 p-2 dark:border-white/10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btn(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btn(editor.isActive("heading", { level: 3 }))}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={btn(editor.isActive("link"))}
      >
        Link
      </button>

      <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className={btn(false)}
      >
        Image
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const url = await uploadFile(file);
          editor.chain().focus().setImage({ src: url }).run();
        }}
      />

      <button
        type="button"
        onClick={() => audioInputRef.current?.click()}
        className={btn(false)}
      >
        Audio
      </button>
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const url = await uploadFile(file);
          editor.chain().focus().setAudio(url).run();
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
        class: "prose prose-neutral max-w-none dark:prose-invert min-h-[300px] px-4 py-3 focus:outline-none",
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          const url = await uploadFile(file);
          const { schema } = view.state;
          const node = schema.nodes.image.create({ src: url });
          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
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
          const url = await uploadFile(file);
          const { schema } = view.state;
          const node = schema.nodes.image.create({ src: url });
          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
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
    <div className="rounded-lg border border-black/10 dark:border-white/10">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
