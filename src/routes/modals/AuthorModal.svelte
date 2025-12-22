<script lang="ts">
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';

	let { authorModal = $bindable(false) } = $props();
</script>

<Modal bind:showModal={authorModal}>
	<div class="flex w-full grow flex-col gap-2 text-white">
		<h2 class="text-xl font-medium">Credits and author information</h2>

		<p>Copyright © Martin Bykov 2023-{new Date().getFullYear()}</p>

		<Button
			text="Close"
			emoji="close-circle"
			onclick={() => {
				authorModal = false;
			}}
		/>
	</div>
</Modal>
