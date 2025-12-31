<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { countdownValue, timezoneList } from '$lib';
	import TimezoneItem from './items/TimezoneItem.svelte';

	let { locale, now, target } = $props();

	let timezones = $state(
		timezoneList
			.filter((v) => {
				return countdownValue(v.hour, target, now) <= 0;
			})
			.sort((a, b) => a.hour - b.hour)
	);
</script>

<div class="flex h-full w-full grow flex-col gap-4 rounded-4xl bg-black/20 p-5 shadow-lg">
	<h2
		class="w-full text-center {locale == 'de' || locale == 'cs'
			? 'text-xl'
			: 'text-2xl'} leading-8 font-medium"
	>
		{m.citiesAlreadyInTheNewYear({}, { locale: locale as LanguageType })}
	</h2>
	{#if timezones.length > 0}
		<div class="flex h-full max-h-full min-h-0 grow flex-col flex-nowrap gap-0 overflow-scroll!">
			{#each timezones as timezone, i (i)}
				<TimezoneItem {timezone} {target} {now} reverse={true} />
			{/each}
		</div>
	{:else}
		<div class="flex w-full grow flex-col items-center justify-center text-center">
			{m.noCitiesHaveGoneIntoTheNewYearYet({}, { locale: locale as LanguageType })}
		</div>
	{/if}
</div>
