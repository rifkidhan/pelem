<script lang="ts">
	import type { PageProps } from "./$types";

	import { Card, Carousel, Icon, Image, ListItem } from "$lib/components";
	import OfficialSite from "$lib/components/OfficialSite.svelte";
	import { formatDate, getYear } from "$lib/utils/format";
	import isNull from "$lib/utils/isNull";

	let { data }: PageProps = $props();

	let person = $derived(data.people);

	let previousCast = $derived(
		person.combine_cast.filter(v => v.release_date || v.first_air_date)
	);
	let upcomingCast = $derived(
		person.combine_cast.filter(v => !v.release_date && !v.first_air_date)
	);

	$inspect(person);
</script>

{#key person.id}
	<main>
		<div class="hero">
			<div class="hero-wrapper">
				<div class="profile-picture">
					<Image src={person.profile_path} alt={person.name ?? ""} />
				</div>
				<h1 class="name">{person.name}</h1>
				<div class="popular">
					<div>Popular Credits</div>
					<Carousel label="Popular credits">
						{#if person.known_for_department === "Acting"}
							{#each person.popular_cast as item}
								<Card
									img={item.poster_path}
									title={item.title ?? item.name}
									url={`/${item.media_type === "tv" ? "tv-show" : "movie"}/${item.id}`}
									aria-roledescription="item"
									shadow
								/>
							{/each}
						{:else}
							{#each person.popular_crew as item}
								<Card
									img={item.poster_path}
									title={item.title ?? item.name}
									url={`/${item.media_type === "tv" ? "tv-show" : "movie"}/${item.id}`}
									aria-roledescription="item"
									shadow
								/>
							{/each}
						{/if}
					</Carousel>
				</div>
			</div>
		</div>

		<section>
			<h2>
				<span>
					Personal Info
				</span>
			</h2>
			<ul class="details">
				<ListItem heading="Known for">
					<span>{person.known_for_department}</span>
				</ListItem>

				{#if person.birthday}
					<ListItem heading="Born">
						<span>{formatDate(person.birthday)}</span>
						<span>{person.place_of_birth}</span>
					</ListItem>
				{/if}
				{#if person.deathday}
					<ListItem heading="Died">
						<span>{formatDate(person.deathday)}</span>
					</ListItem>
				{/if}

				{#if !isNull(person.also_known_as)}
					<ListItem heading="Also known as">
						{#each person.also_known_as as item}
							<span>{item}</span>
						{/each}
					</ListItem>
				{/if}
				<ListItem heading="Official site">
					<OfficialSite
						homepage={person.homepage}
						twitter_id={person.external_ids.twitter_id}
						facebook_id={person.external_ids.facebook_id}
						tiktok_id={person.external_ids.tiktok_id}
						youtube_id={person.external_ids.youtube_id}
						instagram_id={person.external_ids.instagram_id}
					/>
				</ListItem>
			</ul>
		</section>

		{#if !isNull(person.biography)}
			<section>
				<h2>
					<span>
						Biography
					</span>
				</h2>
				<div>{person.biography}</div>
			</section>
		{/if}

		<section>
			<h2>
				<span>
					Credits
				</span>
			</h2>

			{#snippet summary(section: string)}
				<summary>
					<div class="summary-wrapper">
						<div>
							{section}
						</div>
						<Icon icon="chevron-down" />
					</div>
				</summary>
			{/snippet}

			{#snippet creditItem(
			id: number,
			title = "Untitled",
			poster?: string,
			media_type = "movie",
			character?: string,
			episode?: number,
			date?: string
		)}
				<li class="item">
					<a
						href={`/${media_type === "tv" ? "tv-show" : "movie"}/${id}`}
						aria-labelledby={`${media_type}-${id}`}
					></a>

					<div class="thumbnail">
						<Image src={poster} alt={title} />
					</div>
					<div class="metadata">
						<ul>
							<li>
								<h4>
									{title}
									{#if media_type === "tv"}
										<span>(Series)</span>
									{/if}
								</h4>
							</li>
							<li>{character}</li>
						</ul>
						<ul>
							<li class="item-release">
								{date ? getYear(date) : "-"}
							</li>
							{#if episode}
								<li>{episode} episode</li>
							{/if}
						</ul>
					</div>
				</li>
			{/snippet}

			{#if person.combine_cast.length > 0}
				<div class="credits">
					<h3>Acting</h3>
					{#if upcomingCast.length > 0}
						<details name="credits">
							{@render summary("Upcoming")}

							<ul class="items">
								{#each upcomingCast as item}
									{@render creditItem(
							item.id,
							item.title ?? item.name,
							item.poster_path,
							item.media_type,
							item.character,
							item.episode_count,
							item.release_date ?? item.first_air_date
						)}
								{/each}
							</ul>
						</details>
					{/if}
					<details name="credits">
						{@render summary("Previous")}

						<ul class="items">
							{#each previousCast as item}
								{@render creditItem(
							item.id,
							item.title ?? item.name,
							item.poster_path,
							item.media_type,
							item.character,
							item.episode_count,
							item.release_date ?? item.first_air_date
						)}
							{/each}
						</ul>
					</details>
				</div>
			{/if}
		</section>
	</main>
{/key}

<style>
	.hero {
		container: hero / inline-size;
		position: relative;
		background-color: hsl(var(--pf-accent-20));
		inline-size: 100%;
		padding-block-start: calc(var(--pf-header-height) + 2rem);
		padding-block-end: 2rem;
	}

	.hero-wrapper {
		display: grid;
		max-inline-size: 93dvw;
		margin-inline: auto;
		grid-template-areas:
			'picture name'
			'picture popular';
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		row-gap: 1rem;
		column-gap: 3rem;
	}

	.profile-picture {
		grid-area: picture;
		inline-size: 25cqw;
		block-size: fit-content;
		display: block;
		overflow: hidden;
		border-radius: var(--pf-radius);
		box-shadow: var(--pf-shadow-md);
	}

	.name {
		grid-area: name;
		text-wrap: balance;
		font-size: var(--pf-text-xl);
		font-weight: 600;
		line-height: 1;
	}

	.popular {
		grid-area: popular;
		display: block;
		inline-size: 100%;

		& > div:first-child {
			font-size: var(--pf-text-md);
			font-weight: 500;
		}
	}

	@container hero (max-width: 876px) {
		.hero-wrapper {
			grid-template-areas: 'picture' 'name' 'popular';
			grid-template-columns: 1fr;
			grid-template-rows: repeat(2, minmax(50px, auto)) 1fr;
			row-gap: 2rem;
			place-items: center;
		}

		.profile-picture {
			inline-size: 35cqw;
		}
	}

	section {
		display: flex;
		flex-direction: column;
		inline-size: 100%;
		max-inline-size: 92dvw;
		margin-inline: auto;
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

	.details {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.credits {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;

		& > h3 {
			font-size: var(--pf-text-md);
			font-weight: 600;
		}

		details {
			display: flex;
			flex-direction: column;
			position: relative;
			box-shadow: var(--pf-shadow-md);
			border-radius: var(--pf-radius);

			&[open] {
				gap: 1rem;
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

			summary {
				cursor: pointer;
				display: block;
				font-weight: 600;
				background-color: hsl(var(--pf-accent-10));
				padding-block: 1rem;

				.summary-wrapper {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-inline: 1rem;

					details[open] & {
						:global(svg) {
							rotate: 180deg;
						}
					}
				}
			}

			.items {
				display: flex;
				flex-direction: column;
				padding-inline: 1rem;

				.item {
					display: flex;
					position: relative;
					padding-block: 0.5rem;
					gap: 0.5rem;

					&:not(:last-child) {
						border-block-end: solid 1px;
					}

					a {
						block-size: 100%;
						inline-size: 100%;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 1;
					}
				}
			}

			.thumbnail {
				display: block;
				inline-size: 48px;
				border-radius: var(--pf-radius);
				overflow: hidden;
			}

			.metadata {
				display: flex;
				color: hsl(var(--pf-accent-70));
				flex-grow: 1;
				justify-content: space-between;
				align-items: center;

				ul {
					display: flex;
					flex-direction: column;

					&:last-child {
						align-items: flex-end;
					}
				}

				li {
					&:has(h4) {
						color: hsl(var(--pf-accent-95));
						font-weight: 600;
					}

					&:is(.item-release) {
						color: hsl(var(--pf-primary-dark));
					}
				}
			}
		}
	}
</style>
