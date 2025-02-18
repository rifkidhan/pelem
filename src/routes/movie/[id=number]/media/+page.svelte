<script lang="ts">
	import type { PageProps } from './$types';

	import { ytImage } from '$lib/actions/images.svelte';
	import { MediaGrid, Modal, YTEmbed } from '$lib/components';

	let { data }: PageProps = $props();

	let title = $derived(data.movie.title);
	let photos = $derived(data.movie.images);
	let videos = $derived(data.movie.videos.results);

	let modal = $state([]) as Modal[];
</script>

<section>
	<h2 class="section-title">
		<span>Photos</span>
	</h2>
	<MediaGrid {photos} {title} />
</section>

<section>
	<h2 class="section-title">
		<span>Videos</span>
	</h2>
	<div class="videos" role="list">
		{#each videos as video, i}
			{#if video.key}
				<div
					class="video"
					title={video.name}
					use:ytImage={{ key: video.key ?? '', quality: 'hqdefault' }}
					role="listitem"
				>
					<button type="button" onclick={modal[i].openModal}>
						<span class="sr-only">Play: {title}</span>
					</button>
				</div>
				<Modal title={video.name} bind:this={modal[i]}>
					<YTEmbed videoKey={video.key} title={video.name} />
				</Modal>
			{/if}
		{/each}
	</div>
</section>

<style>
	.videos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
