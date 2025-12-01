<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { timezoneList } from '$lib';
	import TimezoneItem from './items/TimezoneItem.svelte';

	let { locale, now, target, clicked } = $props();

	let timezones = $state(
		timezoneList.filter((v) => {
			return (
				target.getTime() - (v.hour + now.getTimezoneOffset() / 60) * 3600000 - now.getTime() > 0
			);
		})
	);
</script>

<div class="flex w-1/5 max-w-1/5 min-w-1/5 grow flex-col gap-4 rounded-4xl bg-black/20 p-5 overflow-scroll! **:overflow-scroll">
    <h2 class="w-full text-center text-2xl font-medium shrink-0">
        {m.followingCities({}, { locale: locale as LanguageType })}
    </h2>
    {#if timezones.length > 0}
        <div class="flex min-h-0 grow flex-col flex-nowrap gap-0">
            {#each timezones as timezone, i (i)}
                <TimezoneItem {timezone} {target} {now} />
            {/each}
        </div>
    {:else}
        <div class="flex w-full grow flex-col items-center justify-center text-center">
            {m.allCitiesAreAlreadyInTheNewYear({}, { locale: locale as LanguageType })}
        </div>
    {/if}
</div>
