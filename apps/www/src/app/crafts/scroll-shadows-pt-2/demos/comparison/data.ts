export const NOTIFICATIONS = [
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
];

export const ICON_COLORS: Record<string, string> = {
  message: "bg-blue-500",
  like: "bg-pink-500",
  comment: "bg-green-500",
  follow: "bg-purple-500",
};
