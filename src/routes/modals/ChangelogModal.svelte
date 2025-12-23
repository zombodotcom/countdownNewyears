<script lang="ts">
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';
	import { PROGRAM_VERSION } from '$lib';
	import VersionItem from '../items/VersionItem.svelte';

	let { changelogModal = $bindable(false) } = $props();
</script>

<Modal bind:showModal={changelogModal}>
	<div class="flex w-full grow flex-col gap-2 text-white">
		<div class="flex flex-row items-center gap-2">
			<h2 class="text-xl font-medium">Changelog</h2>
			<p class="italic opacity-50">Current version: {PROGRAM_VERSION}</p>
		</div>

		<VersionItem version="1.0.0" date="30.11.2025">
			<li>Original version</li>
		</VersionItem>

		<VersionItem version="1.0.1" date="20.12.2025">
			<li>
				More effects on the bottom (ČD 680 Pendolino, PolRegio train, Forest growing and line of
				buildings)
			</li>
			<li>Small style improvements</li>
		</VersionItem>

		<VersionItem version="1.0.2" date="23.12.2025">
			<li>Fixed graphical issue with scrollbars</li>
			<li>Changelog modal improvements</li>
			<li>Added snow amount setting</li>
			<li>Added default playlist in form</li>
			<li>Fixed some values not being set after updates</li>
		</VersionItem>

		<Button
			text="Close"
			emoji="close-circle"
			onclick={() => {
				changelogModal = false;
			}}
		/>
	</div>
</Modal>
