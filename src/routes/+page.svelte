<script lang="ts">
	import BottomBar from './BottomBar.svelte';
	import Countdown from './Countdown.svelte';
	import { onDestroy, onMount } from 'svelte';
	import NextCities from './NextCities.svelte';
	import PrevCities from './PrevCities.svelte';
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
	let target = $derived(new Date(data.countdown.getTime() + new Date().getTimezoneOffset()*60*1000));

	const updateLocale = () => {
		if (data.languages.length == 0) {
			currentLocale = 'en';
			return;
		}
		if (currentLocaleIndex > data.languages.length) currentLocaleIndex = 0;

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

{#key data.countdown}
	<div
		class="relative flex h-screen max-h-screen min-h-screen w-full grow flex-col gap-0 overflow-hidden **:overflow-hidden"
	>
		<div class="flex w-full grow flex-col max-lg:gap-2 lg:gap-6">
			<div class="flex grow-5 flex-row p-5 pb-0! max-lg:gap-2 lg:gap-6">
				{#key clicked}
					<span class="flex w-1/5 max-w-1/5 min-w-1/5 grow flex-col max-2xl:hidden">
						<PrevCities {target} {now} locale={currentLocale} />
					</span>
				{/key}

				<div
					class="flex grow flex-col items-center justify-center overflow-hidden max-lg:gap-2 lg:gap-6"
				>
					<Countdown {now} {target} locale={currentLocale} isDone={now > target} />

					<div
						class="flex w-full grow overflow-hidden max-lg:flex-col max-lg:gap-2 lg:flex-row lg:gap-6"
					>
						{#key clicked}
							<Timezone locale={currentLocale} {target} {now} />
						{/key}

						<div
							class="flex grow flex-col overflow-hidden max-lg:w-full max-lg:gap-2 lg:max-w-1/4 lg:min-w-1/4 lg:gap-6"
						>
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
					<span class="flex w-1/5 max-w-1/5 min-w-1/5 grow flex-col max-2xl:hidden">
						<NextCities {target} {now} locale={currentLocale} />
					</span>
				{/key}
			</div>

			{#key data.journey}
				<JourneyBar locale={currentLocale} journey={data.journey} />
			{/key}
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
{/key}

<SettingsModal bind:settingsModal {data} />

<FeedbackModal bind:feedbackModal />

<AuthorModal bind:authorModal />

<ChangelogModal bind:changelogModal />

<HelpModal bind:helpModal />
