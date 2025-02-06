import { tick } from "svelte";
import type { Action } from "svelte/action";

export const truncate: Action<HTMLElement> = (node) => {
	let truncate = $state(node.scrollHeight > node.clientHeight);
	let open = $state(false);

	const onResize = () => {
		tick().then(() => {
			truncate = node.scrollHeight > node.clientHeight;
		});
	};

	const onClick = () => {
		open = !open;
	};

	$effect(() => {
		node.addEventListener("click", onClick, { passive: true });
		window.addEventListener("resize", onResize);

		if (truncate) {
			node.dataset.truncated = String(truncate);
			node.dataset.expand = String(open);
		} else {
			node.removeAttribute("data-truncated");
			node.removeAttribute("data-expand");
		}

		return () => {
			node.removeEventListener("click", onClick);
			window.removeEventListener("resize", onResize);
		};
	});
};
