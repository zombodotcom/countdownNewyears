<script lang="ts">
	import type { TimezoneType } from '$lib/types';
	import { makeCountdown } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	let {
		timezone,
		target,
		now,
		reverse = false
	}: { timezone: TimezoneType; target: Date; now: Date; reverse?: boolean | undefined } = $props();

	let countdown = $derived(
		makeCountdown(
			new Date(target.getTime() - (timezone.hour + now.getTimezoneOffset() / 60) * 3600000),
			now
		)
	);

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

		updateMainIndex();
		updateAuxIndex();
	});
	onDestroy(() => {
		clearInterval(mainInterval);
		clearInterval(auxInterval);
	});
</script>

<span
	class="flex max-h-6 min-h-6 w-full max-w-full min-w-0! flex-row items-center gap-2 overflow-hidden! **:overflow-hidden **:text-nowrap"
>
	<span class="overflow-none! flex flex-row gap-0">
		<span class={!reverse && countdown.days > 0 ? '' : 'text-neutral-500'}>
			{Math.abs(countdown.days).toFixed().padStart(2, '0')}:
		</span><span
			class={!reverse && (countdown.hours > 0 || (countdown.hours == 0 && countdown.days > 0))
				? ''
				: 'text-neutral-500'}
		>
			{Math.abs(countdown.hours).toFixed().padStart(2, '0')}:
		</span><span>
			{Math.abs(countdown.minutes).toFixed().padStart(2, '0')}:
		</span><span>
			{Math.abs(countdown.seconds).toFixed().padStart(2, '0')}
		</span>
	</span>

	<span class="{auxCity.length > 0 ? '' : 'overflow-hidden! text-ellipsis'} text-xl font-medium">
		{mainCity}
	</span>
	<span class="overflow-hidden! text-ellipsis">
		{auxCity}
	</span>
</span>
