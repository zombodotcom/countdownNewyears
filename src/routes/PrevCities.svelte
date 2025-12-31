<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { countdownValue, timezoneList } from '$lib';
	import TimezoneItem from './items/TimezoneItem.svelte';

	let { locale, now, target } = $props();

	let timezones = $derived(
		timezoneList
			.filter((v) => {
				return countdownValue(v.hour, target, now) <= 0;
			})
			.sort((a, b) => a.hour - b.hour)
	);
</script>

<div class="flex h-full w-full flex-col gap-2">
	<h2 class="w-full text-center text-xl font-bold uppercase tracking-widest text-amber-500 border-b border-amber-500/20 pb-2 mb-2">
		{m.citiesAlreadyInTheNewYear({}, { locale: locale as LanguageType })}
	</h2>
	{#if timezones.length > 0}
		<div class="flex h-full flex-col gap-1 overflow-y-auto no-scrollbar">
			{#each timezones as timezone, i (i)}
				<TimezoneItem {timezone} {target} {now} reverse={true} />
			{/each}
		</div>
	{:else}
		<div class="flex w-full grow flex-col items-center justify-center text-center text-neutral-500">
			{m.noCitiesHaveGoneIntoTheNewYearYet({}, { locale: locale as LanguageType })}
		</div>
	{/if}
</div>
