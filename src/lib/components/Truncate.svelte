<script lang="ts">
	import { tick } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import Button from "./Button.svelte";

	interface TruncateProps extends HTMLAttributes<HTMLDivElement> {
	}

	let { children, class: className, ...attrs }: TruncateProps = $props();

	let truncate = $state(false);
	let open = $state(false);

	const truncation = (node: HTMLElement) => {
		const onResize = () => {
			tick().then(() => {
				truncate = node.scrollHeight > node.clientHeight;
			});
		};

		$effect(() => {
			truncate = node.scrollHeight > node.clientHeight;
			window.addEventListener("resize", onResize);

			return () => {
				window.removeEventListener("resize", onResize);
			};
		});
	};
	$inspect(truncate);
</script>

<div class={className} {...attrs}>
	<div
		use:truncation
		class={["truncate", className]}
		data-expanded={truncate && open}
		{...attrs}
	>
		{@render children?.()}
	</div>
	{#if truncate}
		<Button class="button-control" variant="secondary" size="sm" onclick={() => open = !open}>
			{open ? "Less" : "More"}
		</Button>
	{/if}
</div>

<style>
	.truncate {
		display: block;
		position: relative;
		max-height: 3lh;
		overflow: clip;
		transition: max-height 200ms ease-in-out;

		&[data-expanded='true'] {
			max-height: max-content;
		}
	}
</style>
