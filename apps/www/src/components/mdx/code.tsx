import { type HighlightedCode, Pre } from "codehike/code";

import { CopyButton } from "./copy-button";

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <div className="group relative">
      <CopyButton text={codeblock.code} />
      <Pre
        className="rounded-lg bg-slate-800! p-5 text-sm"
        code={codeblock}
        style={codeblock.style}
      />
    </div>
  );
}
