<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import Icon from './icon/Icon.svelte';
	import Image from './Image.svelte';

	interface PropsCard extends HTMLAttributes<HTMLElement> {
		as?: string;
		title?: string;
		img?: string;
		img_type?: 'poster' | 'still';
		rating?: number;
		url?: string;
		rank?: number;
		shadow?: boolean;
		content?: Snippet;
		thumbnail?: Snippet;
	}

	let {
		as = 'div',
		title = 'untitled',
		img,
		img_type = 'poster',
		rating,
		url,
		class: className,
		children,
		content,
		thumbnail,
		shadow,
		rank,
		...attrs
	}: PropsCard = $props();
</script>

<svelte:element this={as} class={['card-container', className]} title={url && title} {...attrs}>
	<div class={['card', { shadow }]}>
		{#if url}
			<a href={url} aria-label={title} draggable="true"></a>
		{/if}
		<div class="thumbnail" data-rank={rank}>
			{#if thumbnail}
				{@render thumbnail()}
			{:else}
				<Image src={img} alt={title} type={img_type} />
			{/if}
		</div>
		<div class="content">
			{#if children}
				{@render children()}
			{:else}
				{#if rating}
					<div class="rating">
						<Icon icon="star" stroke="none" hidden />
						<span>{Math.floor(rating * 10)}%</span>
					</div>
				{/if}
				<h3>{title}</h3>
				{@render content?.()}
			{/if}
		</div>
	</div>
</svelte:element>

<style>
	.card-container {
		container: card / inline-size;
		display: block;
		inline-size: 100%;

		.card {
			display: flex;
			flex-direction: column;
			position: relative;
			background-color: var(--pf-accent-5);
			border-radius: var(--pf-radius);
			overflow: hidden;
			transition: box-shadow 200ms ease-in-out;
			user-select: none;
			inline-size: 100%;
			block-size: 100%;
			gap: 0.5rem;
			align-items: center;

			@container card (width >= 200px) {
				padding: 0.5rem;
				flex-direction: row;
			}

			@container card (width >= 460px) {
				padding: 1rem;
				gap: 1rem;
			}

			&:is(.shadow) {
				box-shadow: var(--pf-shadow-md);

				&:has(a):hover {
					box-shadow: var(--pf-shadow-lg);
				}
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
				inline-size: 100cqi;
				block-size: auto;
				position: relative;
				border-radius: var(--pf-radius);
				overflow: hidden;
				flex-shrink: 0;

				&[data-rank]::after {
					content: attr(data-rank);
					display: block;
					user-select: none;
					position: absolute;
					bottom: -20px;
					left: -15px;
					font-size: 70cqi;
					color: var(--pf-black);
					line-height: 1;
					font-weight: 800;
					-webkit-text-stroke: 12px var(--pf-primary-dark);
					paint-order: stroke fill;
					letter-spacing: -0.25rem;

					@container card (width >= 200px) {
						font-size: 20cqi;
					}

					@container card (width >= 460px) {
						font-size: 10cqi;
					}
				}

				@container card (width >= 200px) {
					inline-size: 30cqi;
				}
				@container card (width >= 460px) {
					inline-size: 23cqi;
				}
				@container card (width >= 876px) {
					inline-size: 18cqi;
				}

				&:empty {
					display: none;
				}

				:global(img) {
					transition: transform 200ms ease-in-out;

					.card:has(a):hover & {
						transform: scale(1.05);
					}
				}
			}
			.content {
				line-height: 1.2;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				width: 100%;

				@container card (width < 200px) {
					padding: 0.5rem;
				}

				.rating {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.25rem;

					& > :global(svg) {
						fill: var(--pf-sunflower);
						max-inline-size: 1rem;
						block-size: auto;
					}
				}

				& > h3 {
					font-weight: 500;
					white-space: normal;
					overflow-wrap: break-word;
					text-overflow: ellipsis;
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					min-height: 2lh;
					font-size: var(--pf-text-normal);

					@container card (width >= 300px) {
						font-size: var(--pf-text-lg);
					}

					.card:has(a):hover & {
						text-decoration: underline;
						text-underline-offset: 2px;
					}
				}
			}
		}
	}
</style>
