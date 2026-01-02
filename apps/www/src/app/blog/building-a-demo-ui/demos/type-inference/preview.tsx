"use client";

import { cn } from "@mikeour/ui/lib/utils";

type PreviewProps = {
  showBorder: boolean;
  borderRadius: number;
  variant: string;
};

const variantStyles: Record<string, string> = {
  default: "bg-zinc-100 text-zinc-900",
  primary: "bg-blue-500 text-white",
  secondary: "bg-purple-500 text-white",
};

export default function Preview({
  showBorder,
  borderRadius,
  variant,
}: PreviewProps) {
  return (
    <div
      className={cn(
        "flex h-32 w-48 items-center justify-center p-4 transition-all",
        variantStyles[variant] ?? variantStyles.default,
        showBorder && "border-2 border-zinc-900"
      )}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <span className="font-medium text-sm">Type-Safe Box</span>
    </div>
  );
}
