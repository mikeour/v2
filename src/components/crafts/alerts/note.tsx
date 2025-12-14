// Useful information that users should know, even when skimming content.
export function Note({ children }: React.PropsWithChildren) {
  return (
    <div className="relative rounded-lg bg-blue-900 px-5 text-block">
      <div className="-translate-x-1/2 -translate-y-1/2 -rotate-[8deg] absolute top-1 left-5 sm:left-3">
        <span className="not-prose rounded bg-blue-600 px-2 py-1 font-semibold text-blue-50 text-sm/none uppercase tracking-wider">
          Note
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-blue-50 prose-p:text-blue-50">
        {children}
      </div>
    </div>
  );
}
