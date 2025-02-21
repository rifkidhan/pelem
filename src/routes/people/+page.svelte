<script lang="ts">
	import type { PageProps } from './$types';
	import { Banner, Card, Pagination } from '$lib/components';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	let persons = $derived(data.person);
	let pageNow = $derived(Number(page.url.searchParams.get('page')));
</script>

{#key page.url}
	<Banner page_name="Popular Person" content_title={pageNow > 0 ? `Page ${pageNow}` : undefined} />
	<section>
		<div class="person-list" role="list">
			{#each persons.results as item}
				<Card
					title={item.name}
					img={item.profile_path}
					url={`/people/${item.id}`}
					shadow
					role="listitem"
				>
					{#snippet content()}
						<div class="known-for">
							<p>Known For</p>
							<ul class="list-with-dot">
								{#each item.known_for as credit}
									<li>{credit.title ?? credit.name}</li>
								{/each}
							</ul>
						</div>
					{/snippet}
				</Card>
			{/each}
		</div>
	</section>

	<Pagination page={Math.max(1, pageNow)} total_pages={persons.total_pages} url={'/people'} />
{/key}

<style>
	.person-list {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;

		@media (max-width: 1024px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		@media (max-width: 690px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.known-for {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: var(--pf-text-sm);

		& > :first-child {
			font-weight: 600;
		}

		& > ul {
			display: flex;
			flex-wrap: wrap;
		}
	}
</style>
