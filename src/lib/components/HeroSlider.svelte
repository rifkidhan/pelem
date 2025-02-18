<script lang="ts">
	import type { MovieTV } from '$lib/types';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';

	import { browser } from '$app/environment';
	import { getYear } from '$lib/utils/format';
	import EmblaCarousel from 'embla-carousel';
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
	import Image from './Image.svelte';

	interface CarouselProps {
		label: string;
		data: Array<MovieTV>;
	}

	let { label, data }: CarouselProps = $props();

	let trendings = $derived(data.filter((v) => v.media_type !== 'person').slice(0, 7));
	let viewport = $state() as HTMLElement;
	let api: EmblaCarouselType | undefined = $state();
	let slideInView = $state(0);

	const embla_options: EmblaOptionsType = {
		align: 'center',
		loop: true,
		slidesToScroll: 'auto'
	};

	$effect(() => {
		if (browser) {
			api = EmblaCarousel(viewport, embla_options);
		}

		return () => {
			if (api) {
				api.destroy();
			}
		};
	});

	$effect(() => {
		if (!api) return;

		const dotState = (e: EmblaCarouselType) => {
			slideInView = e.selectedScrollSnap();
		};

		api.on('init', dotState).on('reInit', dotState).on('select', dotState);
	});

	const setSlideInView = (slide: number) => {
		if (!api) return;

		api.scrollTo(slide);
	};
</script>

<div class="carousel" aria-roledescription="carousel" aria-label={`${label} Carousel`}>
	<div class="viewport" bind:this={viewport} aria-label={`${label} carousel viewport`}>
		<ul class="container" role="group" aria-live="polite" aria-label="Items carousel">
			{#each trendings as item (item.id)}
				<li class="slide" aria-roledescription="item">
					<div class="backdrop">
						<Image
							type="backdrop"
							src={item.backdrop_path}
							alt={`${item.title ?? item.name} backdrop`}
							priority
							full
						/>
					</div>
					<div class="content-wrapper">
						<div class="content">
							<div class="title">{item.title ?? item.name}</div>
							<ul class="details list-with-dot">
								<li class="rating">
									<Icon icon="star" stroke="none" hidden />
									<span>{Math.floor(item.vote_average * 10)}%</span>
								</li>
								{#if item.release_date || item.first_air_date}
									<li>{getYear(item.release_date ?? item.first_air_date ?? '')}</li>
								{/if}
							</ul>
							<div class="overview">{item.overview}</div>
							<Button href={`/${item.media_type === 'tv' ? 'tv-show' : 'movie'}/${item.id}`}>
								<span>
									Go to {item.name ?? item.title}
								</span>
								<Icon icon="arrow-right" hidden />
							</Button>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<div class="controls">
		<div class="dots">
			{#each trendings as trending, index (trending.id)}
				<button
					type="button"
					class="dot"
					aria-label={`Slide ${index + 1}`}
					aria-current={slideInView === index}
					onclick={() => setSlideInView(index)}
				>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.carousel {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.viewport {
		overflow: hidden;
	}

	.container {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 100%;
		touch-action: pan-y pinch-zoom;
	}

	.slide {
		display: block;
		position: relative;
		inline-size: 100%;
		block-size: max-content;
	}

	.backdrop {
		inline-size: 80%;
		block-size: 100%;
		position: absolute;
		display: block;
		top: 0;
		right: 0;
		z-index: -1;
		mask-image: linear-gradient(90deg, transparent, transparent 8%, black 50%);

		@media (max-width: 867px) {
			inline-size: 70%;
			mask-image: linear-gradient(90deg, transparent, transparent 15%, black 50%);
		}

		@media (max-width: 512px) {
			position: relative;
			inline-size: 100%;
			mask-image: linear-gradient(0deg, transparent, transparent 15%, black 50%);
		}
	}

	.content-wrapper {
		inline-size: 93dvw;
		display: block;
		margin-inline: auto;
		block-size: 80dvh;
		position: relative;

		@media (max-width: 867px) {
			block-size: 65dvh;
		}

		@media (max-width: 512px) {
			block-size: fit-content;
			bottom: 3lh;
		}
	}

	.content {
		inline-size: 50%;
		block-size: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;

		@media (max-width: 867px) {
			inline-size: 70%;
		}

		@media (max-width: 512px) {
			inline-size: 100%;
		}

		& > .title {
			font-size: var(--pf-text-xl);
			font-weight: 600;
			line-height: 1.2;
			text-wrap: balance;
		}

		& > .overview {
			line-height: 1.3;
			max-height: fit-content;

			@media (max-width: 512px) {
				max-block-size: 3lh;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				line-clamp: 3;
			}
		}

		.rating {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;

			& > :global(svg) {
				fill: hsl(var(--pf-sunflower));
				max-inline-size: 1rem;
				block-size: auto;
			}
		}
	}

	.controls {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 1rem;
		inset-inline: 0;

		& > .dots {
			display: flex;
			gap: 0.5rem;

			& > button {
				inline-size: 1rem;
				block-size: 1rem;
				border: solid 2px hsl(var(--pf-accent-90));
				border-radius: var(--pf-radius);

				&[aria-current='true'] {
					background-color: hsl(var(--pf-accent-90));
				}
			}
		}
	}
</style>
