<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import IconButton from './items/IconButton.svelte';
	import type { LanguageType } from '$lib/types';

	let {
		settingsModal = $bindable(false),
		feedbackModal = $bindable(false),
		authorModal = $bindable(false),
		helpModal = $bindable(false),
		changelogModal = $bindable(false),
		currentLocale,
		clicked = $bindable(false),
	} = $props();

	let ready = $state(false);

	const clickHandler = (e: MouseEvent) => {
		if (document.getElementById('bottom')?.contains(document.elementFromPoint(e.pageX, e.pageY))) {
			clicked = !clicked;
		}
	};

	onMount(() => {
		if (!browser) return;
		document.addEventListener('click', clickHandler, { passive: true });
	});

	onDestroy(() => {
		if (!browser) return;
		document.removeEventListener('click', clickHandler);
	});
</script>

{#if !clicked}
	<div class="h-10! w-full flex shrink-0 grow-0"></div>
{/if}

{#key ready || clicked}
	<div
		class="
    absolute bottom-0 z-50 flex h-10! w-full flex-row items-center gap-2 border-t-2 border-gray-800 bg-gray-500 p-2 text-2xl text-gray-800
    {!clicked ? 'opacity-100' : 'opacity-0'}
    "
		transition:fly={{ duration: 250, opacity: 0, x: 0, y: 100 }}
	>
		<span class="flex grow flex-row gap-2" id="bottom">
			<p class="text-lg font-bold">
				{m.nameShort({}, { locale: currentLocale as LanguageType })}
			</p>

			<p class="text-lg">
				{m.nameLong({}, { locale: currentLocale as LanguageType })}
			</p>

			<div class="grow"></div>
		</span>

		<IconButton
			onclick={() => {
				helpModal = true;
			}}
			label="Help"
			emoji={'question'}
			triggered={helpModal}
		/>

		<IconButton
			onclick={() => {
				settingsModal = true;
			}}
			label="Settings"
			emoji={'settings-3'}
			triggered={settingsModal}
		/>

		<IconButton
			onclick={() => {
				feedbackModal = true;
			}}
			label="Send feedback"
			triggered={feedbackModal}
			emoji={'feedback'}
		/>

		<IconButton
			onclick={() => {
				changelogModal = true;
			}}
			label="Changelog"
			emoji={'file-edit'}
			triggered={changelogModal}
		/>

		<IconButton
			onclick={() => {
				authorModal = true;
			}}
			label="Credits"
			emoji={'user-3'}
			triggered={authorModal}
		/>
	</div>
{/key}
