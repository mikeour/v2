import { cn } from "@mikeour/ui/lib/utils";

import { ICON_COLORS, type NotificationType } from "./data";

export function Notification({
  notification,
}: React.PropsWithChildren<{ notification: NotificationType }>) {
  return (
    <div
      key={notification.id}
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
