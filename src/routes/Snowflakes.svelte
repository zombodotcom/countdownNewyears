<script lang="ts">
	import { browser } from '$app/environment';
	import { HARD_SNOWFLAKE_LIMIT } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	let {
		snowLimit
	}: {
		snowLimit: number;
	} = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();
	let snowflakeImage: HTMLImageElement | undefined = $state();

	let sizeX = 0;
	let sizeY = 0;

	let value = $state(crypto.randomUUID());

	let snowflakes: Map<
		number,
		{
			id: number;
			x: number;
			xSpeed: number;
			y: number;
			rotation: number;
			rotationSpeed: number;
			opacity: number;
		}
	> = $state(new Map());
	let snowflakeId = $state(0);

	let interval: NodeJS.Timeout | undefined = $state(undefined);
	let interval2: NodeJS.Timeout | undefined = $state(undefined);

	let calculatedSnowLimit = $derived(Math.min(HARD_SNOWFLAKE_LIMIT, snowLimit));

	onMount(async () => {
		if (!browser) return;
		if (calculatedSnowLimit === 0) return;

		snowflakeImage = new Image();
		snowflakeImage.src = '/snowflake-line.png';

		await new Promise((resolve) => {
			snowflakeImage?.addEventListener('load', () => {
				resolve(0);
			});
		});

		canvas = document.getElementById(value) as HTMLCanvasElement;
		context = canvas.getContext('2d') as CanvasRenderingContext2D;

		sizeX = canvas.getBoundingClientRect().width;
		sizeY = canvas.getBoundingClientRect().height;

		context.canvas.width = sizeX;
		context.canvas.height = sizeY;
		context.strokeStyle = `rgb(255, 255, 255, 127})`;
		context.lineWidth = 7;

		snowflakes.clear();
		snowflakeId = 0;

		new ResizeObserver(() => {
			context?.clearRect(0, 0, sizeX, sizeY);
			snowflakes.clear();
			snowflakeId = 0;

			sizeX = canvas?.getBoundingClientRect().width ?? 0;
			sizeY = canvas?.getBoundingClientRect().height ?? 0;
			if (context != null) {
				context.canvas.width = sizeX;
				context.canvas.height = sizeY;
				context.strokeStyle = `rgb(255, 255, 255, 127})`;
				context.lineWidth = 7;
			}
		}).observe(canvas);

		interval = setInterval(
			() => {
				if (snowflakes.size >= calculatedSnowLimit) return;

				//horizontal spawn or vertical?
				let val = Math.random() < sizeY / sizeX;
				let x = val ? -12 : Math.trunc(Math.random() * sizeX);
				let y = val ? Math.trunc(Math.random() * sizeY) : -12;

				const o = {
					id: snowflakeId,
					x: x,
					xSpeed: 1 + Math.random() * 2,
					y: y,
					rotation: Math.trunc(Math.random() * 360),
					rotationSpeed: (1 - Math.round(Math.random()) * 2) * 3,
					opacity: 0.3 + Math.random() / 3
				};

				snowflakes.set(snowflakeId, o);
				snowflakeId++;
			},
			calculatedSnowLimit / 5 + 25
		);

		interval2 = setInterval(() => {
			context?.clearRect(0, 0, sizeX, sizeY);

			snowflakes.forEach((value) => {
				value.x += value.xSpeed;
				value.y += 3;

				//randomization (vibration)
				value.x += Math.trunc(Math.random() * 2 - 1);

				value.rotation += value.rotationSpeed;

				if (
					value.x >= (context?.canvas.width ?? 0) + 12 ||
					value.y >= (context?.canvas.height ?? 0) + 12
				) {
					snowflakes.delete(value.id);
					return;
				} else {
					snowflakes.set(value.id, value);

					(context as CanvasRenderingContext2D).globalAlpha = value.opacity;
					context?.save();
					context?.translate(value.x - 12, value.y - 12);
					context?.rotate((Math.PI / 180) * value.rotation);
					context?.drawImage(snowflakeImage as HTMLImageElement, -12, -12, 24, 24);
					context?.restore();
				}
			});
			(context as CanvasRenderingContext2D).globalAlpha = 1;
		}, 50);
	});

	onDestroy(() => {
		clearInterval(interval);
		clearInterval(interval2);
	});
</script>

<canvas id={value} class="absolute z-9 h-screen w-screen opacity-70">
	Canvas element not supported!
</canvas>
