// Helpful advice for doing things better or more easily.
export function Tip({ children }: React.PropsWithChildren) {
  return (
    <div className="relative rounded-lg bg-emerald-900 px-5 text-block">
      <div className="-translate-x-1/2 -translate-y-1/2 -rotate-[8deg] absolute top-1 left-3 sm:left-2">
        <span className="not-prose rounded bg-emerald-600 px-2 py-1 font-semibold text-emerald-50 text-sm/none uppercase tracking-wider">
          Tip
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-emerald-50 prose-p:text-emerald-50">
        {children}
      </div>
    </div>
  );
}
