<script lang="ts">
	import { TITLE_PAGE } from '$lib/utils/constants';
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const NAVIGATIONS = [
		{
			title: 'Movies',
			url: '/movie'
		},
		{
			title: 'TV Shows',
			url: '/tv-show'
		},
		{
			title: 'People',
			url: '/people'
		}
	];

	let mobileNav: HTMLElement | undefined = $state();
</script>

<header>
	<nav>
		<a href="/" class="home">
			<span>
				{TITLE_PAGE}
			</span>
		</a>
		<div class="navigation">
			<ul class="nav-items">
				{#each NAVIGATIONS as nav}
					<li>
						<a href={nav.url}>{nav.title}</a>
					</li>
				{/each}
			</ul>
			<div class="nav-items">
				<Button title="Search" size="square" variant="ghost">
					<Icon icon="search" hidden />
				</Button>
				<ThemeToggle />
				<Button
					popovertarget="mobile-navigation"
					popovertargetaction="show"
					class="nav-button"
					variant="ghost"
					size="square"
					title="open navigation"
				>
					<Icon icon="menu" hidden />
				</Button>
			</div>
		</div>
	</nav>
	<div id="mobile-navigation" popover="auto" bind:this={mobileNav}>
		<div class="head">
			<Button
				size="square"
				variant="ghost"
				popovertarget="mobile-navigation"
				popovertargetaction="hide"
			>
				<Icon icon="close" hidden />
				<span class="sr-only">close navigation</span>
			</Button>
		</div>
		<nav>
			<ul>
				{#each NAVIGATIONS as nav}
					<li>
						<a
							class="sidenav-item"
							href={nav.url}
							onclick={() => {
								if (!mobileNav) return;

								mobileNav.hidePopover();
							}}
						>
							{nav.title}
						</a>
					</li>
				{/each}
			</ul>
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

				& > .nav-items {
					display: inline-flex;
					flex-direction: row;
					gap: 0.5rem;

					&:is(ul) {
						gap: 0.75rem;

						@media (max-width: 768px) {
							display: none;
						}
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
		inline-size: 70dvw;
		block-size: 100dvh;
		right: 0;
		top: 0;
		box-shadow: var(--pf-shadow-md);
		padding-inline: 0.5rem;

		& > .head {
			display: flex;
			gap: 0.5rem;
			height: var(--pf-header-height);
			align-items: center;
			justify-content: flex-end;
		}

		& > nav {
			font-size: var(--pf-text-lg);
		}
	}
</style>
