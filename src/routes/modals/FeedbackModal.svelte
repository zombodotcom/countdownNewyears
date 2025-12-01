<script lang="ts">
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';

	let { feedbackModal = $bindable(false) } = $props();
</script>

<Modal bind:showModal={feedbackModal}>
	<div class="flex w-full grow flex-col gap-2 text-white">
		<h2 class="text-xl font-medium">Send feedback</h2>

		<p>
			Send any feedback to:
			<a
				class="underline"
				href="mailto:martin.bykov.s@gyarab.cz?subject=%5BFestIES%5D%20Feedback&body=What%20happened%3F"
				>martin.bykov.s@gyarab.cz</a
			>
		</p>

		<Button
			text="Close"
			emoji={'close-circle'}
			onclick={() => {
				feedbackModal = false;
			}}
		/>
	</div>
</Modal>
