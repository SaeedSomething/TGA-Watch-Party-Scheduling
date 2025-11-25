"use client";

import { TaskSubmission } from "@/types/tasks";

type Props = {
  tasks: TaskSubmission[];
};

export function TaskList({ tasks }: Props) {
  if (!tasks.length) {
    return (
      <div className="glass-card" style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>No sign-ups yet. Claim something and be a hero.</p>
      </div>
    );
  }

  return (
    <div className="list">
      {tasks.map((task) => (
        <article key={task.id} className="list-item">
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <strong>{task.name}</strong>
            <span className="tag">{task.item}</span>
          </div>
          {task.note ? <p className="subtle" style={{ margin: 0 }}>{task.note}</p> : null}
          <p className="subtle" style={{ margin: 0, fontSize: "0.85rem" }}>
            Added {new Date(task.createdAt).toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  );
}
