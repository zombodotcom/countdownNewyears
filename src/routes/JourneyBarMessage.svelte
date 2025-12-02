<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { fade } from 'svelte/transition';

	let { locale } = $props();
</script>

<div
	class="flex w-full grow flex-row items-center justify-center font-great text-6xl leading-20"
	transition:fade|global={{ duration: 250 }}
>
	{m.merryChristmasAndAHappyNewYearExclamation({}, { locale: locale as LanguageType })}
</div>
