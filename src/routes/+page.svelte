<script lang="ts">
	import BottomBar from './BottomBar.svelte';
	import Countdown from './Countdown.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { locales } from '$lib/paraglide/runtime';
	import NextCities from './NextCities.svelte';
	import PrevCities from './PrevCities.svelte';
	import type { LanguageType } from '$lib/types';
	import MusicPlayer from './MusicPlayer.svelte';
	import Timezone from './Timezone.svelte';
	import AnalogClock from './AnalogClock.svelte';
	import JourneyBar from './JourneyBar.svelte';
	import AuthorModal from './modals/AuthorModal.svelte';
	import HelpModal from './modals/HelpModal.svelte';
	import FeedbackModal from './modals/FeedbackModal.svelte';
	import ChangelogModal from './modals/ChangelogModal.svelte';
	import SettingsModal from './modals/SettingsModal.svelte';

	let { data } = $props();

	let settingsModal = $state(false);
	let feedbackModal = $state(false);
	let authorModal = $state(false);
	let changelogModal = $state(false);
	let helpModal = $state(false);

	let localeInterval: NodeJS.Timeout | undefined = $state(undefined);
	let currentLocaleIndex = $state(0);
	let currentLocale = $state('');

	let interval: NodeJS.Timeout | undefined = $state(undefined);
	let now = $state(new Date());
	let target = $state(new Date(2026, 0, 1, 0, 0, 0, 0));
	//let target = $state(new Date(2025, 11, 1, 0, 0, 0, 0)); //DEBUG

	const updateLocale = () => {
		if(data.languages.length == 0) {
			currentLocale = "en";
			return;
		}
		if(currentLocaleIndex > data.languages.length) currentLocaleIndex = 0;

		currentLocaleIndex++;
		if (currentLocaleIndex === data.languages.length) currentLocaleIndex = 0;
		currentLocale = data.languages[currentLocaleIndex];
	};

	onMount(() => {
		localeInterval = setInterval(updateLocale, 3000);
		interval = setInterval(() => {
			now = new Date();
		}, 5);

		updateLocale();
	});
	onDestroy(() => {
		clearInterval(localeInterval);
		clearInterval(interval);
	});

	let clicked = $state(false);
</script>

<div
	class="relative flex overflow-hidden **:overflow-hidden h-screen max-h-screen min-h-screen w-full grow flex-col gap-0"
>
	<div class="flex w-full grow flex-col gap-6">
		<div class="flex grow-5 flex-row gap-6 p-5 pb-0!">
			{#key clicked}
				<PrevCities {target} {now} locale={currentLocale} {clicked} />
			{/key}

			<div class="flex grow flex-col items-center justify-center gap-6 overflow-hidden">
				<Countdown {now} {target} locale={currentLocale} isNewYear={now > target} />

				<div class="flex w-full grow flex-row gap-6 overflow-hidden">
					{#key clicked}
						<Timezone locale={currentLocale} />
					{/key}

					<div class="flex max-w-1/4 min-w-1/4 grow flex-col gap-6 overflow-hidden">
						{#key clicked}
							<AnalogClock locale={currentLocale} {now} ms={data.millisecond} />
						{/key}

						<MusicPlayer
							link={data.playlist}
							locale={currentLocale}
							switchedToHandel={now > target}
						/>
					</div>
				</div>
			</div>

			{#key clicked}
				<NextCities {target} {now} locale={currentLocale} {clicked} />
			{/key}
		</div>

		<JourneyBar locale={currentLocale} />
	</div>

	<BottomBar
		{currentLocale}
		bind:settingsModal
		bind:feedbackModal
		bind:authorModal
		bind:helpModal
		bind:changelogModal
		bind:clicked
	/>
</div>

<SettingsModal bind:settingsModal {data} />

<FeedbackModal bind:feedbackModal />

<AuthorModal bind:authorModal />

<ChangelogModal bind:changelogModal />

<HelpModal bind:helpModal />
