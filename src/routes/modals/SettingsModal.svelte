<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import { locales } from '$lib/paraglide/runtime';
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';

	let { settingsModal = $bindable(false), data } = $props();

	let hasPlaylist = $state(true);
</script>

<Modal bind:showModal={settingsModal}>
	<div class="flex w-full flex-col gap-2">
		<form class="flex grow flex-col gap-2" use:enhance method="post" action="/?/settings">
			<div class="grid w-full grid-cols-2 gap-2 text-white *:flex *:grow *:flex-col *:gap-2">
				<div>
					<h2 class="text-xl font-medium">Settings</h2>

					<h2 class="text-lg">Color settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="color" name="bg" required />
						<label for="bg">Background color</label>
					</span>

					<h2 class="text-lg">Playlist settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="checkbox" class="checkbox" name="hasplaylist" bind:checked={hasPlaylist} />
						<label for="hasplaylist">Add music player</label>
					</span>
					{#if hasPlaylist}
					<input
						type="text"
						name="playlist"
						class="rounded-lg bg-white p-2 text-gray-700"
						placeholder="Enter link here..."
						required
					/>
					{/if}

					<h2 class="text-lg">Clock settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="checkbox" class="checkbox" name="millisecond" />
						<label for="millisecond">Millisecond hand on clock</label>
					</span>

					<h2 class="text-lg">Bottom bar Settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="checkbox" class="checkbox" name="journey" />
						<label for="journey">Events on bottom bar enabled</label>
					</span>
				</div>

				<div>
					<h2 class="text-lg">Language settings</h2>
					{#each locales as locale}
						<span class="flex w-full flex-row gap-2">
							<input type="checkbox" class="checkbox" name={'lang-' + locale} />
							<label for={'lang-' + locale}>{m.languageName({}, { locale })}</label>
						</span>
					{/each}
				</div>
			</div>
			<Button text="Set settings" emoji={'check-double'} type="submit" />
		</form>
		<Button
			text="Close"
			emoji={'close-circle'}
			onclick={() => {
				settingsModal = false;
			}}
		/>
	</div>
</Modal>
