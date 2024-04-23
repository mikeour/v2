// Advises about risks or negative outcomes of certain actions.
export function Caution({ children }: React.PropsWithChildren) {
  return (
    <div className="text-block relative rounded-md bg-amber-900 px-5">
      <div className="absolute left-8 top-0 -translate-x-1/2 -translate-y-1/2 -rotate-[7deg] sm:left-6">
        <span className="not-prose rounded bg-amber-600 px-2 py-1 text-sm/none font-semibold uppercase tracking-wider text-amber-50">
          Caution
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-amber-50 prose-p:text-amber-50">
        {children}
      </div>
    </div>
  );
}
