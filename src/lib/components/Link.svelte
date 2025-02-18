<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import Icon from './icon/Icon.svelte';

	interface LinkProps extends HTMLAnchorAttributes {
		href: string;
		external?: boolean;
	}

	let { external, href, children, class: className, ...attrs }: LinkProps = $props();
</script>

<a
	{href}
	target={external ? '_blank' : null}
	rel={external ? 'noreferrer noopener' : null}
	class={className}
	{...attrs}
>
	{#if children}
		<span>
			{@render children()}
		</span>
	{/if}
	{#if external}
		<Icon icon="external-link" hidden />
	{/if}
</a>

<style>
	a {
		display: inline-flex;
		position: relative;
		gap: 0.25rem;
		color: hsl(var(--pf-primary));
		inline-size: fit-content;
		align-items: center;
		transition: color 100ms ease-in-out;

		& > :global(svg) {
			pointer-events: none;
			flex-shrink: 0;
			inline-size: 1em;
			block-size: 1em;
		}

		&::before {
			content: '';
			width: 100%;
			height: 0.5em;
			position: absolute;
			bottom: 0;
			background-color: hsl(var(--pf-primary-light));
			z-index: -1;
			clip-path: inset(0 100% 0 0);
			transition: clip-path 200ms ease-in-out;
		}

		&:hover {
			color: hsl(var(--pf-accent-95));

			&::before {
				clip-path: inset(0 0% 0 0);
			}
		}
	}
</style>
