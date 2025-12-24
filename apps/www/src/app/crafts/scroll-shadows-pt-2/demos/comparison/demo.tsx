"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { ScrollShadows as CSSVariablesScrollShadows } from "./css-variables";
import { ICON_COLORS, NOTIFICATIONS } from "./data";
import { ScrollShadows as FramerMotionScrollShadows } from "./framer-motion";

function NotificationItem({
  notification,
}: {
  notification: (typeof NOTIFICATIONS)[0];
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-slate-200 border-b px-4 py-3",
        !notification.read && "bg-blue-50"
      )}
    >
      <div
        className={cn(
          "size-8 shrink-0 rounded-full",
          ICON_COLORS[notification.type]
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            notification.read ? "text-slate-500" : "text-slate-800"
          )}
        >
          {notification.title}
        </p>
        <p className="text-slate-400 text-xs">{notification.time}</p>
      </div>
      {!notification.read && (
        <div className="size-2 shrink-0 rounded-full bg-blue-500" />
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-center text-slate-400 text-sm">
          Part 1: Framer Motion
        </span>
        <FramerMotionScrollShadows className="h-72 rounded-lg bg-white">
          <div className="py-1">
            {NOTIFICATIONS.slice(0, 6).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        </FramerMotionScrollShadows>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-center text-slate-400 text-sm">
          Part 2: CSS Variables
        </span>
        <CSSVariablesScrollShadows className="h-72 rounded-lg bg-white">
          <div className="py-1">
            {NOTIFICATIONS.slice(0, 6).map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        </CSSVariablesScrollShadows>
      </div>
    </div>
  );
}
