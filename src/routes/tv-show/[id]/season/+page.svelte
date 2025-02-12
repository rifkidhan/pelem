<script lang="ts">
	import type { PageProps } from "./$types";

	import { Banner, Card } from "$lib/components";
	import { formatDate } from "$lib/utils/format";

	let { data }: PageProps = $props();

	let tv = $derived(data.tv);
	let seasons = $derived(data.tv.seasons);

	const getSeasonName = (name?: string) => {
		if (!name) return false;

		return name.toLowerCase().startsWith("season", 0);
	};
</script>

<main>
	<Banner
		page_name="Season list"
		content_title={tv.name}
		poster_path={tv.poster_path}
		backdrop_path={tv.poster_path}
	/>

	<div class="list-seasons">
		{#each seasons as item, i}
			<Card
				title={item.name}
				img={item.poster_path}
				url={`/tv-show/${tv.id}/season/${item.season_number}`}
				shadow
				class="custom-card"
			>
				<h2>
					<span>
						{item.name}
					</span>
					{#if !getSeasonName(item.name) && i !== 0}
						<span>(Season {item.season_number})</span>
					{/if}
				</h2>
				<p>{item.episode_count} episodes</p>
				{#if item.air_date}
					<p>Premiered on {formatDate(item.air_date)}</p>
				{/if}

				{#if item.overview}
					<p>{item.overview}</p>
				{/if}
			</Card>
		{/each}
	</div>
</main>

<style>
	.list-seasons {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		max-inline-size: 92dvw;
		inline-size: 100%;
		margin-inline: auto;
	}

	h2 {
		font-weight: 600;
		font-size: var(--pf-text-md);

		:global(.custom-card):hover & {
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}
</style>
