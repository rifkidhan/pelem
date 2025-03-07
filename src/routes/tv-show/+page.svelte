<script lang="ts">
	import type { PageProps } from './$types';

	import { Button, Card, Carousel, Hero, Icon } from '$lib/components';
	import { find } from '$lib/utils/array';
	import { getYear } from '$lib/utils/format';

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
	title={random.name}
	title_element="h2"
	overview={random.overview}
	genres={random.genres}
	vote_average={random.vote_average}
	vote_count={random.vote_count}
	tagline={random.tagline}
	poster_path={random.poster_path}
	backdrop_path={random.backdrop_path}
	type="tv"
	video={videoPreview}
>
	{#snippet misc()}
		{#if random.certificate}
			<span>{random.certificate.rating}</span>
		{/if}
		{#if random.first_air_date}
			<span>{getYear(random.first_air_date)}</span>
		{/if}
	{/snippet}
	{#snippet creators()}
		<Button href={`/tv-show/${random.id}`} variant="theme">
			<span>
				Go to {random.name}
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
				url={`/tv-show/${item.id}`}
				title={item.name}
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
		<span>Trending on this week</span>
	</h2>
	{#await data.weekTrending}
		<Carousel label="skeleton" loading />
	{:then trending}
		<Carousel label="Trending on this week">
			{#each trending.results as item}
				<Card
					url={`/tv-show/${item.id}`}
					title={item.name}
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

{#snippet viewMore(url: string)}
	<li class="view-more-card" aria-roledescription="item">
		<a href={`/tv-show/${url}`}>
			<Icon icon="arrow-right" hidden size={36} />
			<span> View more </span>
		</a>
	</li>
{/snippet}

<section>
	<h2 class="section-title">
		<span>Top Rated Series</span>
	</h2>
	{#await data.top_rated}
		<Carousel label="skeleton" loading />
	{:then top_rated}
		<Carousel label="Trending on this week">
			{#each top_rated.results as item, i}
				<Card
					url={`/tv-show/${item.id}`}
					title={item.name}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					shadow
					as="li"
					rank={i + 1}
				/>
			{/each}
			{@render viewMore('top-rated')}
		</Carousel>
	{/await}
</section>
