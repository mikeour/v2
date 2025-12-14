// Advises about risks or negative outcomes of certain actions.
export function Caution({ children }: React.PropsWithChildren) {
  return (
    <div className="relative rounded-md bg-amber-900 px-5 text-block">
      <div className="-translate-x-1/2 -translate-y-1/2 -rotate-[7deg] absolute top-0 left-8 sm:left-6">
        <span className="not-prose rounded bg-amber-600 px-2 py-1 font-semibold text-amber-50 text-sm/none uppercase tracking-wider">
          Caution
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-amber-50 prose-p:text-amber-50">
        {children}
      </div>
    </div>
  );
}
