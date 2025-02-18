<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import Image from './Image.svelte';

	interface BannerProps {
		poster_path?: string;
		backdrop_path?: string;
		page_name: string;
		content_title?: string;
		class?: ClassValue;
	}

	let { backdrop_path, poster_path, page_name, content_title, ...props }: BannerProps = $props();
</script>

<div class={['banner', props.class]}>
	<div class="backdrop-banner">
		{#if backdrop_path}
			<Image src={backdrop_path} type="backdrop" priority full alt="" aria-hidden="true" />
		{/if}
	</div>
	<div class="banner-wrapper">
		<div class="content">
			<div class="thumbnail">
				<Image src={poster_path} alt={`${content_title}-poster`} />
			</div>
			<hgroup>
				<h1>{page_name}</h1>
				<h2>{content_title}</h2>
			</hgroup>
		</div>
	</div>
</div>

<style>
	.banner {
		inline-size: 100%;
		block-size: max-content;
		position: relative;
		color: hsl(var(--pf-white));

		.backdrop-banner {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			inline-size: 100%;
			block-size: 100%;
			background-color: hsl(var(--pf-accent-80));
		}

		.banner-wrapper {
			inline-size: 100%;
			backdrop-filter: blur(48px) brightness(0.65);
			padding-block: 2rem;

			& > .content {
				display: flex;
				gap: 1rem;
				max-inline-size: 92dvw;
				margin-inline: auto;

				& > .thumbnail {
					display: block;
					block-size: fit-content;
					inline-size: 10%;
					border-radius: var(--pf-radius);
					box-shadow: var(--pf-shadow);
					overflow: hidden;

					@media (max-width: 675px) {
						display: none;
					}
				}

				& > hgroup {
					display: flex;
					flex-direction: column-reverse;

					h1 {
						font-size: var(--pf-text-xl);
						font-weight: 600;
						line-height: 1;
						text-transform: capitalize;
					}

					h2 {
						font-size: var(--pf-text-lg);
					}
				}
			}
		}
	}
</style>
