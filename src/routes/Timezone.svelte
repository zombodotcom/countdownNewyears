<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import {
		timezoneList,
		timezonePointList,
		makeCountdown,
		countdownValue,
		getOffsetTime
	} from '$lib';

	let { locale, target, now } = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();
	let backgroundImage: HTMLImageElement | undefined = $state();

	let sizeX = 0;
	let sizeY = 0;

	let value = $state(crypto.randomUUID());

	let interval: NodeJS.Timeout | undefined = $state(undefined);

	onMount(async () => {
		if (!browser) return;

		backgroundImage = new Image();
		backgroundImage.src = '/Blue_Marble_2002.png';

		await new Promise((resolve) => {
			backgroundImage?.addEventListener('load', () => {
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
				context.fillStyle = '#80808080';
				context.font = 'normal 20px serif';
				context.globalAlpha = 1;
				context.lineWidth = 2;
			}
		}).observe(canvas);

		interval = setInterval(() => {
			context?.drawImage(backgroundImage as HTMLImageElement, 0, 0, sizeX, sizeY);

			let i = 0;
			for (let pointList of timezonePointList) {
				if (pointList.length == 0) {
					i++;
					continue;
				}

				//context.fillStyle = `rgb(0, ${Math.random()*127}, ${Math.random()*127}, 40)`;

				context?.beginPath();
				context?.moveTo((sizeX * pointList[0].x) / 100, (sizeY * pointList[0].y) / 100);
				for (let point of pointList) {
					context?.lineTo((sizeX * point.x) / 100, (point.y * sizeY) / 100);
				}
				context?.stroke();

				let countdown = makeCountdown(
					new Date(getOffsetTime(timezoneList[i].hour, target, now)),
					now
				);

				if (countdown.total < 0) {
					(context as CanvasRenderingContext2D).fillStyle = '#00800080';
				} else if (countdown.hours === 0 && countdown.days === 0) {
					(context as CanvasRenderingContext2D).fillStyle = '#80800080';
				} else {
					(context as CanvasRenderingContext2D).fillStyle = '#80808080';
				}

				context?.fill();

				i++;
			}
		}, 40);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div
	class="flex max-h-full grow flex-col gap-2 rounded-4xl bg-black/20 shadow-lg max-lg:p-2 lg:p-5"
>
	<div class="flex w-full items-center max-lg:flex-col max-lg:gap-0 lg:flex-row lg:gap-2">
		<h2 class="font-medium text-nowrap max-lg:text-sm lg:text-2xl">
			{m.timezoneMap({}, { locale: locale as LanguageType })}
		</h2>
		<div class="grow max-lg:hidden"></div>
		<p
			class="max-w-full text-center text-sm leading-4 text-ellipsis max-lg:w-full max-lg:text-xs max-lg:text-nowrap lg:text-left"
		>
			{m.thisMapIsOnlyAnApproximationDueToTheComplexityOfTimezones(
				{},
				{ locale: locale as LanguageType }
			)}
		</p>
	</div>

	<canvas id={value} class="h-full w-full grow rounded-4xl border-2 border-white"
		>Canvas element not supported!</canvas
	>
</div>
