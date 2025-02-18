<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>
	<span class="status">{page.status}</span>
	<span class="message">{page.error?.message}</span>
</h1>

<style>
	h1 {
		text-align: center;
		display: inline-flex;
		flex-direction: column;
		max-inline-size: 92dvw;
		margin-inline: auto;
		font-size: var(--pf-text-display);
		line-height: 1;

		.status {
			font-size: 2em;
			font-weight: 800;
			color: hsl(var(--pf-primary));
			letter-spacing: 2;
		}
	}
</style>
