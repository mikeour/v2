"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      aria-label="Copy to clipboard"
      className="absolute top-2 right-2 rounded p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-700 hover:text-white group-hover:opacity-100"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      type="button"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
