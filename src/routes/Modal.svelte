<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { children, showModal = $bindable(), cssClass = '' } = $props();
	let dialog: HTMLDialogElement | undefined = $state();
	let clickable: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (showModal) dialog?.showModal();
		else dialog?.close();
	});

	$effect(() => {
		if (showModal) dialog?.showModal();
		else dialog?.close();
	});
</script>

{#key showModal}
	<div class="absolute! m-0! h-0! w-0! p-0! *:bg-transparent">
		<dialog
			transition:fade|global={{ duration: 250 }}
			bind:this={dialog}
			onclose={() => (showModal = false)}
			onclick={(e) => {
				if (!clickable?.contains(e.target as Node)) dialog?.close();
			}}
			class="min-h-screen h-screen max-h-screen w-screen max-w-screen min-w-screen
		backdrop:bg-gray-500/50"
		>
			<div class="flex w-full grow flex-col items-center justify-center h-screen">
				<div
					bind:this={clickable}
					class="
				{cssClass ? cssClass : 'bg-gray-500!'} mt-5 mb-5 max-w-1/3 rounded-lg p-5 text-left
			"
				>
					{@render children?.()}
				</div>
			</div>
		</dialog>
	</div>
{/key}
