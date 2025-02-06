<script lang="ts">
	import type { HTMLButtonAttributes } from "svelte/elements";

	interface ButtonProps extends HTMLButtonAttributes {
		variant?: "primary" | "secondary" | "outline" | "ghost";
		size?: "sm" | "md" | "lg" | "square";
	}

	let {
		variant = "primary",
		size = "md",
		children,
		class: className,
		...attrs
	}: ButtonProps = $props();
</script>

<button class={["pf-button", variant, size, className]} {...attrs}>
	{@render children?.()}
</button>

<style>
	.pf-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		white-space: nowrap;
		gap: 0.5rem;
		border-radius: 0.375rem;

		&:disabled {
			pointer-events: none;
			opacity: 0.5;
		}

		& > :global(svg) {
			pointer-events: none;
			flex-shrink: 0;
		}
	}

	.primary {
		background-color: hsl(var(--pf-accent-90));
		color: hsl(var(--pf-accent-5));

		&:hover {
			background-color: hsl(var(--pf-accent-80));
		}
	}

	.secondary {
		background-color: hsl(var(--pf-accent-20));
		color: hsl(var(--pf-accent-95));

		&:hover {
			background-color: hsl(var(--pf-accent-30));
		}
	}

	.outline {
		border: solid 1px hsl(var(--pf-accent-95));
		background-color: hsl(var(--pf-accent-5));

		&:hover {
			background-color: hsl(var(--pf-accent-10));
		}
	}

	.ghost {
		&:hover {
			background-color: hsl(var(--pf-accent-20));
		}
	}

	.sm {
		block-size: 2rem;
		padding-inline: 0.75rem;
	}

	.md {
		block-size: 2.25rem;
		padding-inline: 1rem;
		padding-block: 0.5rem;
	}

	.lg {
		block-size: 2.5rem;
		padding-inline: 2rem;
	}

	.square {
		block-size: 2.25rem;
		inline-size: 2.25rem;
	}
</style>
