<script lang="ts">
	import type { TimezoneType } from '$lib/types';
	import { countdownValue, getOffsetTime, makeCountdown } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	let {
		timezone,
		target,
		now,
		reverse = false
	}: { timezone: TimezoneType; target: Date; now: Date; reverse?: boolean | undefined } = $props();

	let countdown = $derived(makeCountdown(new Date(getOffsetTime(timezone.hour, target, now)), now));

	let mainInterval: NodeJS.Timeout | undefined = $state(undefined);
	let auxInterval: NodeJS.Timeout | undefined = $state(undefined);
	let mainIndex = $state(0);
	let auxIndex = $state(0);
	let mainCity = $state('');
	let auxCity = $state('');

	const updateMainIndex = () => {
		if (timezone.cities.length == 0) return;

		mainIndex++;
		if (mainIndex === timezone.cities.length) mainIndex = 0;
		mainCity = timezone.cities[mainIndex];
	};
	const updateAuxIndex = () => {
		if (timezone.otherCities.length == 0) return;

		auxIndex++;
		if (auxIndex === timezone.otherCities.length) auxIndex = 0;
		auxCity = timezone.otherCities[auxIndex];
	};

	onMount(() => {
		mainInterval = setInterval(updateMainIndex, 2500 + Math.random() * 1000);
		auxInterval = setInterval(updateAuxIndex, 2500 + Math.random() * 1000);

		mainIndex = 0;
		auxIndex = 0;

		updateMainIndex();
		updateAuxIndex();
	});
	onDestroy(() => {
		clearInterval(mainInterval);
		clearInterval(auxInterval);
	});
</script>

<div
	class="flex w-full items-center justify-between py-1 border-b border-white/5 last:border-0"
>
	<div class="flex flex-col">
		<div class="text-xl font-bold text-white">
			{mainCity}
		</div>
		{#if auxCity}
			<div class="text-sm text-neutral-500 italic">
				{auxCity}
			</div>
		{/if}
	</div>
	<div class="flex font-mono text-lg {reverse ? 'text-amber-400' : 'text-neutral-400'}">
		{#if countdown.days > 0}
			<span>{Math.abs(countdown.days).toFixed().padStart(2, '0')}d </span>
		{/if}
		<span>{Math.abs(countdown.hours).toFixed().padStart(2, '0')}:</span>
		<span>{Math.abs(countdown.minutes).toFixed().padStart(2, '0')}:</span>
		<span>{Math.abs(countdown.seconds).toFixed().padStart(2, '0')}</span>
	</div>
</div>
