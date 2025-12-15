// Urgent info that needs immediate user attention to avoid problems.
export function Warning({ children }: React.PropsWithChildren) {
  return (
    <div className="relative rounded-lg bg-rose-900 px-5 text-block">
      <div className="-translate-x-1/2 -translate-y-1/2 -rotate-[8deg] absolute top-0 left-9 sm:left-8">
        <span className="not-prose rounded bg-rose-600 px-2 py-1 font-semibold text-rose-50 text-sm/none uppercase tracking-wider">
          Warning
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-rose-50 prose-p:text-rose-50">
        {children}
      </div>
    </div>
  );
}
