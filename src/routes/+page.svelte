<script lang="ts">
	import Countdown from './Countdown.svelte';
	import { onDestroy, onMount } from 'svelte';
	import NextCities from './NextCities.svelte';
	import PrevCities from './PrevCities.svelte';
	import Earth3D from './Earth3D.svelte';

	let { data } = $props();

	let currentLocale = $state('en');

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
			<Earth3D locale={currentLocale} {target} {now} />
		</div>

		<!-- UI Overlays -->
		<div class="relative z-10 flex h-full w-full flex-col pointer-events-none">
			<!-- Top: Clock -->
			<div class="flex w-full flex-col items-center justify-center pt-8 pointer-events-auto">
				<div class="w-fit">
					<Countdown {now} {target} locale={currentLocale} isDone={isDone} />
				</div>
			</div>

			<!-- Middle: City Lists -->
			<div class="flex grow flex-row justify-between px-12 items-center overflow-hidden">
				<!-- Left: Prev Cities -->
				<div class="w-80 h-[65vh] floating-panel rounded-3xl p-6 pointer-events-auto">
					<PrevCities {target} {now} locale={currentLocale} />
				</div>

				<!-- Right: Next Cities -->
				<div class="w-80 h-[65vh] floating-panel rounded-3xl p-6 pointer-events-auto">
					<NextCities {target} {now} locale={currentLocale} />
				</div>
			</div>
		</div>
	</div>
{/key}
