// Urgent info that needs immediate user attention to avoid problems.
export function Warning({ children }: React.PropsWithChildren) {
  return (
    <div className="text-block relative rounded-lg bg-rose-900 px-5">
      <div className="absolute left-9 top-0 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] sm:left-8">
        <span className="not-prose rounded bg-rose-600 px-2 py-1 text-sm/none font-semibold uppercase tracking-wider text-rose-50">
          Warning
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-rose-50 prose-p:text-rose-50">
        {children}
      </div>
    </div>
  );
}
