<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
	import { goto } from '$app/navigation';

	interface Page {
		type: 'page' | 'ellipsis';
		value: number;
	}

	interface PaginationProps {
		page?: number;
		total_pages?: number;
		max_total_pages?: number;
		url: string;
	}

	let { page = 1, total_pages = 1, max_total_pages = 500, url }: PaginationProps = $props();

	let getTotalPages = $derived(Math.min(max_total_pages, total_pages));

	let pageToShow = $derived.by(() => {
		const show = [1, Math.max(getTotalPages, 1)];
		const firstItems = 4;
		const lastItems = getTotalPages - 3;

		if (firstItems > lastItems) {
			for (let i = 2; i <= getTotalPages - 1; i++) {
				show.push(i);
			}
		} else if (page < firstItems) {
			for (let i = 2; i <= Math.min(firstItems, getTotalPages); i++) {
				show.push(i);
			}
		} else if (page > lastItems) {
			for (let i = getTotalPages - 1; i >= Math.max(lastItems, 2); i--) {
				show.push(i);
			}
		} else {
			for (let i = Math.max(page - 1, 2); i <= Math.min(page + 1, getTotalPages); i++) {
				show.push(i);
			}
		}
		let items: Page[] = [];

		let lastNumber = 0;

		for (const page of show.sort((a, b) => a - b)) {
			if (page - lastNumber > 1) {
				items.push({ type: 'ellipsis', value: 0 });
			}
			items.push({ type: 'page', value: page });
			lastNumber = page;
		}

		return items;
	});

	const onClick = (page?: number) => {
		let href = url;

		if (page) {
			href = href + `?page=${page}`;
		}

		goto(href);
	};
</script>

<div class="pagination">
	<Button
		disabled={page == 1}
		onclick={() => onClick(page - 1)}
		size="square"
		title="Previous page"
	>
		<Icon icon="chevron-left" hidden />
	</Button>
	{#each pageToShow as show}
		{#if show.type === 'ellipsis'}
			<span>...</span>
		{:else}
			<Button
				disabled={show.value == page}
				onclick={() => onClick(show.value != 1 ? show.value : undefined)}
				title={`Page ${show.value}`}
			>
				{show.value}
			</Button>
		{/if}
	{/each}
	<Button
		disabled={page == getTotalPages}
		onclick={() => onClick(page + 1)}
		size="square"
		title="Next page"
	>
		<Icon icon="chevron-right" hidden />
	</Button>
</div>

<style>
	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		max-inline-size: 92dvw;
		margin-inline: auto;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
