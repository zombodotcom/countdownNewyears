<script lang="ts">
    import { m } from "$lib/paraglide/messages";
	import type { LanguageType } from "$lib/types";
	import { timezoneList } from "$lib";
	import TimezoneItem from "./items/TimezoneItem.svelte";

    let { locale, now, target } = $props();

	let timezones = $state(timezoneList.filter((v) => {
		return ((target.getTime() - (v.hour+(now.getTimezoneOffset()/60)) * 3600000) - now.getTime()) > 0;
	}));
</script>

<div class="gap-4 flex flex-col grow min-w-1/5 w-1/5 max-w-1/5 rounded-4xl bg-black/20 p-5">
    <h2 class="text-2xl font-medium text-center w-full">{m.followingCities({}, { locale: locale as LanguageType})}</h2>
	{#if timezones.length > 0}
	<div class="grow flex flex-col gap-2 flex-nowrap max-h-[calc(100vh-172px)] overflow-scroll">
		{#each timezones as timezone, i (i)}
			<TimezoneItem {timezone} {target} {now}/>
		{/each}
	</div>
	{:else}
	<div class="flex flex-col grow justify-center items-center w-full text-center">
		{m.allCitiesAreAlreadyInTheNewYear({}, { locale: locale as LanguageType })}
	</div>
	{/if}
</div>