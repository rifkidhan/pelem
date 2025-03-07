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
		{#if random.certificate}
			<span>{random.certificate.certificate}</span>
		{/if}
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
{#snippet viewMore(url: string)}
	<li class="view-more-card" aria-roledescription="item">
		<a href={`/movie/${url}`}>
			<Icon icon="arrow-right" hidden size={36} />
			<span> View more </span>
		</a>
	</li>
{/snippet}
<section>
	<h2 class="section-title">
		<span>Trending on this day</span>
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
		<span>Trending on this week</span>
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
		<span>Popular Movie</span>
	</h2>
	{#await data.popular}
		<Carousel label="skeleton" loading />
	{:then popular}
		<Carousel label="Top rated movies">
			{#each popular.results as item, i}
				<Card
					url={`/movie/${item.id}`}
					title={item.title}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					shadow
					as="li"
					rank={i + 1}
				/>
			{/each}
			{@render viewMore('popular')}
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
		<Carousel label="Top rated movies">
			{#each top_rated.results as item, i}
				<Card
					url={`/movie/${item.id}`}
					title={item.title}
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
<section>
	<h2 class="section-title">
		<span>On Cinema</span>
	</h2>
	{#await data.onCinema}
		<Carousel label="skeleton" loading />
	{:then cinema}
		<Carousel label="Playing movies">
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
			{#if cinema.page < cinema.total_pages}
				{@render viewMore('now-playing')}
			{/if}
		</Carousel>
	{/await}
</section>
<section>
	<h2 class="section-title">
		<span>Upcoming</span>
	</h2>
	{#await data.upcoming}
		<Carousel label="skeleton" loading />
	{:then upcoming}
		<Carousel label="Upcoming movies">
			{#each upcoming.results as item}
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
			{#if upcoming.page < upcoming.total_pages}
				{@render viewMore('upcoming')}
			{/if}
		</Carousel>
	{/await}
</section>
