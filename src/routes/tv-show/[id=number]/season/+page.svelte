<script lang="ts">
	import type { PageProps } from './$types';

	import { Card } from '$lib/components';
	import { formatDate, formatPlural } from '$lib/utils/format';
	import { EPISODE_SUFFIXES } from '$lib/utils/constants';

	let { data }: PageProps = $props();

	let tv = $derived(data.tv);
	let seasons = $derived(data.tv.seasons);
</script>

<div class="list-seasons" role="list">
	{#each seasons as item}
		<Card
			title={item.name}
			img={item.poster_path}
			url={`/tv-show/${tv.id}/season/${item.season_number}`}
			shadow
			class="custom-card"
			role="listitem"
		>
			<h2>
				<span>
					{item.name}
				</span>
			</h2>
			<p>{item.episode_count} {formatPlural(item.episode_count, EPISODE_SUFFIXES)}</p>
			{#if item.air_date}
				<p>Premiered on {formatDate(item.air_date)}</p>
			{/if}

			{#if item.overview}
				<p>{item.overview}</p>
			{/if}
		</Card>
	{/each}
</div>

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
