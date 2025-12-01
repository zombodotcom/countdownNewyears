<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';

	let { link, locale, switchedToHandel } = $props();
</script>

<div class="flex h-fit w-full flex-col gap-2 rounded-4xl bg-black/20 p-5">
	<h2
		class="w-full overflow-x-scroll overflow-y-hidden text-2xl font-medium text-nowrap text-ellipsis whitespace-nowrap"
	>
		{m.musicPlayer({}, { locale: locale as LanguageType })}
	</h2>

	{#if switchedToHandel}
		<div>
			
		</div>
	{:else}
		<iframe
			class=""
			src={link}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	{/if}
</div>
