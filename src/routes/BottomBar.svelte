<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import IconButton from './items/IconButton.svelte';
	import type { LanguageType } from '$lib/types';
	import { PROGRAM_VERSION, writeUsersOnline } from '$lib';
	import { source } from 'sveltekit-sse';

	let {
		settingsModal = $bindable(false),
		feedbackModal = $bindable(false),
		authorModal = $bindable(false),
		helpModal = $bindable(false),
		changelogModal = $bindable(false),
		currentLocale,
		clicked = $bindable(false)
	} = $props();

	let ready = $state(false);

	let usersAmount = $state(0);
	source('/count')
		.select('users')
		.subscribe((value) => {
			usersAmount = parseInt(value);
			if (isNaN(usersAmount)) usersAmount = 0;
		});

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
	<div class="flex w-full shrink-0 grow-0 max-lg:h-15! lg:h-10!"></div>
{/if}

{#key ready || clicked}
	<div
		class="
   absolute bottom-0 z-50 flex w-full flex-row items-center gap-2 border-t-2 border-gray-800 bg-gray-500 p-2 text-gray-800 shadow-lg max-lg:h-15! max-lg:text-3xl max-lg:leading-8 lg:h-10! lg:text-2xl
    {!clicked ? 'opacity-100' : 'opacity-0'}
    "
		transition:fly={{ duration: 250, opacity: 0, x: 0, y: 100 }}
	>
		<span class="flex grow flex-row gap-2" id="bottom">
			<p class="font-bold max-lg:text-xl lg:text-lg">
				{m.nameShort({}, { locale: currentLocale as LanguageType })}
				{PROGRAM_VERSION}
			</p>

			<p class="text-lg max-lg:hidden">
				{m.nameLong({}, { locale: currentLocale as LanguageType })}
			</p>
		</span>

		<div class="grow"></div>

		<div class="max-lg:text-xl lg:text-lg">
			{usersAmount}
			{writeUsersOnline(usersAmount, currentLocale)}
		</div>

		<IconButton
			onclick={() => {
				helpModal = true;
			}}
			label="Help"
			emoji="question"
			triggered={helpModal}
		/>

		<IconButton
			onclick={() => {
				settingsModal = true;
			}}
			label="Settings"
			emoji="settings-3"
			triggered={settingsModal}
		/>

		<IconButton
			onclick={() => {
				feedbackModal = true;
			}}
			label="Send feedback"
			triggered={feedbackModal}
			emoji="feedback"
		/>

		<IconButton
			onclick={() => {
				changelogModal = true;
			}}
			label="Changelog"
			emoji="file-edit"
			triggered={changelogModal}
		/>

		<IconButton
			onclick={() => {
				authorModal = true;
			}}
			label="Credits"
			emoji="user-3"
			triggered={authorModal}
		/>
	</div>
{/key}
