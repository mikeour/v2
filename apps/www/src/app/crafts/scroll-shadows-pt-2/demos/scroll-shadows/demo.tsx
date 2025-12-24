"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { ICON_COLORS, NOTIFICATIONS } from "./data";
import { ScrollShadows } from "./scroll-shadows";

export default function Demo({ shadows = true }: { shadows?: boolean }) {
  return (
    <ScrollShadows
      className="h-72 w-full max-w-sm rounded-lg bg-white"
      showShadows={shadows}
    >
      <div className="py-1">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex items-center gap-3 border-slate-200 border-b px-4 py-3",
              !n.read && "bg-blue-50"
            )}
          >
            <div
              className={cn(
                "size-8 shrink-0 rounded-full",
                ICON_COLORS[n.type]
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm",
                  n.read ? "text-slate-500" : "text-slate-800"
                )}
              >
                {n.title}
              </p>
              <p className="text-slate-400 text-xs">{n.time}</p>
            </div>
            {!n.read && (
              <div className="size-2 shrink-0 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>
    </ScrollShadows>
  );
}
