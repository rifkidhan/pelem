<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	const date = new SvelteDate().getFullYear();
</script>

<footer>
	<div class="footer-wrapper">
		<div class="footer-top"></div>
		<div class="footer-bottom">
			<div>
				{date} Rifkidhan.
			</div>
			<div>
				Database from <a
					href="https://www.themoviedb.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					TMDB</a
				>
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: var(--pf-accent-20);
		width: 100%;

		.footer-wrapper {
			display: flex;
			position: relative;
			max-width: 92vw;
			margin-inline: auto;
		}
	}

	.footer-bottom {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
</style>
