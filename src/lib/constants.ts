import { TaskItem } from "@/types/tasks";

export const DEFAULT_TASKS: TaskItem[] = [
  { id: "snacks", label: "Bring snacks" },
  { id: "chairs", label: "Bring extra chairs" },
  { id: "pillows", label: "Bring cozy pillows/blankets" },
  { id: "drinks", label: "Handle drinks + ice" },
  { id: "screens", label: "Set up extra monitor/TV" },
  { id: "tech", label: "HDMI / cables / adapters" },
  { id: "playlist", label: "Music playlist for pre-show" }
];

export const LANDING_COPY = {
  title: "TGA Watch Party HQ",
  subtitle:
    "Lock in who’s bringing what for The Game Awards night without endless group chats. Drop your name, claim an item, and we’ll all show up ready to cheer.",
  cta: "Show me the checklist"
};

export const EVENT_TIME = "2024-12-13T17:00:00-05:00";
