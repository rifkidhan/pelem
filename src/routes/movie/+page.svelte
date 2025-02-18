<script lang="ts">
	import type { PageProps } from './$types';

	import { Button, Card, Carousel, Hero, Icon } from '$lib/components';
	import { find } from '$lib/utils/array';
	import { formatRuntime, getYear } from '$lib/utils/format';

	let { data }: PageProps = $props();

	let day = $derived(data.dayTrending.results);
	let random = $derived(data.random);

	let videoPreview = $derived.by(() => {
		if (random.videos.results.length < 1) return undefined;

		let preview = find(random.videos.results, (v) => v.type === 'Trailer');

		if (!preview) {
			preview = random.videos.results[0];
		}

		return preview;
	});
</script>

<h1 class="sr-only">Movies</h1>
<Hero
	title={random.title}
	title_element="h2"
	overview={random.overview}
	genres={random.genres}
	vote_average={random.vote_average}
	vote_count={random.vote_count}
	tagline={random.tagline}
	poster_path={random.poster_path}
	backdrop_path={random.backdrop_path}
	video={videoPreview}
>
	{#snippet misc()}
		{#if random.release_date}
			<span>{getYear(random.release_date)}</span>
		{/if}

		{#if random.runtime}
			<span>{formatRuntime(random.runtime)}</span>
		{/if}
	{/snippet}
	{#snippet creators()}
		<Button href={`/movie/${random.id}`} variant="theme">
			<span>
				Go to {random.title}
			</span>
			<Icon icon="arrow-right" hidden />
		</Button>
	{/snippet}
</Hero>
<section>
	<h2 class="section-title">
		<span> Trending on this day </span>
	</h2>
	<Carousel label="Trending on this day">
		{#each day as item}
			<Card
				url={`/movie/${item.id}`}
				title={item.title}
				img={item.poster_path}
				rating={item.vote_average}
				aria-roledescription="item"
				shadow
				as="li"
			/>
		{/each}
	</Carousel>
</section>
<section>
	<h2 class="section-title">
		<span> Trending on this week </span>
	</h2>
	{#await data.weekTrending}
		<Carousel label="skeleton" loading />
	{:then trending}
		<Carousel label="Trending on this week">
			{#each trending.results as item}
				<Card
					url={`/movie/${item.id}`}
					title={item.title}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					shadow
					as="li"
				/>
			{/each}
		</Carousel>
	{/await}
</section>
<section>
	<h2 class="section-title">
		<span>Top Rated Movie</span>
	</h2>
	{#await data.topRated}
		<Carousel label="skeleton" loading />
	{:then top_rated}
		<Carousel label="Trending on this week">
			{#each top_rated.results as item}
				<Card
					url={`/movie/${item.id}`}
					title={item.title}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					shadow
					as="li"
				/>
			{/each}
		</Carousel>
	{/await}
</section>
<section>
	<h2 class="section-title">
		<span> On Cinema </span>
	</h2>
	{#await data.onCinema}
		<Carousel label="skeleton" loading />
	{:then cinema}
		<Carousel label="Trending on this week">
			{#each cinema.results as item}
				<Card
					url={`/movie/${item.id}`}
					title={item.title}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					shadow
					as="li"
				/>
			{/each}
		</Carousel>
	{/await}
</section>
