<script lang="ts">
	import type { LayoutProps } from "./$types";

	// import { onNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import { BackToButton, Footer, Header } from "$lib/components";
	import { TITLE_PAGE } from "$lib/utils/constants";
	import isNull from "$lib/utils/isNull";

	import "$lib/styles/main.css";

	let { children }: LayoutProps = $props();

	// onNavigate((navigate) => {
	// 	if (!document.startViewTransition) return;

	// 	return new Promise((resolve) => {
	// 		document.startViewTransition(async () => {
	// 			resolve();
	// 			await navigate.complete;
	// 		});
	// 	});
	// });

	let meta = $derived(page.data.meta);

	let title = $derived(
		meta && !isNull(meta.title) ? `${meta.title} | ${TITLE_PAGE}` : TITLE_PAGE
	);
	let description = $derived(
		meta && !isNull(meta.description) ? meta.description : "The movie list website."
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />
</svelte:head>

<Header />
{@render children()}
<BackToButton />
<Footer />
