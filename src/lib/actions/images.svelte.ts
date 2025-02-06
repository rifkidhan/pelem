import type { Action } from "svelte/action";

import { IMAGE_URL } from "$lib/utils/constants";

type YtImageAction = Action<
	HTMLElement,
	{ key: string; quality?: "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault" }
>;

type BackdropAction = Action<HTMLElement, { src?: string }>;

export const ytImage: YtImageAction = (node, { key, quality = "maxresdefault" }) => {
	// const url = `https://i.ytimg.com/vi/${key}/${quality}.jpg`;
	const url = `https://i.ytimg.com/vi_webp/${key}/${quality}.webp`;

	node.style.backgroundImage = `url(${url})`;
	node.style.backgroundSize = "cover";
	node.style.backgroundPosition = "center center";
};

export const backdrop: BackdropAction = (node, { src }) => {
	if (src) {
		const url = `${IMAGE_URL}w300${src}`;
		node.style.backgroundImage = `url(${url})`;
		node.style.backgroundSize = "cover";
		node.style.backgroundPosition = "center";
	} else {
		node.style.backgroundColor = "hsl(var(--pf-accent-80))";
	}
};
