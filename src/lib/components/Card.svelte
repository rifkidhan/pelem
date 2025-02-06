<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	import Icon from "./icon/Icon.svelte";
	import Image from "./Image.svelte";

	interface PropsCard extends HTMLAttributes<HTMLElement> {
		as?: string;
		title?: string;
		img?: string;
		img_type?: "poster" | "still";
		rating?: number;
		url?: string;
		type?: "movie" | "tv" | "people";
	}

	let {
		as = "li",
		title = "untitled",
		img,
		img_type = "poster",
		rating,
		url,
		id,
		type = "movie",
		class: className,
		children,
		...attrs
	}: PropsCard = $props();
</script>

<svelte:element this={as} class={["card-container", className]} {title} {...attrs}>
	<div class="card">
		{#if url}
			<a href={url} aria-labelledby={`${type}-${id}`} draggable="true"></a>
		{/if}
		<div class="thumbnail">
			<Image src={img} alt={title} type={img_type === "poster" ? "poster" : "still"} />
		</div>
		<div class="content">
			{#if rating}
				<div class="rating">
					<Icon icon="star" stroke="none" />
					<span>{rating}</span>
				</div>
			{/if}
			<h3 id={`${type}-${id}`}>{title}</h3>
			{@render children?.()}
		</div>
	</div>
</svelte:element>

<style>
	.card-container {
		container: card / inline-size;
		display: block;
	}

	.card {
		display: flex;
		flex-direction: row;
		position: relative;
		background-color: hsl(var(--pf-accent-5));
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: var(--pf-shadow-md);
		transition: box-shadow 150ms ease-in-out;
		user-select: none;
		inline-size: 100%;
		block-size: 100%;

		&:has(a):hover {
			box-shadow: var(--pf-shadow-lg);
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
			inline-size: 25cqi;
			position: relative;
			border-radius: 0.5rem;
			overflow: hidden;
			flex-shrink: 0;

			:global(img) {
				transition: transform 150ms ease-in-out;

				.card:has(a):hover & {
					transform: scale(1.05);
				}
			}
		}
		.content {
			padding-inline: 0.5rem;
			padding-block: 0.75rem;

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
				line-height: 1.2;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				height: 2lh;

				.card:has(a):hover & {
					text-decoration: underline;
					text-underline-offset: 2px;
				}
			}
		}
	}

	@container card (max-width: 460px) {
		.card {
			.thumbnail {
				inline-size: 30cqi;
			}
		}
	}

	@container card (max-width: 300px) {
		.card {
			flex-direction: column;

			.thumbnail {
				inline-size: 100cqi;
			}
		}
	}
</style>
