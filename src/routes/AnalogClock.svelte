<script lang="ts">
	import { browser } from '$app/environment';
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';

	let { locale, now, ms } = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();

	let sizeX = 0;
	let sizeY = 0;
	let minSize = 0;
	let maxSize = 0;
	let minSizeAxis = 'y';

	let value = $state(crypto.randomUUID());

	let interval: NodeJS.Timeout | undefined = $state(undefined);

	onMount(() => {
		if (!browser) return;

		canvas = document.getElementById(value) as HTMLCanvasElement;
		context = canvas.getContext('2d') as CanvasRenderingContext2D;

		sizeX = Math.round(canvas.getBoundingClientRect().width);
		sizeY = Math.round(canvas.getBoundingClientRect().height);

		context.canvas.width = sizeX;
		context.canvas.height = sizeY;

		minSize = Math.min(sizeX, sizeY);
		maxSize = Math.max(sizeX, sizeY);
		minSizeAxis = sizeX < sizeY ? 'x' : 'y';
		context.strokeStyle = `#ffffff`;
		context.fillStyle = '#ffffff';
		context.globalAlpha = 1;

		new ResizeObserver(() => {
			context?.clearRect(0, 0, sizeX, sizeY);

			sizeX = Math.round(canvas?.getBoundingClientRect().width ?? 0);
			sizeY = Math.round(canvas?.getBoundingClientRect().height ?? 0);
			if (context != null) {
				context.canvas.width = sizeX;
				context.canvas.height = sizeY;

				minSize = Math.min(sizeX, sizeY);
				maxSize = Math.max(sizeX, sizeY);
				minSizeAxis = sizeX < sizeY ? 'x' : 'y';
				context.strokeStyle = `#ffffff`;
				context.fillStyle = '#ffffff';
				context.globalAlpha = 1;
			}
		}).observe(canvas);

		interval = setInterval(() => {
			//vars
			let xStart, yStart;

			if (minSizeAxis == 'x') {
				xStart = minSize / 2;
				yStart = maxSize / 2;
			} else {
				xStart = maxSize / 2;
				yStart = minSize / 2;
			}

			//background

			context?.clearRect(0, 0, sizeX, sizeY);
			(context as CanvasRenderingContext2D).strokeStyle = `#ffffff`;

			context?.beginPath();

			(context as CanvasRenderingContext2D).lineWidth = 3;

			context?.arc(xStart, yStart, minSize / 2 - 3, 0, 2 * Math.PI);

			context?.stroke();
			context?.closePath();

			if (ms) {
				//milliseconds hand (green)
				(context as CanvasRenderingContext2D).lineWidth = 2;
				(context as CanvasRenderingContext2D).strokeStyle = `#006000`;
				context?.beginPath();

				context?.moveTo(xStart, yStart);

				let msGoalX =
					xStart + Math.cos((now.getTime() / 1000 - 0.25) * Math.PI * 2) * (minSize / 2 - 3);
				let msGoalY =
					yStart + Math.sin((now.getTime() / 1000 - 0.25) * Math.PI * 2) * (minSize / 2 - 3);

				context?.lineTo(msGoalX, msGoalY);

				context?.stroke();
				context?.closePath();
			}

			//hand hours
			(context as CanvasRenderingContext2D).lineWidth = 10;
			(context as CanvasRenderingContext2D).strokeStyle = `#dddddd`;
			context?.beginPath();

			let hoursX =
				xStart +
				Math.cos(
					((now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
						(12 * 60 * 60 * 1000) -
						0.25) *
						Math.PI *
						2
				) *
					(minSize / 2 - 3);
			let hoursY =
				yStart +
				Math.sin(
					((now.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
						(12 * 60 * 60 * 1000) -
						0.25) *
						Math.PI *
						2
				) *
					(minSize / 2 - 3);

			context?.moveTo(xStart, yStart);

			context?.lineTo(hoursX, hoursY);

			context?.stroke();
			context?.closePath();

			//hand minutes
			(context as CanvasRenderingContext2D).lineWidth = 7;
			(context as CanvasRenderingContext2D).strokeStyle = `#dddddd`;
			context?.beginPath();

			let minutesX =
				xStart +
				Math.cos((now.getTime() / (60 * 60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 3);
			let minutesY =
				yStart +
				Math.sin((now.getTime() / (60 * 60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 3);

			context?.moveTo(xStart, yStart);

			context?.lineTo(minutesX, minutesY);

			context?.stroke();
			context?.closePath();

			//hand seconds (red)
			(context as CanvasRenderingContext2D).lineWidth = 4;
			(context as CanvasRenderingContext2D).strokeStyle = `#800000`;
			context?.beginPath();

			let secondsX =
				xStart + Math.cos((now.getTime() / (60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 3);
			let secondsY =
				yStart + Math.sin((now.getTime() / (60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 3);

			context?.moveTo(xStart, yStart);

			context?.lineTo(secondsX, secondsY);

			context?.stroke();
			context?.closePath();

			context?.beginPath();

			(context as CanvasRenderingContext2D).lineWidth = 10;
			(context as CanvasRenderingContext2D).strokeStyle = `#ffffff`;

			context?.arc(xStart, yStart, 10, 0, 2 * Math.PI);

			context?.fill();
			context?.closePath();
		}, 40);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex grow flex-col overflow-hidden rounded-4xl bg-black/20 p-5 max-lg:hidden">
	<h2 class="text-2xl font-medium">{m.clock({}, { locale: locale as LanguageType })}</h2>

	<div class="relative z-24 h-full w-full grow">
		<canvas id={value} class="absolute z-25 h-full w-full">Canvas not supported!</canvas>
	</div>
</div>
