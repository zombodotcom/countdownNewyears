<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import {
		writeDays,
		writeHours,
		writeMilliseconds,
		writeMinutes,
		writeSeconds,
		makeCountdown
	} from '$lib';

	let {
		target,
		locale,
		now,
		isDone
	}: { target: Date; locale: string; now: Date; isDone: boolean } = $props();

	let countdown = $derived(makeCountdown(target, now));
	let isCountdownToNewYear = $derived(
		target.getTime() == new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime()
	);
	let is2026 = $derived(now.getFullYear() === 2026);
	let isAlmostThere = $derived(
		isCountdownToNewYear &&
			!isDone &&
			countdown.days === 0 &&
			countdown.hours === 0 &&
			countdown.minutes < 60
	);
	let isFinalMinute = $derived(
		isCountdownToNewYear &&
			!isDone &&
			countdown.days === 0 &&
			countdown.hours === 0 &&
			countdown.minutes === 0 &&
			countdown.seconds < 60
	);
	let isFinalSeconds = $derived(
		isCountdownToNewYear &&
			!isDone &&
			countdown.days === 0 &&
			countdown.hours === 0 &&
			countdown.minutes === 0 &&
			countdown.seconds < 10
	);
</script>

<div
	class="
	flex w-full flex-col gap-2 rounded-4xl bg-black/40 p-6 whitespace-nowrap shadow-2xl backdrop-blur-md transition-all duration-300
	{isDone ? 'text-amber-400! shadow-[0_0_40px_rgba(251,191,36,0.4)]' : 'text-white'}
	border border-white/10
"
>
	<div class="flex w-full items-center justify-between px-4">
		<h2 class="text-xl font-bold tracking-widest uppercase xl:text-2xl 2xl:text-3xl">
			{#if isCountdownToNewYear}
				{#if isDone}
					{#if is2026}
						{m.happyNewYear2026({}, { locale: locale as LanguageType })}
					{:else}
						{m.theNewYearIsHere({}, { locale: locale as LanguageType })}
					{/if}
				{:else if isAlmostThere}
					{m.almostThere({}, { locale: locale as LanguageType })}
				{:else}
					{m.untilNewYearRemainingDotDotDot({}, { locale: locale as LanguageType })}
				{/if}
			{:else if isDone}
				{m.theCountdownHasEnded({}, { locale: locale as LanguageType })}
			{:else}
				{m.timeUntilCountdownFinishes({}, { locale: locale as LanguageType })}...
			{/if}
		</h2>
		<p class="font-mono text-xl text-neutral-500 xl:text-2xl">
			{now.getHours().toFixed().padStart(2, '0')}:{now.getMinutes().toFixed().padStart(2, '0')}:{now
				.getSeconds()
				.toFixed()
				.padStart(2, '0')}
			<span class="text-neutral-700">
				| {now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()}
			</span>
		</p>
	</div>

	<div
		class="flex flex-row items-baseline justify-center gap-4 text-[4rem] leading-none font-black
		transition-all duration-300 xl:text-[5.5rem] 2xl:text-[7rem]
		{isFinalSeconds ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]' : ''}
		{isDone ? 'text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]' : ''}"
	>
		<div class="flex flex-col items-center">
			<span>{Math.abs(countdown.days).toFixed().padStart(2, '0')}</span>
			<span class="text-base font-light tracking-widest text-neutral-500 uppercase xl:text-lg">
				{writeDays(countdown.days, locale)}
			</span>
		</div>
		<span class="text-neutral-700">:</span>
		<div class="flex flex-col items-center">
			<span>{Math.abs(countdown.hours).toFixed().padStart(2, '0')}</span>
			<span class="text-base font-light tracking-widest text-neutral-500 uppercase xl:text-lg">
				{writeHours(countdown.hours, locale)}
			</span>
		</div>
		<span class="text-neutral-700">:</span>
		<div class="flex flex-col items-center">
			<span>{Math.abs(countdown.minutes).toFixed().padStart(2, '0')}</span>
			<span class="text-base font-light tracking-widest text-neutral-500 uppercase xl:text-lg">
				{writeMinutes(countdown.minutes, locale)}
			</span>
		</div>
		<span class="text-neutral-700">:</span>
		<div class="flex flex-col items-center">
			<span>{Math.abs(countdown.seconds).toFixed().padStart(2, '0')}</span>
			<span class="text-base font-light tracking-widest text-neutral-500 uppercase xl:text-lg">
				{writeSeconds(countdown.seconds, locale)}
			</span>
		</div>

		<div class="ms-4 flex flex-col items-start">
			<span class="text-[1.5rem] text-neutral-600 xl:text-[2.5rem] 2xl:text-[3.5rem]">
				:{Math.abs(countdown.milliseconds).toFixed().padStart(3, '0')}
			</span>
			<span class="text-xs font-light tracking-widest text-neutral-700 uppercase xl:text-sm">
				{writeMilliseconds(countdown.milliseconds, locale)}
			</span>
		</div>
	</div>
</div>
