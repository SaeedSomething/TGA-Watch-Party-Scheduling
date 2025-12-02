"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TgaStatusMark } from "@/components/TgaStatusMark";
import {
	EVENT_TIME,
	LANDING_COPY,
	SUBMISSION_LIST_DETAILS,
} from "@/lib/constants";
import { TaskSubmission } from "@/types/tasks";

function useCountdown(targetIso: string) {
	const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
	const [remaining, setRemaining] = useState(target - Date.now());

	useEffect(() => {
		const timer = setInterval(
			() => setRemaining(target - Date.now()),
			1000
		);
		return () => clearInterval(timer);
	}, [target]);

	const totalSeconds = Math.max(Math.floor(remaining / 1000), 0);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { days, hours, minutes, seconds };
}

export default function HomePage() {
	const [tasks, setTasks] = useState<TaskSubmission[]>([]);
	const countdown = useCountdown(EVENT_TIME);

	return (
		<main>
			<section
				style={{
					padding: "3rem 1.5rem 2rem",
					textAlign: "center",
					position: "relative",
					overflow: "hidden",
					isolation: "isolate",
				}}
			>
				<TgaStatusMark />
				<div
					className="page-container"
					style={{
						maxWidth: "1100px",
						position: "relative",
						zIndex: 1,
					}}
				>
					<div
						className="tag"
						style={{
							margin: "0 auto 1rem",
							width: "fit-content",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<h1 className="hero-title">{LANDING_COPY.title}</h1>
					</div>
					<div
						className="description"
						style={{
							margin: "0 auto 1rem",
							width: "fit-content",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<p
							className="hero-subtitle"
							dir="auto"
							style={{
								whiteSpace: "pre-line",
								textAlign: "right",
								lineHeight: 1.7,
								unicodeBidi: "plaintext",
							}}
						>
							{LANDING_COPY.subtitle.trim()}
						</p>
					</div>
					{/* The Game Awards | Watch Party Control Room */}

					<div
						style={{
							marginTop: "1.5rem",
							gap: "0.75rem",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<a className="button-primary" href="#task-form">
							{LANDING_COPY.cta}
						</a>
						{/* <a className="button-secondary" href="https://www.thegameawards.com/" target="_blank" rel="noreferrer">
              Event site
            </a> */}
					</div>
				</div>
				<div className="countdown" style={{ justifyContent: "center" }}>
					<span>پنحشنبه 20 آذر</span>
					<strong>
						{countdown.days}d {countdown.hours}h {countdown.minutes}
						m {countdown.seconds}s
					</strong>
				</div>
			</section>

			<section className="page-container" id="plan">
				<div className="grid" style={{ gap: "1.25rem" }}>
					<TaskForm onUpdate={setTasks} />
					<div
						className="glass-card"
						style={{ border: "1px solid var(--border)" }}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: "1rem",
							}}
						>
							<div>
								<h2 style={{ margin: 0 }}>پلن ها</h2>
								<p
									className="subtle"
									style={{ margin: "0.35rem 0 0" }}
								></p>
							</div>
							<div
								className="tag"
								style={{ justifyContent: "center" }}
							>
								<span
									style={{
										width: 10,
										height: 10,
										borderRadius: 999,
										background: "#7cf3ff",
										display: "inline-block",
									}}
								/>
								Live
							</div>
						</div>
						<div style={{ marginTop: "1rem" }}>
							<TaskList tasks={tasks} />
						</div>
					</div>
				</div>
			</section>

			<section className="page-container" id="location">
				<p
					className="tag"
					style={{
						margin: "0 auto 1rem",
						width: "fit-content",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<h2 className="hero-subtitle">
						مکان :لادن ۲۲ پلاک 97 طبقه ۳{" "}
					</h2>
				</p>
				<div className="glass-card map-card">
					<div className="map-frame">
						<iframe
							title="map-iframe"
							src="https://neshan.org/maps/iframe/places/_b1MT50J5TNa#c36.325-59.473-20z-0p/36.32470531780612/59.47305461491612"
							width="450"
							height="300"
							allowFullScreen
							loading="lazy"
						></iframe>
					</div>
				</div>
			</section>
		</main>
	);
}
