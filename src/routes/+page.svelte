<script lang="ts">
	import type { PageProps } from './$types';

	import { Card, Carousel, HeroSlider } from '$lib/components';

	let { data }: PageProps = $props();

	let movieTrending = $derived(data.trendingMovie);
	let tvTrending = $derived(data.trendingTv);
	let allTrending = $derived(data.trendingAll);
</script>

<h1 class="sr-only">Welcome to Pelem.</h1>
<HeroSlider label="Trending on this day" data={allTrending} />
<section>
	<div>
		<h2 class="section-title">
			<span> Trending Movie </span>
		</h2>
		<p>Trending movie on this week</p>
	</div>
	<Carousel label="Movie Trending">
		{#each movieTrending as item (item.id)}
			<Card
				as="li"
				url={`/movie/${item.id}`}
				title={item.title}
				img={item.poster_path}
				rating={item.vote_average}
				aria-roledescription="item"
				shadow
			/>
		{/each}
	</Carousel>
</section>
<section>
	<div>
		<h2 class="section-title">
			<span> Trending Series </span>
		</h2>
		<p>Trending series on this week</p>
	</div>
	<Carousel label="Series Trending">
		{#each tvTrending as item (item.id)}
			<Card
				as="li"
				url={`/tv-show/${item.id}`}
				title={item.name}
				img={item.poster_path}
				rating={item.vote_average}
				aria-roledescription="item"
				shadow
			/>
		{/each}
	</Carousel>
</section>
