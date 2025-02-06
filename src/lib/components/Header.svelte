<script lang="ts">
	import { TITLE_PAGE } from "$lib/utils/constants";
	import throttle from "$lib/utils/throttle";
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

	let visible = $state(true);
	let scroll = $state(0);
	let lastScroll = $state(0);

	const handleScroll = throttle(() => {
		visible = (lastScroll > scroll && lastScroll - scroll > 70) || scroll < 500;
		lastScroll = scroll;
	}, 100);
</script>

<svelte:window bind:scrollY={scroll} onscroll={handleScroll} />

<header data-visible={visible}>
	<div class="header-wrapper">
		<nav>
			<div class="navigation">
				<a href="/" class="home">
					{TITLE_PAGE}
				</a>
				<ul>
					{#each NAVIGATIONS as nav}
						<li>
							<a href={nav.url}>{nav.title}</a>
						</li>
					{/each}
				</ul>
			</div>
			<ThemeToggle />
		</nav>
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
		transition: transform 200ms ease-in-out;

		&[data-visible='false'] {
			transform: translateY(-4rem);
		}

		.header-wrapper {
			inline-size: 100%;
			background-color: hsl(var(--pf-accent-20));

			& > nav {
				max-width: 92dvw;
				margin-inline: auto;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.navigation {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 1.5rem;

					& > ul {
						display: inline-flex;
						flex-direction: row;
						gap: 1rem;
					}
				}
			}
		}
	}

	.home {
		font-weight: 700;
		color: hsl(var(--pf-primary));
		font-size: clamp(1rem, calc(0.5rem + 5vw), 2rem);
	}
</style>
