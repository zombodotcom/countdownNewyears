<script lang="ts">
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';
	import { enhance } from '$app/forms';

	let { feedbackModal = $bindable(false) } = $props();
</script>

<Modal bind:showModal={feedbackModal}>
	<form
		class="flex w-full grow flex-col gap-2 text-white"
		use:enhance
		method="post"
		action="/?/feedback"
	>
		<h2 class="text-xl font-medium">Send feedback</h2>

		<textarea name="message" class="bg-white p-2 text-gray-700" placeholder="Enter message here..."> </textarea>
		<Button text="Send" emoji={'send-plane'} type="submit"></Button>

		<p>
			Contact:
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
	</form>
</Modal>
