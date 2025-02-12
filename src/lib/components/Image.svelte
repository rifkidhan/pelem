<script lang="ts">
	import type { HTMLImgAttributes } from "svelte/elements";

	import { IMAGE_URL } from "$lib/utils/constants";
	import Icon from "./icon/Icon.svelte";

	interface ImageProps extends HTMLImgAttributes {
		type?: "poster" | "backdrop" | "still";
		priority?: boolean;
		src?: string;
		alt: string;
		full?: boolean;
		original?: boolean;
	}

	let {
		type = "poster",
		priority,
		src,
		alt,
		class: className,
		full,
		original,
		...attrs
	}: ImageProps = $props();

	const BACKDROP_SIZES = [300, 780, 1280];
	const POSTER_SIZES = [185, 342, 500];
	const STILL_SIZES = [92, 185, 300];

	let allSizes = $derived.by(() => {
		if (type === "poster") return POSTER_SIZES;
		if (type === "backdrop") return BACKDROP_SIZES;

		return STILL_SIZES;
	});

	let width = $derived(allSizes[0]);

	let height = $derived.by(() => {
		if (type === "poster") {
			return width * 1.5;
		}

		return width / 1.78;
	});

	let img_url = $derived(src ? `${IMAGE_URL}w${width}${src}` : "");

	let srcset = $derived.by(() => {
		if (!src) return undefined;

		return allSizes.map((v) => `${IMAGE_URL}w${v}${src} ${v}w`).join(", ").toString();
	});

	let sizes = $derived.by(() => {
		if (!src) return undefined;

		return allSizes.map((v, i) => {
			if (i === BACKDROP_SIZES.length - 1) return `${v}px`;

			return `(max-width: ${(i + 1) * 600}px) ${v}px`;
		}).join(", ").toString();
	});

	let loading = $state(type == "backdrop" ? false : true);

	let error = $state(false);
</script>

{#if src && !error}
	<img
		src={img_url}
		{srcset}
		{sizes}
		{width}
		{height}
		loading={priority ? "eager" : "lazy"}
		decoding="async"
		fetchpriority={priority ? "high" : undefined}
		class={[type, { full }, { loading }, className]}
		onload={() => loading = false}
		onerror={() => error = true}
		{alt}
		{...attrs}
	/>
{:else}
	<div
		class={["fallback", type, { full }, className]}
		role="presentation"
		aria-label={`${alt} fallback`}
	>
		<Icon icon="image" hidden />
	</div>
{/if}

<style>
	img {
		inline-size: 100%;
		block-size: auto;
		object-fit: cover;
		object-position: center;
		background-color: hsl(var(--pf-accent-50));
	}

	.loading {
		animation: var(--pf-animation-pulse);
	}

	.full {
		block-size: 100%;
	}

	.poster:not(.full) {
		aspect-ratio: 2 / 3;
	}

	:is(.backdrop, .still):not(.full) {
		aspect-ratio: 16 / 9;
	}

	.fallback {
		inline-size: 100%;
		block-size: auto;
		background-color: hsl(var(--pf-accent-50));
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
