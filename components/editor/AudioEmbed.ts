import { Node, mergeAttributes } from "@tiptap/core";

export interface AudioEmbedOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    audioEmbed: {
      setAudio: (src: string) => ReturnType;
    };
  }
}

const AudioEmbed = Node.create<AudioEmbedOptions>({
  name: "audioEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "audio[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["audio", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { controls: "" })];
  },

  addCommands() {
    return {
      setAudio:
        (src: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    };
  },
});

export default AudioEmbed;
