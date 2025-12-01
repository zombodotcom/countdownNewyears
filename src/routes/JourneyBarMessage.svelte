<script lang="ts">
	import { m } from "$lib/paraglide/messages";
	import type { LanguageType } from "$lib/types";

	let { locale } = $props();
</script>

<div class="leading-20 font-great text-6xl justify-center items-center flex flex-row grow w-full">
	{m.merryChristmasAndAHappyNewYearExclamation({}, { locale: locale as LanguageType })}
</div>