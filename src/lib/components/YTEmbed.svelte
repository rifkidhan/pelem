<script lang="ts" module>
	let prefetch = false;

	const LINK_TO_PREFETCH = [
		"https://www.youtube-nocookie.com",
		"https://www.youtube.com",
		"https://www.google.com"
	];

	const warmConnection = () => {
		if (prefetch) return;
		const addPrefetch = (url: string) => {
			const elem = document.createElement("link");
			elem.rel = "preconnect";
			elem.href = url;
			document.head.append(elem);
		};

		LINK_TO_PREFETCH.map((v) => addPrefetch(v));
		prefetch = true;
	};

	const removePrefetch = () => {
		if (!prefetch) return;

		LINK_TO_PREFETCH.map((v) => document.head.querySelector(`link[href="${v}"]`)?.remove());
		prefetch = false;
	};
</script>
<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	import { ytImage } from "$lib/actions/images.svelte";

	interface YTEmbed extends HTMLAttributes<HTMLDivElement> {
		videoKey: string;
		thumbnailQuality?: "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
	}

	let {
		videoKey,
		title = "Youtube video player",
		...attrs
	}: YTEmbed = $props();

	const params = new URLSearchParams({ autoplay: "1", playsinline: "1" });

	let embedUrl = $derived(
		`https://www.youtube-nocookie.com/embed/${videoKey}?${params.toString()}`
	);

	let showIframe = $state(false);

	const onclick = async (e: MouseEvent) => {
		if (e.metaKey || e.ctrlKey) return;

		warmConnection();
		showIframe = true;
	};

	onDestroy(removePrefetch);
</script>

<div class="yt-embed" {title} use:ytImage={{ key: videoKey, quality: "hqdefault" }} {...attrs}>
	{#if showIframe}
		<iframe
			src={embedUrl}
			{title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
			frameborder="0"
			allowfullscreen
		></iframe>
	{:else}
		<button type="button" {onclick}>
			<span class="sr-only">Play: {title}</span>
		</button>
	{/if}
</div>

<style>
	.yt-embed {
		display: block;
		position: relative;
		contain: content;
		inline-size: 100%;
		block-size: auto;
		border-radius: var(--pf-radius);
		overflow: hidden;
		min-inline-size: 40dvw;

		&::before {
			content: attr(title);
			display: block;
			position: absolute;
			top: 0;
			/* Pixel-perfect port of YT's gradient PNG, using https://github.com/bluesmoon/pngtocss plus optimizations */
			background-image: linear-gradient(
				180deg,
				rgb(0 0 0 / 67%) 0%,
				rgb(0 0 0 / 54%) 14%,
				rgb(0 0 0 / 15%) 54%,
				rgb(0 0 0 / 5%) 72%,
				rgb(0 0 0 / 0%) 94%
			);
			block-size: 99px;
			inline-size: 100%;
			font-family: 'YouTube Noto', Roboto, Arial, Helvetica, sans-serif;
			color: hsl(0deg 0% 93.33%);
			text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
			font-size: var(--pf-text-md);
			padding-inline: clamp(0.5rem, 0.12rem + 12vw, 1.5rem);
			padding-block: clamp(0.25rem, 0.12rem + 12vi, 1.5rem);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			box-sizing: border-box;
		}

		&::after {
			content: '';
			display: block;
			padding-bottom: calc(100% / (16 / 9));
		}

		& > iframe {
			block-size: 100%;
			inline-size: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border: none;
		}

		& > button {
			display: block;
			/* Make the button element cover the whole area for a large hover/click target… */
			inline-size: 100%;
			block-size: 100%;
			/* …but visually it's still the same size */
			background: no-repeat center/68px 48px;
			/* YT's actual play button svg */
			background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>');
			position: absolute;
			cursor: pointer;
			z-index: 1;
			filter: grayscale(100%);
			transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1);
			border: 0;
		}
	}
</style>
