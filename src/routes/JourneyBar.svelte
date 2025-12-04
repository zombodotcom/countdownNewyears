<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import JourneyBarMessage from './JourneyBarMessage.svelte';
	import { browser } from '$app/environment';
	import { error } from '@sveltejs/kit';

	let eventValue = $state(0);
	let eventInterval: NodeJS.Timeout | undefined = $state(undefined);

	let loco: HTMLImageElement | undefined = $state();
	let w1: HTMLImageElement | undefined = $state();
	let w2: HTMLImageElement | undefined = $state();
	let w3: HTMLImageElement | undefined = $state(); //restaurant

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();
	let sizeX = $state(0);
	let sizeY = $state(0);

	let value = $state(crypto.randomUUID());

	//TODO more effects
	//vehicle passing by, houses sprining up and lighting up their windows, couples on a walk?
	//release with just train effect, ask others for ideas?

	const eventIntervalFunction = () => {
		if (!context) throw error(500);

		context.strokeStyle = `#ffffff`;
		context.fillStyle = '#ffffff';
		context.globalAlpha = 1;
		context.lineWidth = 3;

		eventValue = 1;

		let x = 0;
		let wagons = [];
		let amount = Math.trunc(5 + Math.random() * 5);

		for (let w = 0; w < amount; w++) {
			wagons.push(Math.trunc(Math.random() * 3));
		}

		//all 275x75 px
		let i = setInterval(() => {
			context?.clearRect(0, 0, sizeX, sizeY);
			context?.drawImage(loco as HTMLImageElement, x, sizeY - 75);

			for (let w = 0; w < amount; w++) {
				switch (wagons[w]) {
					case 0:
						context?.drawImage(w1 as HTMLImageElement, x - (w + 1) * 275, sizeY - 75);
						break;
					case 1:
						context?.drawImage(w2 as HTMLImageElement, x - (w + 1) * 275, sizeY - 75);
						break;
					case 2:
						context?.drawImage(w3 as HTMLImageElement, x - (w + 1) * 275, sizeY - 75);
						break;
				}
			}

			x += 15;
			if (x - 200 - amount * 275 > sizeX) {
				clearInterval(i);
				eventValue = 0;
				setTimeout(eventIntervalFunction, 30000);
				return;
			}
		}, 40);
	};

	onMount(async () => {
		if (!journey) return;

		if (!browser) return;

		//TODO convert images to array
		loco = new Image();
		loco.src = '/journey/griffin.png';
		w1 = new Image();
		w1.src = '/journey/wagon1.png';
		w2 = new Image();
		w2.src = '/journey/wagon2.png';
		w3 = new Image();
		w3.src = '/journey/wagon3.png';

		await Promise.all([
			new Promise((resolve) => {
				loco?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				w1?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				w2?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				w3?.addEventListener('load', () => {
					resolve(0);
				});
			})
		]);

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

		eventInterval = setTimeout(eventIntervalFunction, 30000);
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
		{#if eventValue == 0}
			<JourneyBarMessage {locale} />
		{/if}
	{/key}

	<canvas id={value} class="absolute z-40 h-full w-full">Canvas not supported</canvas>
</div>
