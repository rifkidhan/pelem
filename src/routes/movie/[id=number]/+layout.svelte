<script lang="ts">
	import type { LayoutProps } from './$types';

	import { page } from '$app/state';
	import { Banner, Hero } from '$lib/components';
	import { find } from '$lib/utils/array';
	import { formatRuntime, getYear } from '$lib/utils/format';

	let { data, children }: LayoutProps = $props();

	let movie = $derived(data.movie);

	let subpath = $derived(page.url.pathname.match(/[^/]+/g)?.[2]);

	let videoPreview = $derived.by(() => {
		if (movie.videos.results.length < 1) return undefined;

		let preview = find(movie.videos.results, (v) => v.type === 'Trailer');

		if (!preview) {
			preview = movie.videos.results[0];
		}

		return preview;
	});

	let directors = $derived(movie.credits.crew.filter((v) => v.job === 'Director'));
	let writers = $derived(movie.credits.crew.filter((v) => v.department === 'Writing'));
	$inspect(movie);
</script>

{#key movie.id}
	{#if subpath}
		<Banner
			poster_path={movie.poster_path}
			backdrop_path={movie.backdrop_path}
			page_name={subpath}
			content_title={movie.title}
		/>
	{:else}
		<Hero
			title={movie.title}
			overview={movie.overview}
			poster_path={movie.poster_path}
			backdrop_path={movie.backdrop_path}
			tagline={movie.tagline}
			vote_average={movie.vote_average}
			vote_count={movie.vote_count}
			genres={movie.genres}
			video={videoPreview}
		>
			{#snippet misc()}
				{#if movie.certificate}
					<span>
						{movie.certificate.certificate}
					</span>
				{/if}
				{#if movie.release_date}
					<span>{getYear(movie.release_date)}</span>
				{/if}

				{#if movie.runtime}
					<span>{formatRuntime(movie.runtime)}</span>
				{/if}
			{/snippet}

			{#snippet creators()}
				<div class="creators">
					<span>Director</span>
					<div class="list-with-dot">
						{#each directors as director}
							<span>{director.name}</span>
						{/each}
					</div>
				</div>
				<div class="creators">
					<span>Writer</span>
					<div class="list-with-dot">
						{#each writers as writer}
							<span>{writer.name}</span>
						{/each}
					</div>
				</div>
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
