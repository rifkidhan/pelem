<script lang="ts">
	import type { Snippet } from "svelte";

	interface ListItemProps {
		as?: string;
		heading: string;
		children: Snippet;
	}

	let { as = "li", heading, children }: ListItemProps = $props();
</script>

<svelte:element this={as} class="list-item">
	<div class="heading">{heading}</div>
	<div class="content">
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
			display: flex;
			flex-wrap: wrap;

			& > :global(span):not(:last-child)::after {
				content: '•';
				margin-inline: 0.5rem;
			}
		}
	}
</style>
