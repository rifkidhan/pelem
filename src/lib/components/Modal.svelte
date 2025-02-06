<script lang="ts">
	import type { HTMLDialogAttributes } from "svelte/elements";

	import Button from "./Button.svelte";
	import Icon from "./icon/Icon.svelte";

	interface ModalProps extends HTMLDialogAttributes {
		title?: string;
	}

	let { title, children, ...attrs }: ModalProps = $props();

	let modal = $state() as HTMLDialogElement;

	let open = $state(false);

	const closeModal = () => {
		open = false;
		modal.close();
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
		transform: translateX(100dvh);
		transition: transform 0.7s ease-in-out, overlay 0.7s ease-in-out, display 0.7s ease-in-out;
		transition-behavior: allow-discrete;

		&::backdrop {
			background-color: hsla(var(--pf-black), 0.5);
			backdrop-filter: blur(4px);
		}

		&[open] {
			border-radius: 1rem;
			margin: auto;
			box-shadow: var(--pf-shadow-lg);
			transform: translateX(0);

			@starting-style {
				transform: translateX(0);
			}
		}
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		inline-size: fit-content;
		padding: 1rem;
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
	}
</style>
