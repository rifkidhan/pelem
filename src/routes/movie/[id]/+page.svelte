<script lang="ts">
	import type { PageProps } from "./$types";

	import { Card, Carousel, Link, ListItem, MediaGrid, OfficialSite } from "$lib/components";
	import {
		formatCountryName,
		formatCurrency,
		formatDate,
		formatLanguage
	} from "$lib/utils/format";
	import isNull from "$lib/utils/isNull";

	let { data }: PageProps = $props();

	let movie = $derived(data.movie);
</script>

{#if !isNull(movie.credits.cast)}
	<section>
		<h2 class="section-title">
			<span>
				Cast
			</span>
		</h2>
		<Carousel label="Cast">
			{#each movie.credits.cast.slice(0, 9) as cast (cast.id)}
				<Card
					img={cast.profile_path}
					url={`/people/${cast.id}`}
					title={cast.name}
					aria-roledescription="item"
					shadow
				>
					{#snippet content()}
						<p class="cast-role">{cast.character}</p>
					{/snippet}
				</Card>
			{/each}
			<li class="view-more-card" aria-roledescription="item">
				<a href={`/movie/${movie.id}/credit`}>View more</a>
			</li>
		</Carousel>
	</section>
{/if}

<section>
	<h2 class="section-title">
		<span>
			Details
		</span>
	</h2>
	<ul class="details">
		{#if movie.original_title && movie.original_title !== movie.title}
			<ListItem heading="Original title">
				{movie.original_title}
			</ListItem>
		{/if}
		<ListItem heading="Status">
			{movie.status}
		</ListItem>

		{#if movie.release_date}
			<ListItem heading="Release date">
				{formatDate(movie.release_date)}
			</ListItem>
		{/if}

		{#if movie.original_language}
			<ListItem heading="Original language">
				{formatLanguage(movie.original_language)}
			</ListItem>
		{/if}
		<ListItem heading="Official site">
			<OfficialSite
				homepage={movie.homepage}
				twitter_id={movie.external_ids.twitter_id}
				facebook_id={movie.external_ids.facebook_id}
				instagram_id={movie.external_ids.instagram_id}
			/>
		</ListItem>

		{#if !isNull(movie.production_countries)}
			<ListItem heading="Production countries">
				{#each movie.production_countries as item}
					<span>{formatCountryName(item.iso_3166_1)}</span>
				{/each}
			</ListItem>
		{/if}

		{#if !isNull(movie.production_companies)}
			<ListItem heading="Production companies">
				{#each movie.production_companies as item}
					<span>{item.name}</span>
				{/each}
			</ListItem>
		{/if}

		{#if !isNull(movie.budget)}
			<ListItem heading="Budget">
				{formatCurrency(movie.budget)}
			</ListItem>
		{/if}

		{#if !isNull(movie.revenue)}
			<ListItem heading="Revenue">
				{formatCurrency(movie.revenue)}
			</ListItem>
		{/if}

		{#if !isNull(movie.keywords.keywords)}
			<ListItem heading="Keywords">
				{#each movie.keywords.keywords as item}
					<span>{item.name}</span>
				{/each}
			</ListItem>
		{/if}
	</ul>
</section>

{#if movie.belongs_to_collection}
	<section>
		<h2 class="section-title">
			<span>
				Belongs To Collection
			</span>
		</h2>

		<Card
			as="div"
			title={movie.belongs_to_collection.name}
			img={movie.belongs_to_collection.poster_path}
		/>
	</section>
{/if}

<section>
	<h2 class="section-title">
		<span>
			Media
		</span>
	</h2>
	{#if movie.images.length > 3}
		<MediaGrid title={movie.title} photos={movie.images.slice(0, 7)} />
	{/if}
	<Link href={`/movie/${movie.id}/media`}>View all media.</Link>
</section>

{#if !isNull(movie.recommendations.results)}
	<section>
		<h2 class="section-title">
			<span>
				Recommendations
			</span>
		</h2>
		<Carousel label={`recommendations from ${movie.title}`}>
			{#each movie.recommendations.results as recommend (recommend.id)}
				<Card
					id={String(recommend.id)}
					img={recommend.poster_path}
					url={`/movie/${recommend.id}`}
					title={recommend.title}
					rating={recommend.vote_average}
					aria-roledescription="item"
					shadow
				/>
			{/each}
		</Carousel>
	</section>
{/if}

<style>
	.cast-role {
		font-size: var(--pf-text-sm);
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
</style>
