import { TaskSubmission } from "@/types/tasks";

const headers = {
  "Content-Type": "application/json"
};

export async function fetchTasks(): Promise<TaskSubmission[]> {
  const res = await fetch("/api/tasks", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Unable to load tasks yet");
  }

  return res.json();
}

export async function submitTask(payload: Omit<TaskSubmission, "id" | "createdAt">) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const message = (await res.json())?.message ?? "Unable to submit right now";
    throw new Error(message);
  }

  return res.json();
}
