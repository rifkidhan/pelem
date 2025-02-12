<script lang="ts">
	import type { PageProps } from "./$types";

	import { ytImage } from "$lib/actions/images.svelte";
	import { Banner, MediaGrid, Modal, YTEmbed } from "$lib/components";

	let { data }: PageProps = $props();

	let title = $derived(data.tv.name);
	let photos = $derived(data.tv.images);
	let videos = $derived(data.tv.videos.results);

	let modal = $state([]) as Modal[];
</script>

<main>
	<Banner
		page_name="Media"
		poster_path={data.tv.poster_path}
		backdrop_path={data.tv.backdrop_path}
		content_title={title}
	/>

	<section>
		<h2 class="section-title">
			<span>
				Photos
			</span>
		</h2>
		<MediaGrid {photos} {title} />
	</section>

	<section>
		<h2 class="section-title">
			<span>
				Videos
			</span>
		</h2>
		<div class="videos">
			{#each videos as video, i}
				{#if video.key}
					<div
						class="video"
						title={video.name}
						use:ytImage={{ key: video.key ?? "", quality: "hqdefault" }}
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
</main>

<style>
	.videos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.video {
			display: block;
			position: relative;
			contain: content;
			block-size: 100%;
			inline-size: auto;
			border-radius: var(--pf-radius);
			overflow: hidden;

			&::before {
				content: attr(title);
				display: block;
				position: absolute;
				top: 0;
				/* Pixel-perfect port of YT's gradient PNG, using https://github.com/bluesmoon/pngtocss plus optimizations */
				background-image: linear-gradient(
					180deg,
					rgb(0 0 0 / 67%) 0%,
					rgb(0 0 0 / 54%) 14%,
					rgb(0 0 0 / 15%) 54%,
					rgb(0 0 0 / 5%) 72%,
					rgb(0 0 0 / 0%) 94%
				);
				block-size: 99px;
				inline-size: 100%;
				font-family: 'YouTube Noto', Roboto, Arial, Helvetica, sans-serif;
				color: hsl(0deg 0% 93.33%);
				text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
				font-size: var(--pf-text-normal);
				padding-inline: clamp(0.3rem, 0.12rem + 12vw, 1rem);
				padding-block: clamp(0.15rem, 0.12rem + 12vi, 1.2rem);
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				box-sizing: border-box;
			}

			&::after {
				content: '';
				display: block;
				padding-bottom: calc(100% / (16 / 9));
			}

			& > button {
				display: block;
				/* Make the button element cover the whole area for a large hover/click target… */
				inline-size: 100%;
				block-size: 100%;
				/* …but visually it's still the same size */
				background: no-repeat center/68px 48px;
				/* YT's actual play button svg */
				background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
				position: absolute;
				cursor: pointer;
				z-index: 1;
				filter: grayscale(100%);
				transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
				border: 0;
			}
		}
	}
</style>
