<script lang="ts">
	import type { PageProps } from './$types';
	import { Banner, Card, Pagination } from '$lib/components';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	let lists = $derived(data.lists);
	let pageName = $derived(data.meta.title);
	let pageNow = $derived(Number(page.url.searchParams.get('page')));
	let needRank = $derived(page.params.slug === 'top-rated' || page.params.slug === 'popular');
</script>

{#key page.url}
	<Banner
		page_name={pageName}
		content_title={`Page ${Math.max(pageNow, 1)}`}
		backdrop_path={lists.results[0].backdrop_path}
	/>

	<section>
		{#each lists.results as item, i}
			<Card
				title={item.title}
				img={item.poster_path}
				rating={item.vote_average}
				shadow
				url={`/movie/${item.id}`}
				rank={needRank ? i + 1 + (Math.max(pageNow, 1) - 1) * 20 : undefined}
			>
				{#snippet content()}
					<p class="overview">{item.overview}</p>
				{/snippet}
			</Card>
		{/each}
	</section>
	<Pagination
		page={Math.max(1, pageNow)}
		total_pages={lists.total_pages}
		url={`/movie/${page.params.slug}`}
		max_total_pages={5}
	/>
{/key}
