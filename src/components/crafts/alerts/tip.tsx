// Helpful advice for doing things better or more easily.
export function Tip({ children }: React.PropsWithChildren) {
  return (
    <div className="text-block relative rounded-lg bg-emerald-900 px-5">
      <div className="absolute left-3 top-1 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] sm:left-2">
        <span className="not-prose rounded bg-emerald-600 px-2 py-1 text-sm/none font-semibold uppercase tracking-wider text-emerald-50">
          Tip
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-emerald-50 prose-p:text-emerald-50">
        {children}
      </div>
    </div>
  );
}
