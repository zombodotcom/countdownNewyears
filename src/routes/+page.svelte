<script lang="ts">
	import Countdown from './Countdown.svelte';
	import { onDestroy, onMount } from 'svelte';
	import NextCities from './NextCities.svelte';
	import PrevCities from './PrevCities.svelte';
	import Earth3D from './Earth3D.svelte';

	let { data } = $props();

	let currentLocale = $state('en');
	let debugMode = $state(false);

	let interval: NodeJS.Timeout | undefined = $state(undefined);
	let now = $state(new Date());
	let target = $derived(new Date(data.countdown.getTime() + now.getTimezoneOffset() * 60 * 1000));
	let isDone = $derived(now > target);

	const updateLocale = () => {
		// Always use English for store sign display
		currentLocale = 'en';
	};

	onMount(() => {
		interval = setInterval(() => {
			now = new Date();
		}, 5);

		updateLocale();
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

{#key data.countdown}
	<div class="relative h-screen w-screen overflow-hidden bg-[#000011] text-white">
		<!-- Background: 3D Earth Globe -->
		<div class="fixed inset-0 z-0">
			<Earth3D locale={currentLocale} {target} {now} debug={debugMode} />
		</div>

		<!-- Debug Toggle -->
		<div
			class="pointer-events-auto fixed right-2 bottom-2 z-50 opacity-30 transition-opacity hover:opacity-70"
		>
			<button
				onclick={() => (debugMode = !debugMode)}
				class="bg-opacity-60 hover:bg-opacity-80 rounded bg-gray-900 px-1.5 py-0.5 text-xs text-white transition-all"
				title="Toggle debug console logs"
			>
				{debugMode ? '🔊' : '🔇'}
			</button>
		</div>

		<!-- UI Overlays -->
		<div class="pointer-events-none relative z-10 flex h-full w-full flex-col">
			<!-- Top: Clock -->
			<div class="pointer-events-auto flex w-full flex-col items-center justify-center pt-8">
				<div class="w-fit">
					<Countdown {now} {target} locale={currentLocale} {isDone} />
				</div>
			</div>

			<!-- Middle: City Lists -->
			<div class="flex grow flex-row items-center justify-between overflow-hidden px-12">
				<!-- Left: Prev Cities -->
				<div class="floating-panel pointer-events-auto h-[60vh] w-72 rounded-3xl p-6">
					<PrevCities {target} {now} locale={currentLocale} />
				</div>

				<!-- Right: Next Cities -->
				<div class="floating-panel pointer-events-auto h-[60vh] w-72 rounded-3xl p-6">
					<NextCities {target} {now} locale={currentLocale} />
				</div>
			</div>
		</div>
	</div>
{/key}
