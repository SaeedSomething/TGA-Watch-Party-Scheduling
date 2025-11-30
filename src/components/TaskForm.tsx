"use client";

import {
	useEffect,
	useMemo,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react";
import { DEFAULT_TASKS } from "@/lib/constants";
import { fetchTasks, submitTask } from "@/lib/client";
import { TaskItem, TaskSubmission } from "@/types/tasks";

const customOptionId = "custom";

type Props = {
	onUpdate: Dispatch<SetStateAction<TaskSubmission[]>>;
};

export function TaskForm({ onUpdate }: Props) {
	const [name, setName] = useState("");
	const [note, setNote] = useState("");
	const [selectedItem, setSelectedItem] = useState(
		DEFAULT_TASKS[0]?.id ?? ""
	);
	const [customItem, setCustomItem] = useState("");
	const [items, setItems] = useState<TaskItem[]>(DEFAULT_TASKS);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await fetchTasks();
				onUpdate(data);
			} catch (err) {
				console.warn("Falling back to local list", err);
			}
		};

		void load();
	}, [onUpdate]);

	const computedItems = useMemo(
		() => [{ id: customOptionId, label: "Add a custom item" }, ...items],
		[items]
	);

	const usingCustom = selectedItem === customOptionId;
	const resolvedItem = usingCustom
		? customItem
		: items.find((item) => item.id === selectedItem)?.label ?? "";

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Add your name so people know who to thank!");
			return;
		}

		if (usingCustom && !customItem.trim()) {
			setError("Describe the custom item you want to cover.");
			return;
		}

		const itemLabel = resolvedItem.trim();

		if (!itemLabel) {
			setError("Pick something to handle.");
			return;
		}

		const payload = {
			name: name.trim(),
			item: itemLabel,
			note: note.trim() || undefined,
		};

		setLoading(true);
		try {
			const created = await submitTask(payload);
			setName("");
			setNote("");
			if (usingCustom && customItem.trim()) {
				const newItem: TaskItem = {
					id: crypto.randomUUID(),
					label: customItem.trim(),
				};
				setItems((prev) => [newItem, ...prev]);
				setSelectedItem(newItem.id);
				setCustomItem("");
			}
			onUpdate((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Unable to submit right now.";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			className="glass-card fade-border"
			onSubmit={handleSubmit}
			id="task-form"
		>
			<div className="grid two-cols">
				<div className="grid" style={{ gap: "0.4rem" }}>
					<label htmlFor="name">اسم ؟</label>
					<input
						id="name"
						className="input"
						placeholder=""
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="grid" style={{ gap: "0.4rem" }}>
					<label htmlFor="item">چی میتونید اوکی کنید؟</label>
					<select
						id="item"
						className="select"
						value={selectedItem}
						onChange={(e) => setSelectedItem(e.target.value)}
					>
						{computedItems.map((item) => (
							<option key={item.id} value={item.id}>
								{item.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{usingCustom ? (
				<div
					className="grid"
					style={{ gap: "0.4rem", marginTop: "1rem" }}
				>
					<label htmlFor="custom-item"></label>
					<input
						id="custom-item"
						className="input"
						placeholder="e.g. Providing rides after the show"
						value={customItem}
						onChange={(e) => setCustomItem(e.target.value)}
					/>
				</div>
			) : null}

			<div className="grid" style={{ gap: "0.4rem", marginTop: "1rem" }}>
				<label htmlFor="note">
					توضیحات
					<span className="subtle">
						( توضیحات لازم برای اینکه دوباره کاری یا تداخلی بین کار
						ها نباشه)
					</span>
				</label>
				<textarea
					id="note"
					className="textarea"
					placeholder=""
					rows={3}
					value={note}
					onChange={(e) => setNote(e.target.value)}
				/>
			</div>

			{error ? (
				<p
					className="subtle"
					style={{ color: "#fdb0c0", marginTop: "0.4rem" }}
				>
					{error}
				</p>
			) : null}

			<div
				style={{
					marginTop: "1.2rem",
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<button
					className="button-primary"
					type="submit"
					disabled={loading}
				>
					{loading ? "Saving..." : "Lock it in"}
				</button>
				{/* <span className="subtle">
					Your update shows in the list instantly.
				</span> */}
			</div>
		</form>
	);
}
