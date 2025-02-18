<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { on } from 'svelte/events';
	import Icon from './icon/Icon.svelte';

	interface TruncateProps extends HTMLAttributes<HTMLDivElement> {
		length?: number;
	}

	let { children, class: className, length, ...attrs }: TruncateProps = $props();

	let truncate = $state(true);
	let open = $state(false);

	const truncation = (node: HTMLElement) => {
		const listen = on(window, 'resize', () => {
			tick().then(() => {
				truncate = node.scrollHeight > node.clientHeight + 1;
			});
		});

		$effect(() => {
			if (browser) {
				truncate = node.scrollHeight > node.clientHeight + 1;
			}
			return () => listen();
		});
	};
</script>

<div
	class={['truncate', className]}
	data-truncated={truncate}
	style:--pf-truncate={length}
	{...attrs}
>
	<div use:truncation data-expanded={truncate && open}>
		{@render children?.()}
	</div>
	{#if browser && truncate}
		<button onclick={() => (open = !open)} aria-pressed={open}>
			<span>
				{open ? 'View Less' : 'View More'}
			</span>
			<Icon icon="chevron-down" />
		</button>
	{/if}
</div>

<style>
	.truncate {
		--line-height: calc(1lh * var(--pf-truncate, 3) - 2lh);
		display: block;
		position: relative;
		inline-size: 100%;

		& > div {
			.truncate[data-truncated='true'] & {
				overflow-wrap: break-word;
				inline-size: 100%;
				max-height: calc(1lh * var(--pf-truncate, 3));
				overflow: clip;
				transition: max-height 200ms ease-in-out;
				mask-image:
					linear-gradient(
						0deg,
						transparent 0,
						transparent calc(var(--line-height)),
						#000 calc(var(--line-height))
					),
					linear-gradient(279deg, transparent 0, transparent 20%, #000);

				&[data-expanded='true'] {
					max-height: fit-content;
					padding-block-end: 1lh;
					mask-image: none;
				}
			}
		}

		button {
			color: hsl(var(--pf-primary));
			display: inline-flex;
			align-items: center;
			position: absolute;
			right: 0;
			bottom: 0;

			&[aria-pressed='true'] {
				bottom: 0;

				& > :global(svg) {
					rotate: 180deg;
				}
			}
		}
	}
</style>
