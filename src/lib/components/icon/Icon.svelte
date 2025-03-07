<script lang="ts">
	import { ICONS } from './icons';
	import type { ClassValue } from 'svelte/elements';

	interface IconProps {
		icon: keyof typeof ICONS;
		width?: number;
		height?: number;
		strokeWidth?: number;
		fill?: string;
		stroke?: string;
		class?: ClassValue;
		hidden?: boolean;
		size?: number;
	}

	let {
		icon,
		strokeWidth = 2,
		size = 24,
		stroke = 'currentColor',
		fill = 'none',
		class: className,
		hidden
	}: IconProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
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
