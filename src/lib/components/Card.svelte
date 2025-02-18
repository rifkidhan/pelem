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
		...attrs
	}: PropsCard = $props();
</script>

<svelte:element this={as} class={['card-container', className]} title={url && title} {...attrs}>
	<div class={['card', { shadow }]}>
		{#if url}
			<a href={url} aria-label={title} draggable="true"></a>
		{/if}
		<div class="thumbnail">
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
			flex-direction: row;
			position: relative;
			background-color: hsl(var(--pf-accent-5));
			border-radius: var(--pf-radius);
			overflow: hidden;
			transition: box-shadow 150ms ease-in-out;
			user-select: none;
			inline-size: 100%;
			block-size: 100%;
			padding: 1rem;
			gap: 1rem;
			align-items: center;

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
				inline-size: 18cqi;
				block-size: auto;
				position: relative;
				border-radius: var(--pf-radius);
				overflow: hidden;
				flex-shrink: 0;

				&:empty {
					display: none;
				}

				:global(img) {
					transition: transform 150ms ease-in-out;

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

				.rating {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.25rem;

					& > :global(svg) {
						fill: hsl(var(--pf-sunflower));
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

					.card:has(a):hover & {
						text-decoration: underline;
						text-underline-offset: 2px;
					}
				}
			}
		}

		@container card (max-width: 876px) {
			.card {
				.thumbnail {
					inline-size: 23cqi;
				}
			}
		}

		@container card (max-width: 460px) {
			.card {
				padding: 0.5rem;
				gap: 0.5rem;

				.thumbnail {
					inline-size: 30cqi;
				}
			}
		}

		@container card (max-width: 200px) {
			.card {
				flex-direction: column;
				padding: 0;

				.thumbnail {
					inline-size: 100cqi;
				}

				.content {
					padding: 0.5rem;
				}
			}
		}
	}
</style>
