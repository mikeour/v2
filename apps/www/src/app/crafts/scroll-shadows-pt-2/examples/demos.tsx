"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { ExampleContainer } from "~/components/crafts/example-container";
import { ScrollAreaWithShadows } from "./scroll-area";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "message",
    title: "New message from Alex",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "like",
    title: "Sarah liked your post",
    time: "5m ago",
    read: false,
  },
  {
    id: 3,
    type: "comment",
    title: "New comment on your photo",
    time: "12m ago",
    read: false,
  },
  {
    id: 4,
    type: "follow",
    title: "Jordan started following you",
    time: "1h ago",
    read: true,
  },
  {
    id: 5,
    type: "message",
    title: "New message from Taylor",
    time: "2h ago",
    read: true,
  },
  {
    id: 6,
    type: "like",
    title: "3 people liked your comment",
    time: "3h ago",
    read: true,
  },
  {
    id: 7,
    type: "comment",
    title: "Reply to your thread",
    time: "5h ago",
    read: true,
  },
  {
    id: 8,
    type: "follow",
    title: "Casey started following you",
    time: "6h ago",
    read: true,
  },
  {
    id: 9,
    type: "message",
    title: "New message from Morgan",
    time: "8h ago",
    read: true,
  },
  {
    id: 10,
    type: "like",
    title: "Your post is trending",
    time: "12h ago",
    read: true,
  },
];

const ICON_COLORS: Record<string, string> = {
  message: "bg-blue-500",
  like: "bg-pink-500",
  comment: "bg-green-500",
  follow: "bg-purple-500",
};

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

const CAROUSEL_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  color: [
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-pink-500",
  ][i],
}));

export function InteractiveVerticalDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="mx-auto w-full max-w-sm"
      controls={[
        {
          type: "switch",
          name: "shadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      isolated
    >
      {({ values }) => (
        <ScrollAreaWithShadows
          className="h-72 w-full rounded-lg bg-white"
          scrollShadow={values.shadows ? "vertical" : "none"}
        >
          <div className="py-1">
            {NOTIFICATIONS.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </ScrollAreaWithShadows>
      )}
    </ExampleContainer>
  );
}

export function InteractiveHorizontalDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="w-full"
      controls={[
        {
          type: "switch",
          name: "shadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      isolated
    >
      {({ values }) => (
        <ScrollAreaWithShadows
          className="w-full rounded-lg bg-white"
          orientation="horizontal"
          scrollShadow={values.shadows ? "horizontal" : "none"}
        >
          <div className="flex gap-4 p-4 after:w-px after:shrink-0 after:content-['']">
            {CAROUSEL_ITEMS.map((item) => (
              <div
                className={cn(
                  "flex h-32 w-40 shrink-0 items-center justify-center rounded-lg font-bold text-2xl text-white",
                  item.color
                )}
                key={item.id}
              >
                {item.id}
              </div>
            ))}
          </div>
        </ScrollAreaWithShadows>
      )}
    </ExampleContainer>
  );
}

export function CSSVariablesDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="mx-auto w-full max-w-sm"
      inspector={[
        { name: "start", label: "--overflow-y-start", defaultValue: "0px" },
        { name: "end", label: "--overflow-y-end", defaultValue: "—" },
      ]}
      isolated
    >
      {({ setInspector }) => (
        <div
          className="h-72 overflow-y-auto rounded-lg bg-white"
          onScroll={(e) => {
            const target = e.currentTarget;
            const start = Math.round(target.scrollTop);
            const end = Math.round(
              target.scrollHeight - target.clientHeight - target.scrollTop
            );
            setInspector("start", `${start}px`);
            setInspector("end", `${end}px`);
          }}
        >
          <div className="py-1">
            {NOTIFICATIONS.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      )}
    </ExampleContainer>
  );
}

export function ComparisonDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer caption={caption} className="w-full">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-center text-slate-400 text-sm">
            Part 1: Opacity-based
          </span>
          <div className="relative h-72 overflow-y-auto rounded-lg bg-white">
            <div className="-mb-8 pointer-events-none sticky top-0 h-8 bg-linear-to-b from-white to-transparent opacity-80" />
            <div className="py-1">
              {NOTIFICATIONS.slice(0, 6).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
            <div className="-mt-8 pointer-events-none sticky bottom-0 h-8 bg-linear-to-t from-white to-transparent opacity-80" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-center text-slate-400 text-sm">
            Part 2: Height-based
          </span>
          <ScrollAreaWithShadows
            className="h-72 rounded-lg bg-white"
            scrollShadow="vertical"
          >
            <div className="py-1">
              {NOTIFICATIONS.slice(0, 6).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </ScrollAreaWithShadows>
        </div>
      </div>
    </ExampleContainer>
  );
}
