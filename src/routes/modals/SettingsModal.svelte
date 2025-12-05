<script lang="ts">
	import { enhance } from '$app/forms';
	import { dateToString } from '$lib';
	import { m } from '$lib/paraglide/messages';
	import { locales } from '$lib/paraglide/runtime';
	import Modal from '../Modal.svelte';
	import Button from '../items/Button.svelte';

	let { settingsModal = $bindable(false), data } = $props();

	let hasDifferentTime = $state(false);
	let hasPlaylist = $state(data.playlist.length > 0);
</script>

<Modal bind:showModal={settingsModal}>
	<div class="flex w-full flex-col gap-2">
		<form
			class="flex grow flex-col gap-2"
			use:enhance={async (event) => {
				let time = event.formData.get("time") as string;
				event.formData.set("time", new Date(new Date(time).getTime() - new Date().getTimezoneOffset()*60*1000).toISOString());
				console.log(time);
				console.log(new Date().getTimezoneOffset());
				console.log(new Date(new Date(time).getTime() - new Date().getTimezoneOffset()*60*1000).toISOString());
				return async ({ update }) => {
					await update({ reset: false, invalidateAll: true });
				};
			}}
			method="post"
			action="/?/settings"
		>
			<div
				class="grid w-full gap-2 text-white *:flex *:grow *:flex-col *:gap-2 max-lg:grid-cols-1 lg:grid-cols-2"
			>
				<div>
					<h2 class="text-xl font-medium">Settings</h2>

					<h2 class="text-lg">Time settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input
							type="checkbox"
							class="checkbox"
							name="hastime"
							bind:checked={hasDifferentTime}
						/>
						<label for="hastime">Set custom countdown</label>
					</span>
					{#if hasDifferentTime}
						<span class="flex w-full flex-col gap-2">
							<input
								type="datetime-local"
								name="time"
								min={dateToString(new Date())}
								required
								value={dateToString(data.countdown as Date)}
								step={0}
							/>
							<label for="time" class="italic">Countdown target date and time</label>
						</span>
					{/if}

					<h2 class="text-lg">Color settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="color" name="bg" required value={data.background} />
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
							value={data.playlist}
							required
						/>
					{/if}

					<h2 class="text-lg">Clock settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="checkbox" class="checkbox" name="millisecond" checked={data.millisecond} />
						<label for="millisecond">Millisecond hand on clock</label>
					</span>

					<h2 class="text-lg">Bottom bar Settings</h2>
					<span class="flex w-full flex-row gap-2">
						<input type="checkbox" class="checkbox" name="journey" checked={data.journey} />
						<label for="journey">Events on bottom bar enabled</label>
					</span>
				</div>

				<div>
					<h2 class="text-lg">Language settings</h2>
					{#each locales as locale (locale)}
						<span class="flex w-full flex-row gap-2">
							<input
								type="checkbox"
								class="checkbox"
								name={'lang-' + locale}
								checked={data.languages.findIndex((v: string) => v == locale) !== -1}
							/>
							<label for={'lang-' + locale}>{m.languageName({}, { locale })}</label>
						</span>
					{/each}
				</div>
			</div>
			<Button text="Set settings" emoji="check-double" type="submit" />
		</form>
		<Button
			text="Close"
			emoji="close-circle"
			onclick={() => {
				settingsModal = false;
			}}
		/>
	</div>
</Modal>
