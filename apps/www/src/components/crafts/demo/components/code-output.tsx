"use client";

import { useEffect, useState } from "react";
import { cn } from "@mikeour/ui/lib/utils";
import { type HighlightedCode, highlight, Pre } from "codehike/code";
import { Check, Copy } from "lucide-react";

import theme from "~/themes/one-monokai.mjs";
import type { CodeOutputDef, ControlDef, ControlValues } from "../types";

type CodeOutputPanelProps<C extends readonly ControlDef[]> = {
  config: CodeOutputDef<C>;
  controlValues: ControlValues;
  className?: string;
};

export function CodeOutputPanel<C extends readonly ControlDef[]>({
  config,
  controlValues,
  className,
}: CodeOutputPanelProps<C>) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null);

  // Generate code from current control values
  const code = config.generate(
    controlValues as Parameters<typeof config.generate>[0]
  );

  // Highlight code when it changes
  useEffect(() => {
    let cancelled = false;

    highlight({ value: code, lang: config.lang, meta: "" }, theme).then(
      (result) => {
        if (!cancelled) {
          setHighlighted(result);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [code, config.lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className={cn(
        "flex min-w-36 flex-col gap-2 rounded-lg border border-slate-700 border-dashed bg-slate-900/95 p-3 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      {/* Header with label and copy button */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
          {config.label}
        </span>
        <button
          type="button"
          aria-label="Copy to clipboard"
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Code display with syntax highlighting */}
      {highlighted ? (
        <Pre
          className="my-0! overflow-auto rounded bg-slate-800! p-2! text-xs! leading-relaxed!"
          code={highlighted}
          style={highlighted.style}
        />
      ) : (
        <pre className="overflow-auto rounded bg-slate-800 p-2 font-mono text-slate-300 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
