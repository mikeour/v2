"use client";

import { Notification } from "../shared/components";
import { NOTIFICATIONS } from "../shared/data";

export default function Demo({
  onProgressChange,
}: {
  onProgressChange?: (value: number) => void;
}) {
  return (
    <div
      className="h-72 w-sm max-w-full overflow-y-auto overscroll-none rounded-lg bg-white"
      onScroll={(e) => {
        const el = e.currentTarget;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        onProgressChange?.(progress);
      }}
    >
      <div className="flex flex-col py-1">
        {NOTIFICATIONS.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
