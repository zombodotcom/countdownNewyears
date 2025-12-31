<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { countdownValue, timezoneList } from '$lib';
	import TimezoneItem from './items/TimezoneItem.svelte';

	let { locale, now, target } = $props();

	let timezones = $derived(
		timezoneList.filter((v) => {
			return countdownValue(v.hour, target, now) > 0;
		})
	);
</script>

<div class="flex h-full w-full flex-col gap-2">
	<h2
		class="mb-2 w-full border-b border-white/10 pb-2 text-center text-xl font-bold tracking-widest text-neutral-400 uppercase"
	>
		{m.followingCities({}, { locale: locale as LanguageType })}
	</h2>
	{#if timezones.length > 0}
		<div class="no-scrollbar flex h-full flex-col gap-1 overflow-y-auto">
			{#each timezones as timezone, i (i)}
				<TimezoneItem {timezone} {target} {now} />
			{/each}
		</div>
	{:else}
		<div class="flex w-full grow flex-col items-center justify-center text-center text-neutral-500">
			{m.allCitiesAreAlreadyInTheNewYear({}, { locale: locale as LanguageType })}
		</div>
	{/if}
</div>
