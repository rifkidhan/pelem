<script lang="ts">
	import type { ExternalIds } from '$lib/types';
	import isNull from '$lib/utils/isNull';
	import Link from './Link.svelte';

	interface OfficialSiteProps extends ExternalIds {
		homepage?: string;
	}

	let {
		homepage,
		facebook_id,
		instagram_id,
		twitter_id,
		tiktok_id,
		youtube_id
	}: OfficialSiteProps = $props();
</script>

{#if homepage || facebook_id || instagram_id || twitter_id || tiktok_id || youtube_id}
	<div class="official-site">
		{#if homepage}
			<span>
				<Link href={homepage} external>Official site</Link>
			</span>
		{/if}
		{#if facebook_id}
			<span>
				<Link href={`https://facebook.com/${facebook_id}`} external>Facebook</Link>
			</span>
		{/if}
		{#if instagram_id}
			<span>
				<Link href={`https://instagram.com/${instagram_id}`} external>Instagram</Link>
			</span>
		{/if}
		{#if twitter_id}
			<span>
				<Link href={`https://x.com/${twitter_id}`} external>X</Link>
			</span>
		{/if}
		{#if youtube_id}
			<span>
				<Link href={`https://youtube.com/@${youtube_id}`}>Youtube</Link>
			</span>
		{/if}
		{#if tiktok_id}
			<span>
				<Link href={`https://tiktok.com/@${tiktok_id}`} />
			</span>
		{/if}
	</div>
{/if}

<style>
	.official-site {
		display: flex;
		flex-direction: row;

		& > span:not(:last-child)::after {
			content: '•';
			margin-inline: 0.5rem;
		}
	}
</style>
