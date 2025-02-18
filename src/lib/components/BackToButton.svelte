<script lang="ts">
	import { scrollY } from 'svelte/reactivity/window';
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';
</script>

{#if scrollY.current && scrollY.current > 1000}
	<div class="back-to-button" transition:fly={{ y: '100px' }}>
		<Button
			type="button"
			size="square"
			title="Back to top"
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		>
			<Icon icon="chevron-top" hidden />
		</Button>
	</div>
{/if}

<style>
	.back-to-button {
		position: fixed;
		bottom: 5vh;
		right: 3dvw;
		z-index: 6;
	}
</style>
