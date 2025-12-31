<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { fade, scale } from 'svelte/transition';

	let { locale, is2026, isDone } = $props();
</script>

{#if is2026 && isDone}
	<div
		class="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
		transition:fade={{ duration: 500 }}
	>
		<div
			class="flex flex-col items-center justify-center gap-4"
			transition:scale={{ duration: 800, start: 0.5 }}
		>
			<div
				class="animate-pulse text-center font-bold drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]
					max-lg:text-6xl max-lg:leading-tight
					lg:text-8xl lg:leading-tight
					xl:text-9xl xl:leading-tight
					2xl:text-[12rem] 2xl:leading-tight"
				style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;"
			>
				2026
			</div>
			<div
				class="text-center font-medium
					max-lg:text-2xl max-lg:leading-tight
					lg:text-4xl lg:leading-tight
					xl:text-5xl xl:leading-tight
					2xl:text-6xl 2xl:leading-tight"
				style="color: #FFD700; text-shadow: 0 0 20px rgba(255,215,0,0.8);"
			>
				{m.happyNewYear2026({}, { locale: locale as LanguageType })}
			</div>
		</div>
	</div>
{/if}
