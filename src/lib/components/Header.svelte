<script lang="ts">
	import { TITLE_PAGE } from "$lib/utils/constants";
	import Button from "./Button.svelte";
	import Icon from "./icon/Icon.svelte";
	import ThemeToggle from "./ThemeToggle.svelte";

	const NAVIGATIONS = [
		{
			title: "Movies",
			url: "/movie"
		},
		{
			title: "TV Shows",
			url: "/tv-show"
		},
		{
			title: "People",
			url: "/people"
		}
	];
</script>

<header>
	<nav>
		<a href="/" class="home">
			<span>
				{TITLE_PAGE}
			</span>
		</a>
		<div class="navigation">
			<ul>
				{#each NAVIGATIONS as nav}
					<li>
						<a href={nav.url}>{nav.title}</a>
					</li>
				{/each}
			</ul>
			<ThemeToggle />
			<Button popovertarget="mobile-navigation" class="nav-button" variant="ghost" size="square">
				<Icon icon="menu" />
				<span class="sr-only">Menu</span>
			</Button>
		</div>
	</nav>
	<div id="mobile-navigation" popover="auto">
		Test
	</div>
</header>

<style>
	header {
		display: block;
		position: sticky;
		inline-size: 100%;
		block-size: var(--pf-header-height);
		top: 0;
		left: 0;
		z-index: 5;
		background-color: hsl(var(--pf-accent-20));

		& > nav {
			max-width: 92dvw;
			margin-inline: auto;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			block-size: 100%;

			.navigation {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 1.5rem;

				@media (min-width: 768px) {
					:global(.nav-button) {
						display: none;
					}
				}

				& > ul {
					display: inline-flex;
					flex-direction: row;
					gap: 1rem;

					@media (max-width: 768px) {
						display: none;
					}
				}
			}
		}
	}

	.home {
		font-weight: 700;
		color: hsl(var(--pf-primary));
		font-size: clamp(1rem, calc(0.5rem + 5vw), 2rem);
		line-height: 1;
	}

	[popover] {
		inset: unset;
	}
	#mobile-navigation {
		inline-size: 60dvw;
		block-size: 100dvh;
		right: 0;
		top: 0;
		backdrop-filter: blur(2px);
	}
</style>
