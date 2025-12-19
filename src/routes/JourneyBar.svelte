<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import JourneyBarMessage from './JourneyBarMessage.svelte';
	import { browser } from '$app/environment';
	import { error } from '@sveltejs/kit';

	//journey bar effects
	import { PKPEffect } from '$lib/effects/pkp';
	import { PendolinoEffect } from '$lib/effects/pendolino';
	import { type JBEffect, JB_EFFECT_FREQUENCY } from '$lib/effect';

	let eventValue = $state(-1);
	let eventInterval: NodeJS.Timeout | undefined = $state(undefined);

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();
	let sizeX = $state(0);
	let sizeY = $state(0);

	let value = $state(crypto.randomUUID());

	//effects
	let effects: JBEffect[] = $state([]);

	const eventIntervalFunction = async () => {
		if (!context) throw error(500);

		context.strokeStyle = `#ffffff`;
		context.fillStyle = '#ffffff';
		context.globalAlpha = 1;
		context.lineWidth = 3;

		eventValue = Math.trunc(Math.random() * effects.length);

		await effects[eventValue].predraw();
		await effects[eventValue].draw(context);

		eventValue = -1;
		setTimeout(eventIntervalFunction, JB_EFFECT_FREQUENCY);
	};

	onMount(async () => {
		if (!journey) return;

		if (!browser) return;

		effects.push(new PKPEffect());
		await effects[0].loadImages();

		effects.push(new PendolinoEffect());
		await effects[1].loadImages();

		canvas = document.getElementById(value) as HTMLCanvasElement;
		context = canvas.getContext('2d') as CanvasRenderingContext2D;

		sizeX = Math.round(canvas.getBoundingClientRect().width);
		sizeY = Math.round(canvas.getBoundingClientRect().height);

		context.canvas.width = sizeX;
		context.canvas.height = sizeY;
		context.strokeStyle = `#ffffff`;
		context.fillStyle = '#ffffff';
		context.globalAlpha = 1;
		context.lineWidth = 3;

		new ResizeObserver(() => {
			context?.clearRect(0, 0, sizeX, sizeY);

			sizeX = Math.round(canvas?.getBoundingClientRect().width ?? 0);
			sizeY = Math.round(canvas?.getBoundingClientRect().height ?? 0);
			if (context != null) {
				context.canvas.width = sizeX;
				context.canvas.height = sizeY;
				context.strokeStyle = `#ffffff`;
				context.fillStyle = '#ffffff';
				context.globalAlpha = 1;
				context.lineWidth = 3;
			}
		}).observe(canvas);

		eventInterval = setTimeout(eventIntervalFunction, JB_EFFECT_FREQUENCY);
	});
	onDestroy(() => {
		clearTimeout(eventInterval);
	});

	let { locale, journey } = $props();
</script>

<div
	class="relative flex w-full grow flex-row items-center justify-center gap-2 rounded-t-4xl bg-black/20 p-5 max-lg:min-h-10 lg:min-h-20"
>
	{#key eventValue}
		{#if eventValue == -1}
			<JourneyBarMessage {locale} />
		{/if}
	{/key}

	<canvas id={value} class="absolute z-40 h-full w-full">Canvas not supported</canvas>
</div>
