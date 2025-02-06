<script lang="ts">
	import type { CombineImage } from "$lib/types";
	import type { HTMLAttributes } from "svelte/elements";

	interface MediaGrid extends HTMLAttributes<HTMLElement> {
		photos?: CombineImage[];
	}

	let { photos }: MediaGrid = $props();
</script>

<div class="media-grid"></div>

<style>
	.media-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
</style>
