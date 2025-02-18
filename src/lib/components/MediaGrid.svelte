<script lang="ts">
	import type { CombineImage } from '$lib/types';

	import { IMAGE_URL } from '$lib/utils/constants';
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
	import Image from './Image.svelte';

	interface MediaGrid {
		photos?: CombineImage[];
		title?: string;
	}

	let { photos, title }: MediaGrid = $props();
</script>

{#if photos && photos.length > 0}
	<div class="media-grid" role="list">
		{#each photos as item, i (i)}
			{@const label = `${title}-${i}`}
			<div class="image-wrapper" data-backdrop={item.backdrop ? 'true' : 'false'} role="listitem">
				<Button
					aria-label={label}
					href={`${IMAGE_URL}original${item.file_path}`}
					size="square"
					external
					variant="secondary"
					class="extern-link"
				>
					<Icon icon="external-link" hidden />
				</Button>
				<Image src={item.file_path} alt={label} type={item.backdrop ? 'backdrop' : 'poster'} full />
			</div>
		{/each}
	</div>
{/if}

<style>
	.media-grid {
		display: flex;
		flex-flow: wrap;
		gap: 1rem;

		& > div {
			display: block;
			position: relative;
			border-radius: var(--pf-radius);
			overflow: hidden;
			max-height: 300px;

			& > :global(.extern-link) {
				position: absolute;
				bottom: 0.5rem;
				right: 0.5rem;
			}

			@media (max-width: 768px) {
				max-height: 150px;
			}

			&[data-backdrop='true'] {
				flex-grow: 10;
				inline-size: 30%;

				@media (max-width: 768px) {
					flex-grow: 20;
					inline-size: 35%;
				}
			}

			&[data-backdrop='false'] {
				flex-grow: 5;
				inline-size: 10%;

				@media (max-width: 768px) {
					flex-grow: 10;
					inline-size: 15%;
				}
			}
		}
	}
</style>
