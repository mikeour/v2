"use client";

import { Notification } from "../shared/components";
import { NOTIFICATIONS } from "../shared/data";
import { ScrollShadows } from "./scroll-shadows";

type ScrollShadowsPreviewProps = {
  showShadows?: boolean;
};

export default function ScrollShadowsPreview({
  showShadows = true,
}: ScrollShadowsPreviewProps) {
  return (
    <ScrollShadows
      className="h-72 w-96 overscroll-none rounded-lg bg-white"
      showShadows={showShadows}
    >
      <div className="flex flex-col py-1">
        {NOTIFICATIONS.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </ScrollShadows>
  );
}
