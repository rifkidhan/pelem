<script lang="ts">
	import type { PageProps } from './$types';

	import { Card, Link, Modal, YTEmbed } from '$lib/components';
	import { formatDate } from '$lib/utils/format';
	import isNull from '$lib/utils/isNull';
	import { ytImage } from '$lib/actions/images.svelte';

	let { data }: PageProps = $props();

	let season = $derived(data.season);

	let modal = $state([]) as Modal[];

	$inspect(season);
</script>

{#if !isNull(season.overview)}
	<section>
		<h2 class="section-title">
			<span>Overview</span>
		</h2>
		<p>
			{season.overview}
		</p>
	</section>
{/if}

<section>
	<h2 class="section-title">
		<span>List of episodes</span>
	</h2>
	<ul class="episodes">
		{#each season.episodes as item, i}
			<li>
				<details name="episode" open={i === 0}>
					<Card
						as="summary"
						title={item.name ?? `Episode ${item.episode_number}`}
						img={item.still_path}
						img_type="still"
					>
						<h3>
							<span>{item.episode_number}.</span>
							<span>
								{item.name}
							</span>
						</h3>
						{#if item.air_date}
							<p>
								Premiered on {formatDate(item.air_date)}.
							</p>
						{/if}
					</Card>
					<div class="episode-details">
						<div class="overview">
							<h4>Overview</h4>
							<p>
								{#if !isNull(item.overview)}
									{item.overview}
								{:else}
									No overview.
								{/if}
							</p>
						</div>
						<ul class="credits">
							<h4>Guest Stars</h4>
							{#if !isNull(item.guest_stars)}
								{#each item.guest_stars as cast}
									<li>
										<Link href={`/people/${cast.id}`}>
											{cast.name}
										</Link>
									</li>
								{/each}
							{:else}
								<li>No guest star on this episode.</li>
							{/if}
						</ul>
						<ul class="credits">
							<h4>Crew</h4>
							{#if !isNull(item.crew)}
								{#each item.crew as crew}
									<li>
										<Link href={`/people/${crew.id}`}>
											{crew.name}
										</Link>
									</li>
								{/each}
							{:else}
								<li>No crew provided.</li>
							{/if}
						</ul>
					</div>
				</details>
			</li>
		{/each}
	</ul>
</section>

{#if !isNull(season.videos.results)}
	<section>
		<h2 class="section-title">
			<span>Videos</span>
		</h2>

		<div class="videos">
			{#each season.videos.results as video, i}
				{#if video.key}
					<div
						class="video"
						title={video.name}
						use:ytImage={{ key: video.key ?? '', quality: 'hqdefault' }}
						role="listitem"
					>
						<button type="button" onclick={modal[i].openModal}>
							<span class="sr-only">Play: {video.name}</span>
						</button>
					</div>
					<Modal title={video.name} bind:this={modal[i]}>
						<YTEmbed videoKey={video.key} title={video.name} />
					</Modal>
				{/if}
			{/each}
		</div>
	</section>
{/if}

<style>
	.episodes {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	details {
		font-size: var(--pf-text-sm);

		h3 {
			font-size: var(--pf-text-normal);
			font-weight: 500;
			display: flex;
			gap: 0.5rem;

			& > span:first-child {
				flex-shrink: 0;
			}
		}

		.episode-details {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;

			h4 {
				font-weight: 600;
			}

			.credits {
				display: grid;
				grid-template-columns: repeat(4, minmax(0, 1fr));
				gap: 0.5rem;

				@media (max-width: 768px) {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}

				& > h4 {
					grid-column: 1 / -1;
				}
			}
		}
	}

	.videos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
