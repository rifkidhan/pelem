<script lang="ts">
	import { theme } from "$lib/stores/state.svelte";
	import { tick } from "svelte";
	import Button from "./Button.svelte";

	const onClick = () => {
		if (document.startViewTransition) {
			document.documentElement.style.viewTransitionName = "theme";
			document.startViewTransition(async () => {
				await tick();
				theme.current = theme.current === "light" ? "dark" : "light";
			}).finished.then(() => {
				document.documentElement.style.viewTransitionName = "none";
			});
		} else {
			theme.current = theme.current === "light" ? "dark" : "light";
		}
	};

	$effect(() => {
		document.documentElement.dataset.theme = theme.current;
	});
</script>

<svelte:head>
	<script>
		{
		const theme = localStorage.getItem("pelem:theme");

		document.documentElement.dataset.theme = theme === "auto"
			? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
			: theme;
	}
	</script>
</svelte:head>

<Button
	type="button"
	size="square"
	variant="ghost"
	class="theme-toggle"
	title="Toggles light & dark"
	aria-pressed={theme.current === "dark"}
	aria-label={theme.current}
	aria-live="polite"
	onclick={onClick}
>
	{#if theme.current === "dark"}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	{:else if theme.current === "light"}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	{/if}
</Button>
