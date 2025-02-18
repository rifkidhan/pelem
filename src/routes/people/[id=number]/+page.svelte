<script lang="ts">
	import type { PageProps } from './$types';

	import { Card, Carousel, Icon, Image, ListItem } from '$lib/components';
	import OfficialSite from '$lib/components/OfficialSite.svelte';
	import { formatDate, getYear } from '$lib/utils/format';
	import isNull from '$lib/utils/isNull';
	import { groupBy } from '$lib/utils/array';

	let { data }: PageProps = $props();

	let person = $derived(data.people);

	let crews = isNull(data.people.combine_crew)
		? undefined
		: groupBy(data.people.combine_crew, (v) => v.department ?? 'crew');

	let crewCategory = $derived(crews?.keys().toArray());

	const getCrew = (key: string) => {
		return crews!.get(key)!;
	};
</script>

{#key person.id}
	<main>
		<div class="hero">
			<div class="hero-wrapper">
				<div class="profile-picture">
					<Image src={person.profile_path} alt={person.name ?? ''} />
				</div>
				<h1 class="name">{person.name}</h1>
				<div class="popular">
					<div>Popular Credits</div>
					<Carousel label="Popular credits">
						{#if person.known_for_department === 'Acting'}
							{#each person.popular_cast as item}
								<Card
									as="li"
									img={item.poster_path}
									title={item.title ?? item.name}
									url={`/${item.media_type === 'tv' ? 'tv-show' : 'movie'}/${item.id}`}
									aria-roledescription="item"
									shadow
								/>
							{/each}
						{:else}
							{#each person.popular_crew as item}
								<Card
									as="li"
									img={item.poster_path}
									title={item.title ?? item.name}
									url={`/${item.media_type === 'tv' ? 'tv-show' : 'movie'}/${item.id}`}
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
				<span>Personal Info</span>
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
					<span>Biography</span>
				</h2>
				<div>{person.biography}</div>
			</section>
		{/if}

		{#snippet summary(section: string)}
			<summary>
				<h3>
					<span>
						{section}
					</span>
					<Icon icon="chevron-down" />
				</h3>
			</summary>
		{/snippet}

		<section>
			<h2 class="section-title">
				<span>Credits</span>
			</h2>
			<details name="credits" open>
				{@render summary('Acting')}
				<ul class="credits">
					{#each person.combine_cast as item}
						{@const title = item.name ?? item.title}
						{@const date = item.release_date ?? item.first_air_date}
						<li class="credit">
							<a
								href={`/${item.media_type === 'tv' ? 'tv-show' : 'movie'}/${item.id}`}
								aria-labelledby={`${item.media_type}-${item.id}`}
							></a>
							<div class="thumbnail">
								<Image src={item.poster_path} alt={title ?? ''} />
							</div>
							<div class="item">
								<h4>{title}</h4>
								<ul>
									{#each item.roles as role}
										<li class="list-with-dot">
											<span>
												{#if role.character}
													{role.character}
												{:else}
													-
												{/if}
											</span>
											{#if role.episode_count}
												<span>{role.episode_count} episode</span>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
							<div class="date">
								{#if date}
									{getYear(date)}
								{:else}
									-
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</details>

			{#if crewCategory}
				{#each crewCategory as crewCat}
					<details name="credits">
						{@render summary(crewCat)}
						<ul class="credits">
							{#each getCrew(crewCat) as item}
								{@const title = item.name ?? item.title}
								{@const date = item.release_date ?? item.first_air_date}
								<li class="credit">
									<a
										href={`/${item.media_type === 'tv' ? 'tv-show' : 'movie'}/${item.id}`}
										aria-labelledby={`${item.media_type}-${item.id}`}
									></a>
									<div class="thumbnail">
										<Image src={item.poster_path} alt={title ?? ''} />
									</div>
									<div class="item">
										<h4>{title}</h4>
										<ul>
											{#each item.jobs as job}
												<li class="list-with-dot">
													<span>
														{#if job.job}
															{job.job}
														{:else}
															-
														{/if}
													</span>
													{#if job.episode_count}
														<span>{job.episode_count} episode</span>
													{/if}
												</li>
											{/each}
										</ul>
									</div>
									<div class="date">
										{#if date}
											{getYear(date)}
										{:else}
											-
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					</details>
				{/each}
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

	details {
		summary {
			display: block;
			font-weight: 600;
			background-color: hsl(var(--pf-accent-5));
			padding-block: 1rem;

			h3 {
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

		.credits {
			display: flex;
			flex-direction: column;
			padding-inline: 1rem;

			.credit {
				display: flex;
				position: relative;
				padding-block: 0.5rem;
				gap: 0.5rem;
				inline-size: 100%;
				align-items: center;

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

				.thumbnail {
					display: block;
					inline-size: 48px;
					block-size: fit-content;
					border-radius: var(--pf-radius);
					overflow: hidden;
					flex-shrink: 0;
				}

				.date {
					flex-shrink: 0;
					color: hsl(var(--pf-primary-dark));
				}

				.item {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
					inline-size: 100%;

					h4 {
						color: hsl(var(--pf-accent-95));
						font-weight: 600;

						.credit:hover & {
							text-decoration: underline;
						}
					}

					ul {
						font-size: var(--pf-text-sm);
						color: hsl(var(--pf-accent-70));
						margin-inline-start: 0.5rem;
					}
				}
			}
		}
	}
</style>
