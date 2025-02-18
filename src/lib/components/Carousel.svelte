<script lang="ts">
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import EmblaCarousel from 'embla-carousel';
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';

	interface CarouselProps {
		label: string;
		children?: Snippet;
		class?: ClassValue;
		loading?: boolean;
	}

	let { label, class: className, loading, children }: CarouselProps = $props();

	let viewport: HTMLElement | undefined = $state();
	let api: EmblaCarouselType | undefined = $state();
	let prevButtonDisable = $state(true);
	let nextButtonDisable = $state(false);
	let isScrollable = $state(true);
	let progress = $state(0);

	let embla_options: EmblaOptionsType = {
		align: 'center',
		loop: false,
		slidesToScroll: 'auto'
	};

	$effect(() => {
		if (!viewport) return;
		api = EmblaCarousel(viewport, embla_options);

		return () => {
			if (api) {
				api.destroy();
			}
		};
	});

	$effect(() => {
		if (!api) return;

		const buttonState = (e: EmblaCarouselType) => {
			prevButtonDisable = !e.canScrollPrev();
			nextButtonDisable = !e.canScrollNext();
		};

		api.on('select', buttonState).on('init', buttonState).on('reInit', buttonState);
	});

	$effect(() => {
		if (!api) return;

		const progressState = (e: EmblaCarouselType) => {
			progress = Math.max(0, Math.min(1, e.scrollProgress()));
		};

		api
			.on('init', progressState)
			.on('reInit', progressState)
			.on('scroll', progressState)
			.on('slideFocus', progressState);
	});

	$effect(() => {
		if (!api) return;

		const activeWhenHasScrollable = (e: EmblaCarouselType) => {
			isScrollable = !loading && e.internalEngine().scrollSnaps.length > 1;
			e.reInit({ active: isScrollable });
		};

		api.on('resize', activeWhenHasScrollable);
		activeWhenHasScrollable(api);
	});

	const prevOnclick = () => {
		if (api) api.scrollPrev();
	};
	const nextOnclick = () => {
		if (api) api.scrollNext();
	};
</script>

<div
	class={['carousel', className]}
	aria-roledescription="carousel"
	aria-label={`${label} Carousel`}
>
	<div class="viewport" bind:this={viewport} aria-label={`${label} carousel viewport`}>
		<ul class="container" role="group" aria-live="polite" aria-label="Items carousel">
			{#if loading}
				{#each { length: 8 }, i}
					<li id={`skeleton-${i}`} class="card-skeleton">
						<span></span>
						<span></span>
						<span></span>
					</li>
				{/each}
			{/if}
			{@render children?.()}
		</ul>
	</div>
	{#if isScrollable}
		<div class="controls">
			<div class="buttons">
				<Button
					id="prev"
					type="button"
					variant="secondary"
					size="square"
					aria-label="previous slide"
					onclick={prevOnclick}
					disabled={prevButtonDisable}
				>
					<Icon icon="chevron-left" hidden />
				</Button>
				<Button
					id="next"
					type="button"
					variant="secondary"
					size="square"
					aria-label="next slide"
					onclick={nextOnclick}
					disabled={nextButtonDisable}
				>
					<Icon icon="chevron-right" hidden />
				</Button>
			</div>
			<progress value={progress} max={1} class="progress-bar"></progress>
		</div>
	{/if}
</div>

<style>
	.carousel {
		container: carousel / inline-size;
		display: flex;
		flex-direction: column;
	}

	.viewport {
		--carousel-column-gap: calc(0.125rem + 2cqi);
		--carousel-column-width: calc(18cqw - var(--carousel-column-gap));
		overflow: hidden;
	}

	.container {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: var(--carousel-column-width);
		column-gap: var(--carousel-column-gap);
		touch-action: pan-y pinch-zoom;
		padding-block-start: calc(0.125rem + 1.2cqi);
		padding-block-end: calc(0.125rem + 3cqi);
	}

	.card-skeleton {
		inline-size: 100%;
		background-color: hsl(var(--pf-accent-5));
		border-radius: var(--pf-radius);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		& > * {
			animation: var(--pf-animation-pulse);
			background-color: hsl(var(--pf-accent-50));
			border-radius: var(--pf-radius);
			overflow: hidden;
		}

		& > :nth-child(1) {
			inline-size: 100%;
			block-size: clamp(150px, 25cqi + 2rem, 289px);
		}

		& > :nth-child(2) {
			inline-size: 6ch;
			block-size: 2ch;
			margin-block-start: 0.5rem;
			margin-inline: 0.5rem;
		}

		& > :nth-child(3) {
			inline-size: 10ch;
			block-size: 4ch;
			margin-block-end: 0.5rem;
			margin-inline: 0.5rem;
		}
	}

	.controls {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;

		@media (max-width: 768px) {
			gap: 0.5rem;
		}

		& > .progress-bar {
			height: 0.5rem;
			justify-self: flex-end;
			max-width: 90%;
			width: 12rem;
			align-self: center;
			overflow: hidden;
			border-radius: var(--pf-radius);
			border: solid 1px;
			display: block;
			appearance: none;

			&[value]::-webkit-progress-bar {
				background-color: hsl(var(--pf-accent-5));
			}

			&[value]::-webkit-progress-value,
			&[value]::-moz-progress-bar {
				background-color: hsl(var(--pf-primary));
			}
		}
	}

	@container carousel (max-width: 876px) {
		.viewport {
			--carousel-column-width: 20cqw;
		}
	}

	@container carousel (max-width: 462px) {
		.viewport {
			--carousel-column-width: 30cqw;
		}
	}
</style>
