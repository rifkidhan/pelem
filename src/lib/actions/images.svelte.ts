import type { Action } from 'svelte/action';

type YtImageAction = Action<
	HTMLElement,
	{ key: string; quality?: 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' }
>;

export const ytImage: YtImageAction = (node, { key, quality = 'maxresdefault' }) => {
	// const url = `https://i.ytimg.com/vi/${key}/${quality}.jpg`;
	const url = `https://i.ytimg.com/vi_webp/${key}/${quality}.webp`;

	node.style.backgroundImage = `url(${url})`;
	node.style.backgroundSize = 'cover';
	node.style.backgroundPosition = 'center center';
};
