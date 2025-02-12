<script lang="ts">
	import type { PageProps } from "./$types";

	import { Banner, Card } from "$lib/components";
	import { groupBy } from "$lib/utils/group";

	let { data }: PageProps = $props();

	let credits = $derived(data.tv.aggregate_credits);
	let casts = $derived(credits.cast);

	let groupingCrew = groupBy(
		data.tv.aggregate_credits.crew,
		(item) => item.department ?? "crew"
	);

	let crewCategory = $state(Array.from(groupingCrew.keys()).sort());

	const crew = (key: string) => {
		return Array.from(groupingCrew.get(key)!);
	};
</script>

<main>
	<Banner
		poster_path={data.tv.poster_path}
		backdrop_path={data.tv.backdrop_path}
		page_name="Credits"
		content_title={data.tv.name}
	/>

	<section>
		<h2 class="section-title">
			<span>
				Cast
			</span>
		</h2>
		<ul class="credits">
			{#each casts as item}
				<Card
					shadow
					title={item.name}
					img={item.profile_path}
					url={`/people/${item.id}`}
					class="custom-card"
				>
					<p class="card-title">{item.name}</p>
					<ul>
						{#each item.roles as role}
							<li class="cast-role">
								<span>{role.character}</span>
								<span>({role.episode_count} episodes)</span>
							</li>
						{/each}
					</ul>
				</Card>
			{/each}
		</ul>
	</section>

	<section>
		<h2 class="section-title">
			<span>
				Crew
			</span>
		</h2>

		{#each crewCategory as cat}
			<div class="subsection">
				<h3>{cat}</h3>
				<ul class="credits">
					{#each crew(cat) as item}
						<Card
							shadow
							title={item.name}
							img={item.profile_path}
							url={`/people/${item.id}`}
							class="custom-card"
						>
							<p class="card-title">{item.name}</p>
							<ul>
								{#each item.jobs as job}
									<li>
										<p class="cast-role">{job.job} ({job.episode_count} episodes)</p>
									</li>
								{/each}
							</ul>
						</Card>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</main>

<style>
	.credits {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		@media (max-width: 476px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.cast-role {
		font-size: var(--pf-text-sm);

		& > span:last-child {
			color: hsl(var(--pf-accent-60));
		}
	}

	.card-title {
		font-weight: 500;

		:global(.custom-card):hover & {
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}

	.subsection {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;

		h3 {
			font-size: var(--pf-text-md);
			font-weight: 600;
		}
	}
</style>
