"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { Notification } from "../shared/components";
import { NOTIFICATIONS } from "../shared/data";
import { ScrollShadows } from "./scroll-shadows";

type DemoProps = React.ComponentProps<typeof ScrollShadows>;

export default function Demo({ className, ...props }: DemoProps) {
  return (
    <ScrollShadows
      className={cn(
        "h-72 w-96 max-w-full overscroll-none rounded-lg bg-white",
        className
      )}
      {...props}
    >
      <div className="flex flex-col py-1">
        {NOTIFICATIONS.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
    </ScrollShadows>
  );
}
