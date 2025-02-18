<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface ButtonProps extends HTMLAttributes<HTMLElement> {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'theme';
		size?: 'sm' | 'md' | 'lg' | 'square';
		href?: string;
		external?: boolean;
		type?: 'submit' | 'reset' | 'button' | undefined | null;
		popovertarget?: string | undefined | null;
		popovertargetaction?: 'toggle' | 'show' | 'hide' | undefined | null;
		disabled?: boolean;
	}

	let {
		variant = 'primary',
		size = 'md',
		children,
		class: className,
		href,
		external,
		...attrs
	}: ButtonProps = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	target={href && external ? '_blank' : undefined}
	rel={href && external ? 'noopener noreferrer' : undefined}
	class={['pf-button', variant, size, className]}
	{...attrs}
>
	{@render children?.()}
</svelte:element>

<style>
	.pf-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		white-space: nowrap;
		gap: 0.5rem;
		border-radius: var(--pf-radius);

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
		background-color: hsl(var(--pf-accent-10));
		color: hsl(var(--pf-accent-95));

		&:hover {
			background-color: hsl(var(--pf-accent-20));
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
			background-color: hsl(var(--pf-accent-10));
		}
	}

	.theme {
		background-color: hsl(var(--pf-primary-dark));
		color: hsl(var(--pf-accent-10));

		&:hover {
			background-color: color-mix(
				in srgb,
				hsl(var(--pf-primary-dark)),
				hsl(var(--pf-accent-90)) 30%
			);
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
