import { type HighlightedCode, Pre } from "codehike/code";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      className="rounded-lg bg-slate-800! p-4 text-sm"
      code={codeblock}
      style={codeblock.style}
    />
  );
}
