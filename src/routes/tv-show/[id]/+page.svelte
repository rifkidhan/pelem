<script lang="ts">
	import type { PageProps } from "./$types";

	import { Card, Carousel, Hero, Image, ListItem, OfficialSite } from "$lib/components";
	import { formatCountryName, formatDate, formatLanguage, getYear } from "$lib/utils/format";
	import isNull from "$lib/utils/isNull";

	let { data }: PageProps = $props();

	let tv = $derived(data.tv);

	let videoPreview = $derived.by(() => {
		if (tv.videos.results.length < 1) return undefined;

		let preview = tv.videos.results.find((v) => v.type === "Trailer");

		if (!preview) {
			preview = tv.videos.results[0];
		}

		return preview;
	});

	let officialSiteShow = $derived.by(() => {
		const ids = tv.external_ids;

		if (
			isNull(tv.homepage) || isNull(ids.facebook_id) || isNull(ids.instagram_id)
			|| isNull(ids.twitter_id)
		) {
			return false;
		}
		return true;
	});

	// $inspect(tv);
</script>

{#key tv.id}
	<main>
		<Hero
			title={tv.name}
			overview={tv.overview}
			backdrop_path={tv.backdrop_path}
			poster_path={tv.poster_path}
			tagline={tv.tagline}
			vote_average={tv.vote_average}
			vote_count={tv.vote_count}
			genres={tv.genres}
			type="tv"
			video={videoPreview}
		>
			{#snippet misc()}
				{#if tv.certificate}
					<span>
						{tv.certificate.rating}
					</span>
				{/if}
				{#if tv.first_air_date}
					<span>
						{getYear(tv.first_air_date)}
					</span>
				{/if}
				<span>{tv.number_of_seasons} seasons</span>
				<span>{tv.number_of_episodes} episodes</span>
			{/snippet}

			{#snippet creators()}
				{#if tv.created_by.length > 0}
					<div class="creators">
						<span>Creators</span>
						<div>
							{#each tv.created_by as creator}
								<span>{creator.name}</span>
							{/each}
						</div>
					</div>
				{/if}
			{/snippet}
		</Hero>

		{#if tv.last_episode_to_air}
			<section>
				<h2>
					<span>Episodes</span>
				</h2>
				<div class="episodes">
					{#if tv.next_episode_to_air}
						<div class="episode">
							{#if tv.next_episode_to_air.still_path}
								<Image
									src={tv.next_episode_to_air.still_path}
									alt={`Season ${tv.next_episode_to_air.season_number}${tv.next_episode_to_air.name}`}
									type="still"
								/>
							{/if}
							<div class="episode-content">
								<div class="current">Next Episode</div>
								<p class="title">
									<span>
										S{tv.next_episode_to_air.season_number}:E{tv.next_episode_to_air.episode_number}
									</span>
									<span>
										{tv.next_episode_to_air.name}
									</span>
								</p>
								<p class="date">
									{formatDate(tv.next_episode_to_air.air_date ?? "")}
								</p>
								<p class="overview">
									{tv.next_episode_to_air.overview}
								</p>
							</div>
						</div>
					{:else}
						<div class="episode">
							{#if tv.last_episode_to_air.still_path}
								<Image
									src={tv.last_episode_to_air.still_path}
									alt={`Season ${tv.last_episode_to_air.season_number}${tv.last_episode_to_air.name}`}
									type="still"
								/>
							{/if}
							<div class="episode-content">
								<div class="current">last Episode</div>
								<p class="title">
									<span>
										S{tv.last_episode_to_air.season_number}:E{tv.last_episode_to_air.episode_number}
									</span>
									<span>
										{tv.last_episode_to_air.name}
									</span>
								</p>
								<p class="date">
									{formatDate(tv.last_episode_to_air.air_date ?? "")}
								</p>
								<p class="overview">
									{tv.last_episode_to_air.overview}
								</p>
							</div>
						</div>
					{/if}
				</div>
			</section>
		{/if}
		<section>
			<h2>
				<span>Cast</span>
			</h2>
			<Carousel label="Cast">
				{#each tv.aggregate_credits.cast.slice(0, 9) as cast}
					<Card
						id={String(cast.id)}
						img={cast.profile_path}
						url={`/people/${cast.id}`}
						title={cast.name}
						type="people"
						aria-roledescription="item"
					>
						<div class="cast-role">
							<span>{cast.roles[0].character}</span>
							<span class="role-count">{cast.roles[0].episode_count} episodes</span>
						</div>
					</Card>
				{/each}
			</Carousel>
		</section>

		<section>
			<h2>
				<span>
					Details
				</span>
			</h2>
			<ul class="details">
				{#if tv.original_name && tv.original_name !== tv.name}
					<ListItem heading="Original name">
						{tv.original_name}
					</ListItem>
				{/if}
				<ListItem heading="Series status">
					{tv.status}
				</ListItem>

				{#if tv.first_air_date}
					<ListItem heading="First air date">
						{formatDate(tv.first_air_date)}
					</ListItem>
				{/if}

				<ListItem heading="Series type">
					{tv.type}
				</ListItem>

				{#if tv.original_language}
					<ListItem heading="Original language">
						{formatLanguage(tv.original_language)}
					</ListItem>
				{/if}

				{#if officialSiteShow}
					<ListItem heading="Official site">
						<OfficialSite
							homepage={tv.homepage}
							facebook_id={tv.external_ids.facebook_id}
							twitter_id={tv.external_ids.twitter_id}
							instagram_id={tv.external_ids.instagram_id}
						/>
					</ListItem>
				{/if}

				{#if tv.production_countries.length > 0}
					<ListItem heading="Production countries">
						{#each tv.production_countries as item}
							<span>{formatCountryName(item.iso_3166_1)}</span>
						{/each}
					</ListItem>
				{/if}

				{#if tv.production_companies.length > 0}
					<ListItem heading="Production companies">
						{#each tv.production_companies as item}
							<span>{item.name}</span>
						{/each}
					</ListItem>
				{/if}

				<ListItem heading="Network">
					{#each tv.networks as network}
						<span>{network.name}</span>
					{/each}
				</ListItem>

				{#if tv.keywords.results.length > 0}
					<ListItem heading="Keywords">
						{#each tv.keywords.results as item}
							<span>{item.name}</span>
						{/each}
					</ListItem>
				{/if}
			</ul>
		</section>

		{#if tv.recommendations.results.length > 0}
			<section>
				<h2><span>Recommendations</span></h2>
				<Carousel label={`recommendations from ${tv.name}`}>
					{#each tv.recommendations.results as recommend (recommend.id)}
						<Card
							id={String(recommend.id)}
							img={recommend.poster_path}
							url={`/tv-show/${recommend.id}`}
							title={recommend.name}
							rating={recommend.vote_average}
							type="tv"
							aria-roledescription="item"
						/>
					{/each}
				</Carousel>
			</section>
		{/if}
	</main>
{/key}

<style>
	section {
		display: flex;
		margin-inline: auto;
		max-inline-size: 92dvw;
		inline-size: 100%;
		flex-direction: column;
		gap: 1.5rem;

		& > h2 {
			font-size: var(--pf-text-lg);
			font-weight: 700;
			position: relative;
			line-height: 1;
			width: fit-content;

			& > span {
				margin-inline-start: 0.5ch;
			}

			&::before {
				content: '';
				inline-size: 2.5ch;
				block-size: 100%;
				position: absolute;
				top: 0;
				background-color: hsl(var(--pf-primary-light));
				z-index: -1;
			}
		}
	}

	.creators {
		display: flex;
		flex-direction: column;

		& > span {
			font-weight: 600;
		}

		& > div {
			display: flex;
			flex-wrap: wrap;

			& > span:not(:last-child)::after {
				content: '•';
				margin-inline: 0.5rem;
			}
		}
	}

	.cast-role {
		line-height: 1.2;
		font-size: var(--pf-text-sm);

		& > span {
			display: block;
		}

		.role-count {
			color: hsl(var(--pf-accent-60));
		}
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.episode {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;

		.episode-content {
			& > .current {
				text-transform: uppercase;
			}

			& > .title {
				font-size: var(--pf-text-md);
				line-height: 1;
			}
		}
	}
</style>
