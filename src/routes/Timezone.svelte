<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { timezonePointList } from '$lib';

	let { locale } = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();
	let backgroundImage: HTMLImageElement | undefined = $state();
	let timezoneMapImage: HTMLImageElement | undefined = $state();

	let sizeX = 0;
	let sizeY = 0;

	let value = $state(crypto.randomUUID());

	let interval: NodeJS.Timeout | undefined = $state(undefined);

	onMount(async () => {
		if (!browser) return;

		backgroundImage = new Image();
		backgroundImage.src = '/Blue_Marble_2002.png';

		await new Promise((resolve) => {
			backgroundImage?.addEventListener('load', (r) => {
				resolve(0);
			});
		});

		canvas = document.getElementById(value) as HTMLCanvasElement;
		context = canvas.getContext('2d') as CanvasRenderingContext2D;

		sizeX = Math.round(canvas.getBoundingClientRect().width);
		sizeY = Math.round(canvas.getBoundingClientRect().height);

		context.canvas.width = sizeX;
		context.canvas.height = sizeY;

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
				context.lineWidth = 2;
			}
		}).observe(canvas);

		interval = setInterval(() => {
			context?.drawImage(backgroundImage as HTMLImageElement, 0, 0, sizeX, sizeY);

			for(let pointList of timezonePointList) {
				context?.beginPath();
				context?.moveTo((sizeX*(pointList[0].x-2))/100, (sizeY*(pointList[0].y-2))/100);
				for(let point of pointList) {
					context?.lineTo((sizeX*(point.x-2))/100, ((point.y-2)*sizeY)/100);
				}
				context?.stroke();
			}1
		}, 40);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex max-h-full grow flex-col rounded-4xl bg-black/20 p-5">
	<h2 class="text-2xl font-medium">
		{m.timezoneMap({}, { locale: locale as LanguageType })}
	</h2>

	<canvas id={value} class="h-full w-full grow rounded-4xl border-2 border-white"
		>Canvas element not supported!</canvas
	>
</div>
