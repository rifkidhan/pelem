<script lang="ts">
	import { ICONS } from "./icons";

	interface IconProps {
		icon: keyof typeof ICONS;
		width?: number;
		height?: number;
		strokeWidth?: number;
		fill?: string;
		stroke?: string;
		class?: string;
		hidden?: boolean;
	}

	let {
		icon,
		width = 24,
		height = 24,
		strokeWidth = 2,
		stroke = "currentColor",
		fill = "none",
		class: className,
		hidden
	}: IconProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	{fill}
	{stroke}
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden={hidden}
>
	{@html ICONS[icon]}
</svg>
