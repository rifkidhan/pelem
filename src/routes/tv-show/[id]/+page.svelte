<script lang="ts">
	import type { PageProps } from "./$types";

	import {
		Card,
		Carousel,
		Hero,
		Image,
		Link,
		ListItem,
		MediaGrid,
		OfficialSite,
		Truncate
	} from "$lib/components";
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

	$inspect(tv);
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

		{#if tv.last_episode_to_air || tv.next_episode_to_air}
			<section>
				<h2>
					<span>Episodes</span>
				</h2>
				<div class="episodes">
					{#if tv.next_episode_to_air}
						<Card shadow title={tv.next_episode_to_air.name}>
							{#snippet thumbnail()}
								{#if tv.next_episode_to_air?.still_path}
									<Image
										src={tv.next_episode_to_air.still_path}
										alt={`Season ${tv.next_episode_to_air.season_number}${tv.next_episode_to_air.name}`}
										type="still"
									/>
								{/if}
							{/snippet}
							<h3 class="episode-section">Next Episode</h3>
							<hgroup>
								<h4 class="title">
									<span>
										S{tv.next_episode_to_air.season_number}:E{tv.next_episode_to_air.episode_number}
									</span>
									<span>
										{tv.next_episode_to_air.name}
									</span>
								</h4>
								<p class="date">
									{#if tv.next_episode_to_air.air_date}
										{formatDate(tv.next_episode_to_air.air_date)}
									{/if}
								</p>
							</hgroup>
							<Truncate>
								{tv.next_episode_to_air.overview}
							</Truncate>
						</Card>
					{/if}
					{#if tv.last_episode_to_air}
						<Card shadow title={tv.last_episode_to_air.name}>
							{#snippet thumbnail()}
								{#if tv.last_episode_to_air?.still_path}
									<Image
										src={tv.last_episode_to_air.still_path}
										alt={`Season ${tv.last_episode_to_air.season_number}${tv.last_episode_to_air.name}`}
										type="still"
									/>
								{/if}
							{/snippet}
							<h3 class="episode-section">Last Episode To Air</h3>
							<hgroup>
								<p class="title">
									<span>
										S{tv.last_episode_to_air.season_number}:E{tv.last_episode_to_air.episode_number}
									</span>
									<span>
										{tv.last_episode_to_air.name}
									</span>
								</p>
								<p class="date">
									{#if tv.last_episode_to_air.air_date}
										{formatDate(tv.last_episode_to_air.air_date)}
									{/if}
								</p>
							</hgroup>
							<Truncate>
								{tv.last_episode_to_air.overview}
							</Truncate>
						</Card>
					{/if}
				</div>

				<div>
					<a href={`/tv-show/${tv.id}/season`}>View more season</a>
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
						shadow
						img={cast.profile_path}
						url={`/people/${cast.id}`}
						title={cast.name}
						aria-roledescription="item"
					>
						{#snippet content()}
							<div class="cast-role">
								<span>{cast.roles[0].character}</span>
								<span class="role-count">{cast.total_episode_count} episodes</span>
							</div>
						{/snippet}
					</Card>
				{/each}
				<li class="view-more-card" aria-roledescription="item">
					<a href={`/tv-show/${tv.id}/credit`}>View more</a>
				</li>
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

				<ListItem heading="Official site">
					<OfficialSite
						homepage={tv.homepage}
						facebook_id={tv.external_ids.facebook_id}
						twitter_id={tv.external_ids.twitter_id}
						instagram_id={tv.external_ids.instagram_id}
					/>
				</ListItem>

				{#if !isNull(tv.production_countries)}
					<ListItem heading="Production countries">
						{#each tv.production_countries as item}
							<span>{formatCountryName(item.iso_3166_1)}</span>
						{/each}
					</ListItem>
				{/if}

				{#if !isNull(tv.production_companies)}
					<ListItem heading="Production companies">
						{#each tv.production_companies as item}
							<span>{item.name}</span>
						{/each}
					</ListItem>
				{/if}

				{#if !isNull(tv.networks)}
					<ListItem heading="Network">
						{#each tv.networks as network}
							<span>{network.name}</span>
						{/each}
					</ListItem>
				{/if}

				{#if !isNull(tv.keywords.results)}
					<ListItem heading="Keywords">
						{#each tv.keywords.results as item}
							<span>{item.name}</span>
						{/each}
					</ListItem>
				{/if}
			</ul>
		</section>

		<section>
			<h2 class="section-title">
				<span>
					Media
				</span>
			</h2>
			{#if tv.images.length > 3}
				<MediaGrid title={tv.name} photos={tv.images.slice(0, 7)} />
			{/if}
			<Link href={`/tv-show/${tv.id}/media`}>View all media.</Link>
		</section>

		{#if !isNull(tv.recommendations.results)}
			<section>
				<h2><span>Recommendations</span></h2>
				<Carousel label={`recommendations from ${tv.name}`}>
					{#each tv.recommendations.results as recommend (recommend.id)}
						<Card
							shadow
							img={recommend.poster_path}
							url={`/tv-show/${recommend.id}`}
							title={recommend.name}
							rating={recommend.vote_average}
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

	.view-more-card {
		display: block;
		box-shadow: var(--pf-shadow-md);
		border-radius: var(--pf-radius);
		transition: box-shadow 150ms ease-in-out;
		user-select: none;

		& > a {
			display: flex;
			inline-size: 100%;
			block-size: 100%;
			align-items: center;
			justify-content: center;

			.view-more-card:hover & {
				text-decoration: underline;
			}
		}
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.episodes {
		display: flex;
		gap: 1rem;

		@media (max-width: 1024px) {
			flex-direction: column;
		}

		.episode-section {
			font-weight: 600;
		}

		.date {
			color: hsl(var(--pf-accent-60));
		}
	}
</style>
