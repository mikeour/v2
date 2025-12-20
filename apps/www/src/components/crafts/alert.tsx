import { cn } from "@mikeour/ui/utils";

const variants = {
  note: {
    label: "Note",
    position: "-rotate-[8deg] top-1 left-5 sm:left-3",
    bg: "bg-blue-900",
    badge: "bg-blue-600 text-blue-50",
    content: "prose-headings:text-blue-50 prose-p:text-blue-50",
  },
  warning: {
    label: "Warning",
    position: "-rotate-[8deg] top-0 left-9 sm:left-8",
    bg: "bg-rose-900",
    badge: "bg-rose-600 text-rose-50",
    content: "prose-headings:text-rose-50 prose-p:text-rose-50",
  },
  caution: {
    label: "Caution",
    position: "-rotate-[7deg] top-0 left-8 sm:left-6",
    bg: "bg-amber-900",
    badge: "bg-amber-600 text-amber-50",
    content: "prose-headings:text-amber-50 prose-p:text-amber-50",
  },
  important: {
    label: "Important",
    position: "-rotate-6 top-0 left-10 sm:left-8",
    bg: "bg-indigo-900",
    badge: "bg-indigo-600 text-indigo-50",
    content: "prose-headings:text-indigo-50 prose-p:text-indigo-100",
  },
  tip: {
    label: "Tip",
    position: "-rotate-[8deg] top-1 left-3 sm:left-2",
    bg: "bg-emerald-900",
    badge: "bg-emerald-600 text-emerald-50",
    content: "prose-headings:text-emerald-50 prose-p:text-emerald-50",
  },
} as const;

type Variant = keyof typeof variants;

type AlertProps = React.PropsWithChildren<{ variant?: Variant }>;

export function Alert({ variant = "note", children }: AlertProps) {
  const config = variants[variant];

  return (
    <div className={cn("relative rounded-lg px-5 text-block", config.bg)}>
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute",
          config.position
        )}
      >
        <span
          className={cn(
            "not-prose rounded px-2 py-1 font-semibold text-sm/none uppercase tracking-wider",
            config.badge
          )}
        >
          {config.label}
        </span>
      </div>
      <div className={cn("overflow-hidden", config.content)}>{children}</div>
    </div>
  );
}
