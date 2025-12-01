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

	//TODO fix for different canvases
	onMount(() => {
		if (!browser) return;

		canvas = document.getElementById(value) as HTMLCanvasElement;
		let context = canvas.getContext('2d') as CanvasRenderingContext2D;

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
			//background

			context?.clearRect(0, 0, sizeX, sizeY);
			context.strokeStyle = `#ffffff`;

			context.beginPath();

			context.lineWidth = 3;

			if (minSizeAxis == 'x') {
				context.arc(minSize / 2, maxSize / 2, minSize / 2 - 5, 0, 2 * Math.PI);
			} else {
				context.arc(maxSize / 2, minSize / 2, minSize / 2 - 5, 0, 2 * Math.PI);
			}

			context.stroke();
			context.closePath();

			if (ms) {
				//milliseconds hand (green)
				context.lineWidth = 2;
				context.strokeStyle = `#006000`;
				context.beginPath();

				context.moveTo(minSize / 2 + (maxSize - minSize) / 2, minSize / 2);
				context.lineTo(
					minSize / 2 +
						(maxSize - minSize) / 2 +
						Math.cos((now.getTime() / 1000 - 0.25) * Math.PI * 2) * (minSize / 2 - 5),
					minSize / 2 + Math.sin((now.getTime() / 1000 - 0.25) * Math.PI * 2) * (minSize / 2 - 5)
				);

				context.stroke();
				context.closePath();
			}

			//hand hours
			context.lineWidth = 10;
			context.strokeStyle = `#dddddd`;
			context.beginPath();

			context.moveTo(minSize / 2 + (maxSize - minSize) / 2, minSize / 2);
			context.lineTo(
				minSize / 2 +
					(maxSize - minSize) / 2 +
					Math.cos(
						((now.getTime() -
							new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
							(12 * 60 * 60 * 1000) -
							0.25) *
							Math.PI *
							2
					) *
						(minSize / 2 - 5),
				minSize / 2 +
					Math.sin(
						((now.getTime() -
							new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
							(12 * 60 * 60 * 1000) -
							0.25) *
							Math.PI *
							2
					) *
						(minSize / 2 - 5)
			);

			context.stroke();
			context.closePath();

			//hand minutes
			context.lineWidth = 7;
			context.strokeStyle = `#dddddd`;
			context.beginPath();

			context.moveTo(minSize / 2 + (maxSize - minSize) / 2, minSize / 2);
			context.lineTo(
				minSize / 2 +
					(maxSize - minSize) / 2 +
					Math.cos((now.getTime() / (60 * 60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 5),
				minSize / 2 +
					Math.sin((now.getTime() / (60 * 60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 5)
			);

			context.stroke();
			context.closePath();

			//hand seconds (red)
			context.lineWidth = 4;
			context.strokeStyle = `#800000`;
			context.beginPath();

			context.moveTo(minSize / 2 + (maxSize - minSize) / 2, minSize / 2);
			context.lineTo(
				minSize / 2 +
					(maxSize - minSize) / 2 +
					Math.cos((now.getTime() / (60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 5),
				minSize / 2 +
					Math.sin((now.getTime() / (60 * 1000) - 0.25) * Math.PI * 2) * (minSize / 2 - 5)
			);

			context.stroke();
			context.closePath();

			context.beginPath();

			context.lineWidth = 10;
			context.strokeStyle = `#ffffff`;

			context.arc(maxSize / 2, minSize / 2, 10, 0, 2 * Math.PI);

			context.fill();
			context.closePath();
		}, 40);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex w-full grow flex-col rounded-4xl bg-black/20 p-5">
	<h2 class="text-2xl font-medium">{m.clock({}, { locale: locale as LanguageType })}</h2>

	<div class="relative z-24 flex w-full grow flex-col opacity-100">
		<canvas id={value} class="absolute z-25 h-full w-full opacity-100"
			>Canvas element not supported!</canvas
		>
	</div>
</div>
