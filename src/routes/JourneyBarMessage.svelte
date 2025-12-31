<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { fade } from 'svelte/transition';

	let { locale, now } = $props();

	let is2026 = $derived(now.getFullYear() === 2026);
	let messageKey = $derived(
		is2026 ? 'happyNewYear2026' : 'merryChristmasAndAHappyNewYearExclamation'
	);
</script>

<div
	class="flex w-full grow flex-row items-center justify-center text-center font-great text-nowrap max-lg:text-2xl max-lg:leading-8 lg:text-6xl lg:leading-20"
	transition:fade|global={{ duration: 250 }}
>
	{m[messageKey]({}, { locale: locale as LanguageType })}
</div>
