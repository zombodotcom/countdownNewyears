<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { onMount } from 'svelte';

	let { link, locale, switchedToHandel } = $props();

	let handel: HTMLAudioElement | undefined = $state();
	let handelVolume: number = $state(0);

	$effect(() => {
		if (handelVolume > 0) {
			(handel as HTMLAudioElement).muted = false;
		}
	});
</script>

<div class="flex w-full flex-col gap-2 rounded-4xl bg-black/20 p-5">
	<h2
		class="w-full font-medium text-nowrap text-ellipsis whitespace-nowrap max-lg:text-base lg:text-2xl"
	>
		{m.musicPlayer({}, { locale: locale as LanguageType })}
	</h2>

	{#if link.length == 0}
		<div class="flex w-full grow flex-col items-center justify-center text-center">
			{m.noMusicPlayerAvailable({}, { locale: locale as LanguageType })}
		</div>
	{:else if switchedToHandel}
		<div class="flex w-full grow flex-col gap-2 text-center">
			<span class="font-medium">
				{m.playingHandelsMusicForRoyalFireworks({}, { locale: locale as LanguageType })}
			</span>

			<div class="flex flex-col gap-2">
				<label for="handleVolume">{m.volumeControl({}, { locale: locale as LanguageType })}:</label>
				<div class="flex flex-row gap-2">
					<input
						name="handelVolume"
						type="range"
						min="0"
						max="1"
						step="0.01"
						bind:value={handelVolume}
						class="range-input grow"
					/>
					<button
						onclick={() => {
							handelVolume = 1;
						}}
						class="rounded-2xl border-2 border-white p-2 text-center hover:border-neutral-500! hover:text-neutral-500!"
						>100%</button
					>
				</div>
			</div>
		</div>
	{:else}
		<iframe
			class="h-full w-full"
			src={link}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
		></iframe>
	{/if}

	<audio
		bind:this={handel}
		src="/musopenHandel.mp3"
		autoplay
		muted
		preload="auto"
		bind:volume={handelVolume}
	></audio>
</div>
