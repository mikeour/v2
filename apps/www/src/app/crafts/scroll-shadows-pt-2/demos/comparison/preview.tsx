"use client";

import { Notification } from "../shared/components";
import { NOTIFICATIONS } from "../shared/data";
import { ScrollShadows as CSSVariablesScrollShadows } from "./css-variables";
import { ScrollShadows as FramerMotionScrollShadows } from "./framer-motion";

export default function Demo() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-center text-slate-400 text-sm">
          Part 1: Framer Motion
        </span>
        <FramerMotionScrollShadows className="h-72 w-sm max-w-full rounded-lg bg-white">
          <div className="flex flex-col py-1">
            {NOTIFICATIONS.map((notification) => (
              <Notification key={notification.id} notification={notification} />
            ))}
          </div>
        </FramerMotionScrollShadows>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-center text-slate-400 text-sm">
          Part 2: CSS Variables
        </span>
        <CSSVariablesScrollShadows className="h-72 w-sm max-w-full rounded-lg bg-white">
          <div className="flex flex-col py-1">
            {NOTIFICATIONS.map((notification) => (
              <Notification key={notification.id} notification={notification} />
            ))}
          </div>
        </CSSVariablesScrollShadows>
      </div>
    </div>
  );
}
