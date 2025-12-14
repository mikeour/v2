// Key information users need to know to achieve their goal.
export function Important({ children }: React.PropsWithChildren) {
  return (
    <div className="relative rounded-lg bg-indigo-900 px-5 text-block">
      <div className="-translate-x-1/2 -translate-y-1/2 -rotate-[6deg] absolute top-0 left-10 sm:left-8">
        <span className="not-prose rounded bg-indigo-600 px-2 py-1 font-semibold text-indigo-50 text-sm/none uppercase tracking-wider">
          Important
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-indigo-50 prose-p:text-indigo-100">
        {children}
      </div>
    </div>
  );
}
