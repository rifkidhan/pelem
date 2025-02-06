<script lang="ts">
	import type { PageProps } from "./$types";

	import { Card, Carousel, HeroSlider } from "$lib/components";

	let { data }: PageProps = $props();

	let movieTrending = $derived(data.trendingMovie);
	let tvTrending = $derived(data.trendingTv);
	let allTrending = $derived(data.trendingAll);
</script>

<main>
	<h1 class="sr-only">Welcome to Pelem.</h1>
	<svelte:boundary>
		<HeroSlider label="Trending on this day" data={allTrending} />
	</svelte:boundary>
	<section>
		<div>
			<h2 class="section-title">
				<span>
					Trending Movie
				</span>
			</h2>
			<p>Trending movie on this week</p>
		</div>
		<Carousel label="Movie Trending">
			{#each movieTrending as item (item.id)}
				<Card
					id={String(item.id)}
					url={`/movie/${item.id}`}
					title={item.title}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
				/>
			{/each}
		</Carousel>
	</section>
	<section>
		<div>
			<h2 class="section-title">
				<span>
					Trending Series
				</span>
			</h2>
			<p>Trending series on this week</p>
		</div>
		<Carousel label="Series Trending">
			{#each tvTrending as item (item.id)}
				<Card
					id={String(item.id)}
					url={`/tv-show/${item.id}`}
					title={item.name}
					img={item.poster_path}
					rating={item.vote_average}
					aria-roledescription="item"
					type="tv"
				/>
			{/each}
		</Carousel>
	</section>
</main>
