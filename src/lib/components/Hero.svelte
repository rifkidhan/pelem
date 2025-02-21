<script lang="ts">
	import type { Genre, Video } from '$lib/types';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
	import Image from './Image.svelte';
	import Modal from './Modal.svelte';
	import Truncate from './Truncate.svelte';
	import YtEmbed from './YTEmbed.svelte';

	interface HeroProps {
		title?: string;
		overview?: string;
		backdrop_path?: string;
		poster_path?: string;
		tagline?: string;
		vote_average: number;
		vote_count: number;
		genres: Genre[];
		video?: Video;
		type?: 'movie' | 'tv';
		misc: Snippet;
		creators?: Snippet;
		class?: ClassValue;
		title_element?: string;
	}

	let {
		title: heroTitle,
		overview: heroOverview,
		backdrop_path,
		poster_path,
		tagline,
		vote_average,
		vote_count,
		genres,
		video,
		type = 'movie',
		title_element = 'h1',
		creators,
		misc,
		...props
	}: HeroProps = $props();

	let videoModal = $state() as Modal;

	let title = $derived(heroTitle && heroTitle !== '' ? heroTitle : 'Untitled');
	let overview = $derived(
		heroOverview && heroOverview !== '' ? heroOverview : `No overview for this ${type}`
	);
</script>

<div class={['hero', props.class]}>
	<div class="backdrop">
		{#if backdrop_path}
			<Image src={backdrop_path} type="backdrop" full priority alt="" aria-hidden="true" />
		{/if}
	</div>
	<div class="wrapper">
		<div class="details">
			<div class="poster">
				<Image src={poster_path} alt={title} priority />
			</div>
			<div class="title">
				<svelte:element this={title_element} class="name">
					{title}
				</svelte:element>
				{#if tagline}
					<div class="tagline">{tagline}</div>
				{/if}
			</div>
			<div class="misc list-with-dot">
				{@render misc()}
			</div>
			<div class="genres list-with-dot">
				{#each genres as genre}
					<span>{genre.name}</span>
				{/each}
			</div>
			<div class="action">
				<div class="vote">
					<div class="icon">
						<Icon icon="star" stroke="none" />
					</div>
					<div class="score">
						<span>{Math.floor(vote_average * 10)}%</span>
						<span class="count">{vote_count}</span>
					</div>
				</div>
				{#if video && video.key}
					<Button type="button" variant="theme" onclick={() => videoModal.openModal()}>
						<Icon icon="play" hidden />
						Play {video.type}
					</Button>
					<Modal bind:this={videoModal} title={video.name}>
						<div class="embed-video">
							<YtEmbed videoKey={video.key} title={video.name} />
						</div>
					</Modal>
				{/if}
			</div>
			<div class="overview">
				<Truncate>
					{overview}
				</Truncate>
			</div>
			{#if creators}
				<div class="credits">
					{@render creators()}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.hero {
		inline-size: 100%;
		block-size: max-content;
		position: relative;
		color: var(--pf-white);
	}

	.backdrop {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		inline-size: 100%;
		block-size: 100%;
		background-color: var(--pf-accent-80);
	}

	.wrapper {
		inline-size: 100%;
		container: hero / inline-size;
		backdrop-filter: blur(48px) brightness(0.65);
		padding-block-start: calc(var(--pf-header-height) + 2rem);
		padding-block-end: 2rem;
	}

	.details {
		display: grid;
		grid-template-areas:
			'poster title title'
			'poster misc genres'
			'poster actions .'
			'poster overview overview'
			'poster credits credits';
		grid-template-columns: auto repeat(2, 1fr);
		grid-template-rows: 1fr repeat(2, auto) 1fr auto;
		max-inline-size: 92dvw;
		margin-inline: auto;
		column-gap: 3rem;
		row-gap: 1rem;
	}

	.poster {
		grid-area: poster;
		inline-size: 25cqw;
		block-size: fit-content;
		display: block;
		overflow: hidden;
		border-radius: var(--pf-radius);
		box-shadow: var(--pf-shadow-md);
	}

	.title {
		grid-area: title;

		& > .name {
			text-wrap: balance;
			font-size: var(--pf-text-xl);
			font-weight: 600;
			line-height: 1;
		}

		.tagline {
			font-size: var(--pf-text-md);
			font-style: italic;
			display: block;
		}
	}

	.misc {
		grid-area: misc;
	}

	.genres {
		grid-area: genres;
		flex-wrap: wrap;
	}

	.action {
		grid-area: actions;
		display: flex;
		align-items: center;
		gap: 1.5rem;

		& > .vote {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.25rem;

			& > .icon {
				inline-size: 2.5rem;
				block-size: 2.5rem;

				& > :global(svg) {
					fill: var(--pf-sunflower);
					inline-size: 100%;
					block-size: auto;
				}
			}

			& > .score {
				display: flex;
				flex-direction: column;

				& > :not(.count) {
					font-weight: 600;
				}

				& > .count {
					font-size: var(--pf-text-sm);
				}
			}
		}
	}

	.overview {
		grid-area: overview;
		text-wrap: pretty;
	}

	.embed-video {
		width: calc(60dvw + 2rem);
	}

	.credits {
		grid-area: credits;
		display: grid;
		grid-template-columns: subgrid;
		row-gap: 0.5rem;
	}

	@container hero (max-width: 1024px) {
		.details {
			grid-template-areas:
				'poster title'
				'poster misc'
				'poster actions'
				'poster overview'
				'poster genres'
				'poster credits';

			grid-template-columns: auto 1fr;
			grid-template-rows: 1fr repeat(2, auto) 1fr repeat(2, auto);
		}
	}

	@container hero (max-width: 848px) {
		.details {
			grid-template-areas:
				'poster'
				'title'
				'misc'
				'actions'
				'genres'
				'overview'
				'credits';

			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr repeat(3, auto) 1fr auto;
			place-items: center;
		}

		.poster {
			inline-size: 35cqw;
		}

		.title {
			text-align: center;
		}
	}
</style>
