<script lang="ts">
	import type { PageProps } from "./$types";

	import { Card } from "$lib/components";
	import { groupBy } from "$lib/utils/group";

	let { data }: PageProps = $props();

	let credits = $derived(data.movie.credits);
	let casts = $derived(credits.cast);

	let groupingCrew = groupBy(data.movie.credits.crew, (item) => item.department ?? "crew");

	let crewCategory = $state(Array.from(groupingCrew.keys()).sort());

	const crew = (key: string) => {
		return Array.from(groupingCrew.get(key)!);
	};
</script>

<section>
	<h2 class="section-title">
		<span>
			Cast
		</span>
	</h2>
	<ul class="credits">
		{#each casts as item}
			<Card
				title={item.name}
				img={item.profile_path}
				shadow
				url={`/people/${item.id}`}
				class="custom-card"
			>
				<div>
					<p class="card-title">{item.name}</p>
					<p class="cast-role">{item.character}</p>
				</div>
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
						title={item.name}
						img={item.profile_path}
						shadow
						url={`/people/${item.id}`}
						class="custom-card"
					>
						<div>
							<p class="card-title">{item.name}</p>
							<p class="cast-role">{item.job}</p>
						</div>
					</Card>
				{/each}
			</ul>
		</div>
	{/each}
</section>

<style>
	.credits {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		@media (max-width: 476px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.card-title {
		font-weight: 500;

		:global(.custom-card):hover & {
			text-decoration: underline;
			text-underline-offset: 2px;
		}
	}

	.cast-role {
		font-size: var(--pf-text-sm);
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
