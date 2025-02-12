<script lang="ts">
	import type { PageProps } from "./$types";

	import { Banner, Card, Link } from "$lib/components";
	import { formatDate } from "$lib/utils/format";
	import isNull from "$lib/utils/isNull";

	let { data }: PageProps = $props();

	let tv = $derived(data.tv);
	let season = $derived(data.season);
</script>
<main>
	<Banner
		page_name={season.name ?? `Season ${season.season_number}`}
		content_title={tv.name}
		poster_path={season.poster_path}
		backdrop_path={tv.backdrop_path}
	/>

	{#if !isNull(season.overview)}
		<section>
			<h2 class="section-title">
				<span>
					Overview
				</span>
			</h2>
			<p>
				{season.overview}
			</p>
		</section>
	{/if}

	<section>
		<h2 class="section-title">
			<span>
				List of episodes
			</span>
		</h2>
		<ul class="episodes">
			{#each season.episodes as item}
				<li>
					<details name="episode">
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
								<h4>
									Overview
								</h4>
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
</main>

<style>
	.episodes {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	details {
		display: flex;
		flex-direction: column;
		position: relative;
		box-shadow: var(--pf-shadow-md);
		border-radius: var(--pf-radius);
		overflow: hidden;
		font-size: var(--pf-text-sm);

		:global(summary) {
			cursor: pointer;
		}

		&::details-content {
			opacity: 0;
			block-size: 0;
			overflow-y: clip;
			transition: content-visibility 0.5s allow-discrete, opacity 0.5s, block-size 0.5s;
		}

		&[open]::details-content {
			opacity: 1;
			block-size: fit-content;
		}

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
</style>
