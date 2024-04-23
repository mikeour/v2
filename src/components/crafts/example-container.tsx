import { cn } from "~/lib/utils";

export function ExampleContainer({
  mockBrowser = false,
  isolated = false,
  className,
  controls,
  children,
}: React.PropsWithChildren<{
  mockBrowser?: boolean;
  isolated?: boolean;
  controls?: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "code-example flex flex-col overflow-hidden rounded-xl bg-slate-800",
        "lg:mx-[calc(var(--gutter)*-1.75)]"
      )}
    >
      <div
        className={cn(
          "not-prose component-bg relative flex flex-col items-center justify-center",
          isolated && "px-[--gutter] py-8 sm:py-12"
        )}
      >
        {/* <div className="pointer-events-none absolute inset-0 z-0 bg-slate-800 [mask-image:radial-gradient(ellipse,rgba(27,30,40,0)_0%,rgba(27,30,40,1)_100%)]" /> */}

        <div
          className={cn(
            "relative flex flex-col overflow-hidden",
            isolated && "rounded-lg",
            className
          )}
        >
          {mockBrowser && <MockBrowser />}

          {children}
        </div>
      </div>

      {controls && (
        <div className="relative w-full bg-slate-700 px-[--gutter] py-4">
          {controls}
        </div>
      )}
    </div>
  );
}

function MockBrowser() {
  return (
    <div className="flex h-8 w-full shrink-0 items-center justify-start gap-2 bg-slate-700 px-4 md:px-5">
      <div className="size-3 shrink-0 rounded-full bg-red-400" />
      <div className="size-3 shrink-0 rounded-full bg-yellow-400" />
      <div className="size-3 shrink-0 rounded-full bg-green-400" />
    </div>
  );
}
