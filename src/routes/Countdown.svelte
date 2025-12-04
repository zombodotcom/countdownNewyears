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
</script>

<div
	class="
	flex w-full flex-col gap-2 rounded-4xl bg-black/20 p-5 whitespace-nowrap
	{countdown.days > 360 ? 'text-neutral-500' : ''}
	{isDone ? 'text-amber-400' : ''}
"
>
	<div class="flex w-full gap-2 max-lg:flex-col lg:flex-row">
		<h2 class="font-medium max-lg:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
			{#if isCountdownToNewYear}
				{#if isDone}
					{m.theNewYearIsHere({}, { locale: locale as LanguageType })}
				{:else}
					{m.untilNewYearRemainingDotDotDot({}, { locale: locale as LanguageType })}
				{/if}
			{:else if isDone}
				{m.theCountdownHasEnded({}, { locale: locale as LanguageType })}
			{:else}
				{m.timeUntilCountdownFinishes({}, { locale: locale as LanguageType })}...
			{/if}
		</h2>
		<div class="grow"></div>
		<p class="max-lg:hidden">
			{now.getHours().toFixed().padStart(2, '0')}:{now.getMinutes().toFixed().padStart(2, '0')}:{now
				.getSeconds()
				.toFixed()
				.padStart(2, '0')}
			<span class={isDone ? 'text-amber-400!' : 'text-neutral-500'}
				>:{now.getMilliseconds().toFixed().padStart(3, '0')}</span
			>
			|
			{now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()}
		</p>
	</div>
	<!-- 38 = ~9.5rem  (40 = 10rem) -->
	<div
		class="m-0! flex flex-row items-center justify-center gap-0 p-0! font-bold
		max-lg:text-4xl max-lg:leading-12 lg:text-[6rem] lg:leading-18
		xl:text-[8rem] xl:leading-24 2xl:text-[10rem] 2xl:leading-30"
	>
		<div
			class="flex flex-col gap-0 {countdown.days > 0 ? '' : 'text-neutral-500'}  {isDone
				? 'text-amber-400!'
				: ''}"
		>
			<span class="">
				{Math.abs(countdown.days).toFixed().padStart(2, '0')}:
			</span>
			<span
				class="w-full text-center font-light max-lg:text-xs lg:text-base xl:text-xl 2xl:text-2xl"
			>
				{writeDays(countdown.days, locale)}
			</span>
		</div>

		<div
			class="flex flex-col gap-0 {countdown.hours > 0 ||
			(countdown.hours == 0 && countdown.days > 0)
				? ''
				: 'text-neutral-500'} {isDone ? 'text-amber-400!' : ''}"
		>
			<span class="">
				{Math.abs(countdown.hours).toFixed().padStart(2, '0')}:
			</span>
			<span
				class="w-full text-center font-light max-lg:text-xs lg:text-base xl:text-xl 2xl:text-2xl"
			>
				{writeHours(countdown.hours, locale)}
			</span>
		</div>

		<div class="flex flex-col gap-0">
			<span class="">
				{Math.abs(countdown.minutes).toFixed().padStart(2, '0')}:
			</span>
			<span
				class="w-full text-center font-light max-lg:text-xs lg:text-base xl:text-xl 2xl:text-2xl"
			>
				{writeMinutes(countdown.minutes, locale)}
			</span>
		</div>

		<div class="flex flex-col gap-0">
			<span class="">
				{Math.abs(countdown.seconds).toFixed().padStart(2, '0')}
			</span>
			<span
				class="w-full text-center font-light max-lg:text-xs lg:text-base xl:text-xl 2xl:text-2xl"
			>
				{writeSeconds(countdown.seconds, locale)}
			</span>
		</div>

		<div
			class="flex h-full flex-col gap-0 overflow-hidden
				max-xl:leading-8 max-lg:text-xl lg:text-[2rem] xl:text-[3rem]
				xl:leading-10 2xl:text-[4rem] 2xl:leading-12
			{isDone ? 'text-amber-400' : 'text-neutral-500'} "
		>
			<span class="flex flex-col overflow-hidden">
				:{Math.abs(countdown.milliseconds).toFixed().padStart(3, '0')}
				<span
					class="text-left max-lg:ps-2 lg:ps-4 {locale == 'hu'
						? 'max-lg:text-xs lg:text-sm 2xl:text-base'
						: 'max-lg:text-xs lg:text-sm xl:text-base 2xl:text-xl'} font-light"
				>
					{writeMilliseconds(countdown.milliseconds, locale)}
				</span>
				<div class="grow"></div>
			</span>
			<div class="grow"></div>
		</div>
	</div>
</div>
