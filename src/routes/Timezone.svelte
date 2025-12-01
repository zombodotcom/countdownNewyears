<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';

	let { locale } = $props();
</script>

<div class="flex w-full grow flex-col rounded-4xl bg-black/20 p-5">
	<h2 class="text-2xl font-medium">
		{m.timezoneMap({}, { locale: locale as LanguageType })}
	</h2>

    <canvas>Canvas element not supported!</canvas>
</div>
