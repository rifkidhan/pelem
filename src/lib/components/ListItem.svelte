<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItemProps {
		as?: string;
		heading: string;
		children: Snippet;
	}

	let { as = 'li', heading, children }: ListItemProps = $props();
</script>

<svelte:element this={as} class="list-item">
	<div class="heading">{heading}</div>
	<div class="content list-with-dot">
		{@render children()}
	</div>
</svelte:element>

<style>
	.list-item {
		&:has(.content:empty) {
			display: none;
		}

		.heading {
			font-weight: 600;
		}

		.content {
			flex-wrap: wrap;
		}
	}
</style>
