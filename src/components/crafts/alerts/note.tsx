// Useful information that users should know, even when skimming content.
export function Note({ children }: React.PropsWithChildren) {
  return (
    <div className="text-block relative rounded-lg bg-blue-900 px-5">
      <div className="absolute left-5 top-1 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] sm:left-3">
        <span className="not-prose rounded bg-blue-600 px-2 py-1 text-sm/none font-semibold uppercase tracking-wider text-blue-50">
          Note
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-blue-50 prose-p:text-blue-50">
        {children}
      </div>
    </div>
  );
}
