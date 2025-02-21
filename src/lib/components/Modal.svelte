<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';

	import Button from './Button.svelte';
	import Icon from './icon/Icon.svelte';

	interface ModalProps extends HTMLDialogAttributes {
		title?: string;
	}

	let { title, children, ...attrs }: ModalProps = $props();

	let modal = $state() as HTMLDialogElement;

	let open = $state(false);

	const closeModal = () => {
		modal.close();
		open = false;
	};

	export const openModal = () => {
		open = true;
		modal.showModal();
	};
</script>

<dialog bind:this={modal} {...attrs}>
	{#if open}
		<div class="wrapper">
			<div class="top">
				<div class="title">
					{title}
				</div>
				<Button
					type="button"
					variant="ghost"
					size="square"
					aria-label="Close modal"
					onclick={closeModal}
				>
					<Icon icon="close" />
				</Button>
			</div>
			{@render children?.()}
		</div>
	{/if}
</dialog>

<style>
	dialog {
		max-inline-size: 90dvw;
		max-block-size: 90dvh;
		margin: auto;

		&::backdrop {
			background-color: color-mix(in oklab, var(--pf-black) 50%, transparent);
			backdrop-filter: blur(6px);
		}

		&:open {
			border-radius: var(--pf-radius);
			margin: auto;
			box-shadow: var(--pf-shadow-lg);
		}
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		inline-size: fit-content;
		padding: 1rem;
		box-shadow: var(--pf-shadow-md);
	}

	.top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		& > .title {
			font-weight: 600;
		}
		& > :global(button) {
			flex-shrink: 0;
		}
	}
</style>
