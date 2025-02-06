<script lang="ts">
	import type { PageProps } from "./$types";

	import { Image } from "$lib/components";

	let { data }: PageProps = $props();

	let title = $derived(data.movie.title);
	let photos = $derived(data.movie.images);
	let videos = $derived(data.movie.videos.results);
</script>

<section>
	<h2 class="section-title">
		<span>
			Photos
		</span>
	</h2>
	<div class="photos">
		{#each photos as item, i}
			<div class="item">
				<Image
					src={item.file_path}
					alt={`${title}-${item.backdrop ? "backdrop" : "poster"}-${i}`}
					type={item.backdrop ? "backdrop" : "poster"}
				/>
			</div>
		{/each}
	</div>
</section>

<style>
	.photos {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		inline-size: 100%;
	}
	.item {
		display: block;
		inline-size: 100%;
		block-size: 100%;
	}
</style>
