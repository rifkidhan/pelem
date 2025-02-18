<script lang="ts">
	import type { LayoutProps } from './$types';

	import { page } from '$app/state';
	import { Banner, Hero } from '$lib/components';
	import { getYear } from '$lib/utils/format';
	import { find } from '$lib/utils/array';
	import { formatPlural } from '$lib/utils/format';
	import { SEASON_SUFFIXES, EPISODE_SUFFIXES } from '$lib/utils/constants';

	let { data, children }: LayoutProps = $props();

	let tv = $derived(data.tv);
	let subpath = $derived(page.url.pathname.match(/[^/]+/g)?.[2]);
	let seasonParam = $derived(page.params.season);

	let videoPreview = $derived.by(() => {
		if (tv.videos.results.length < 1) return undefined;

		let preview = tv.videos.results.find((v) => v.type === 'Trailer');

		if (!preview) {
			preview = tv.videos.results[0];
		}

		return preview;
	});

	let season = $derived.by(() => {
		if (!seasonParam) return undefined;

		return find(tv.seasons, (v) => v.season_number === parseInt(seasonParam));
	});
</script>

{#key page.url.pathname}
	{#if season}
		<Banner
			poster_path={season.poster_path}
			backdrop_path={tv.backdrop_path}
			page_name={season.name ?? ''}
			content_title={tv.name}
		/>
	{:else if subpath}
		<Banner
			poster_path={tv.poster_path}
			backdrop_path={tv.backdrop_path}
			page_name={subpath}
			content_title={tv.name}
		/>
	{:else}
		<Hero
			title={tv.name}
			overview={tv.overview}
			backdrop_path={tv.backdrop_path}
			poster_path={tv.poster_path}
			tagline={tv.tagline}
			vote_average={tv.vote_average}
			vote_count={tv.vote_count}
			genres={tv.genres}
			type="tv"
			video={videoPreview}
		>
			{#snippet misc()}
				{#if tv.certificate}
					<span>
						{tv.certificate.rating}
					</span>
				{/if}
				{#if tv.first_air_date}
					<span>
						{getYear(tv.first_air_date)}
					</span>
				{/if}
				<span>{tv.number_of_seasons} {formatPlural(tv.number_of_seasons, SEASON_SUFFIXES)}</span>
				<span>{tv.number_of_episodes} {formatPlural(tv.number_of_episodes, EPISODE_SUFFIXES)}</span>
			{/snippet}

			{#snippet creators()}
				{#if tv.created_by.length > 0}
					<div class="creators">
						<span>Creators</span>
						<div class="list-with-dot">
							{#each tv.created_by as creator}
								<span>{creator.name}</span>
							{/each}
						</div>
					</div>
				{/if}
			{/snippet}
		</Hero>
	{/if}

	{@render children()}
{/key}

<style>
	.creators {
		display: flex;
		flex-direction: column;

		& > span {
			font-weight: 600;
		}

		& > div {
			flex-wrap: wrap;
		}
	}
</style>
