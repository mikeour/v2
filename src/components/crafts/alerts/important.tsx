// Key information users need to know to achieve their goal.
export function Important({ children }: React.PropsWithChildren) {
  return (
    <div className="text-block relative rounded-lg bg-indigo-900 px-5">
      <div className="absolute left-10 top-0 -translate-x-1/2 -translate-y-1/2 -rotate-[6deg] sm:left-8">
        <span className="not-prose rounded bg-indigo-600 px-2 py-1 text-sm/none font-semibold uppercase tracking-wider text-indigo-50">
          Important
        </span>
      </div>

      <div className="overflow-hidden prose-headings:text-indigo-50 prose-p:text-indigo-100">
        {children}
      </div>
    </div>
  );
}
