<script lang="ts" module>
	let prefetch = false;

	const LINK_TO_PREFETCH = [
		'https://www.youtube-nocookie.com',
		'https://www.youtube.com',
		'https://www.google.com'
	];

	const warmConnection = () => {
		if (prefetch) return;
		const addPrefetch = (url: string) => {
			const elem = document.createElement('link');
			elem.rel = 'preconnect';
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
	import { onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { ytImage } from '$lib/actions/images.svelte';

	interface YTEmbed extends HTMLAttributes<HTMLDivElement> {
		videoKey: string;
		thumbnailQuality?: 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';
	}

	let { videoKey, title = 'Youtube video player', class: className, ...attrs }: YTEmbed = $props();

	const params = new URLSearchParams({ autoplay: '1', playsinline: '1' });

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

<div
	class={['video', 'yt-embed', className]}
	{title}
	use:ytImage={{ key: videoKey, quality: 'hqdefault' }}
	{...attrs}
>
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
		min-inline-size: 40dvw;

		& > iframe {
			block-size: 100%;
			inline-size: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border: none;
		}
	}
</style>
