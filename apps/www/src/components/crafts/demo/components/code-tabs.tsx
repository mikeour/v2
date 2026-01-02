"use client";

import { useState } from "react";
import { cn } from "@mikeour/ui/lib/utils";
import {
  type AnnotationHandler,
  type HighlightedCode,
  InnerLine,
  InnerPre,
  InnerToken,
  Pre,
} from "codehike/code";
import { Check, ChevronDown, Copy } from "lucide-react";

// =============================================================================
// Word Wrap Annotation
// =============================================================================

const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  // @ts-expect-error - filter dev tool prop
  Pre: ({ "data-insp-path": _, ...props }) => (
    <InnerPre merge={props} className="whitespace-pre-wrap" />
  ),
  // @ts-expect-error - filter dev tool prop
  Line: ({ "data-insp-path": _, ...props }) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  // @ts-expect-error - filter dev tool prop
  Token: ({ "data-insp-path": _, ...props }) => (
    <InnerToken merge={props} style={{ textIndent: 0 }} />
  ),
};

type CodeTabsProps = {
  code: HighlightedCode[];
  visible: boolean;
};

export function CodeTabs({ code, visible }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!visible || code.length === 0) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      className="row-span-2 grid grid-rows-subgrid border-slate-700 border-t"
      data-slot="demo-code"
    >
      {/* Tab bar */}
      <div
        className="flex items-center justify-between border-slate-700 border-b bg-slate-900/50"
        data-slot="demo-code-toolbar"
      >
        <div className="flex self-stretch">
          {code.map((tab, i) => (
            <button
              key={tab.meta}
              type="button"
              className={cn(
                "px-4 py-2 text-sm transition-colors",
                activeTab === i
                  ? "border-blue-500 border-b-2 text-white"
                  : "text-slate-400 hover:text-white"
              )}
              onClick={() => setActiveTab(i)}
            >
              {tab.meta}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Copy to clipboard"
          className="mr-2 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Code content */}
      <div className="relative">
        <Pre
          className={cn(
            "!my-0 !bg-slate-800 overflow-auto p-4 text-sm",
            expanded ? "max-h-none" : "max-h-80"
          )}
          code={code[activeTab]}
          handlers={[wordWrap]}
          style={code[activeTab].style}
        />
        <button
          type="button"
          className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-slate-800 via-slate-800/90 to-transparent py-4 text-slate-400 transition-colors hover:text-white"
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown
            size={20}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </button>
      </div>
    </div>
  );
}
