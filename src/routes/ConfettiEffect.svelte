<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';

	let {
		active = $bindable(false)
	}: {
		active: boolean;
	} = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | undefined = $state();

	let sizeX = 0;
	let sizeY = 0;

	let value = $state(crypto.randomUUID());

	// Confetti particles
	let confettiParticles: Map<
		number,
		{
			id: number;
			x: number;
			y: number;
			vx: number;
			vy: number;
			rotation: number;
			rotationSpeed: number;
			color: string;
			size: number;
			opacity: number;
			shape: 'circle' | 'square' | 'triangle';
		}
	> = $state(new Map());
	let confettiId = $state(0);

	// Fireworks
	let fireworks: Map<
		number,
		{
			id: number;
			x: number;
			y: number;
			particles: Array<{
				x: number;
				y: number;
				vx: number;
				vy: number;
				color: string;
				life: number;
			}>;
			life: number;
		}
	> = $state(new Map());
	let fireworkId = $state(0);

	let animationFrame: number | undefined = $state(undefined);
	let lastFireworkTime = $state(0);
	let lastConfettiTime = $state(0);

	const confettiColors = [
		'#FFD700', // Gold
		'#FF6B6B', // Red
		'#4ECDC4', // Cyan
		'#45B7D1', // Blue
		'#FFA07A', // Light Salmon
		'#98D8C8', // Mint
		'#F7DC6F', // Yellow
		'#BB8FCE', // Purple
		'#85C1E2', // Sky Blue
		'#F8B739' // Orange
	];

	const createConfetti = () => {
		const count = 15;
		for (let i = 0; i < count; i++) {
			const x = Math.random() * sizeX;
			const y = -10;
			const vx = (Math.random() - 0.5) * 4;
			const vy = 2 + Math.random() * 4;
			const rotation = Math.random() * 360;
			const rotationSpeed = (Math.random() - 0.5) * 10;
			const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
			const size = 4 + Math.random() * 6;
			const opacity = 0.7 + Math.random() * 0.3;
			const shape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as
				| 'circle'
				| 'square'
				| 'triangle';

			confettiParticles.set(confettiId, {
				id: confettiId,
				x,
				y,
				vx,
				vy,
				rotation,
				rotationSpeed,
				color,
				size,
				opacity,
				shape
			});
			confettiId++;
		}
	};

	const createFirework = (x: number, y: number) => {
		const particleCount = 30;
		const particles: Array<{
			x: number;
			y: number;
			vx: number;
			vy: number;
			color: string;
			life: number;
		}> = [];

		for (let i = 0; i < particleCount; i++) {
			const angle = (Math.PI * 2 * i) / particleCount;
			const speed = 2 + Math.random() * 4;
			const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

			particles.push({
				x: 0,
				y: 0,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				color,
				life: 1.0
			});
		}

		fireworks.set(fireworkId, {
			id: fireworkId,
			x,
			y,
			particles,
			life: 1.0
		});
		fireworkId++;
	};

	const drawConfetti = (particle: {
		x: number;
		y: number;
		rotation: number;
		color: string;
		size: number;
		opacity: number;
		shape: 'circle' | 'square' | 'triangle';
	}) => {
		if (!context) return;

		context.save();
		context.globalAlpha = particle.opacity;
		context.fillStyle = particle.color;
		context.translate(particle.x, particle.y);
		context.rotate((Math.PI / 180) * particle.rotation);

		if (particle.shape === 'circle') {
			context.beginPath();
			context.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
			context.fill();
		} else if (particle.shape === 'square') {
			context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
		} else if (particle.shape === 'triangle') {
			context.beginPath();
			context.moveTo(0, -particle.size / 2);
			context.lineTo(-particle.size / 2, particle.size / 2);
			context.lineTo(particle.size / 2, particle.size / 2);
			context.closePath();
			context.fill();
		}

		context.restore();
	};

	const animate = () => {
		if (!context || !active) return;

		// Clear with slight fade for trail effect
		context.fillStyle = 'rgba(0, 0, 0, 0.1)';
		context.fillRect(0, 0, sizeX, sizeY);

		const now = Date.now();

		// Create new confetti periodically
		if (active && now - lastConfettiTime > 200) {
			createConfetti();
			lastConfettiTime = now;
		}

		// Create fireworks periodically
		if (active && now - lastFireworkTime > 800) {
			const x = sizeX * 0.2 + Math.random() * sizeX * 0.6;
			const y = sizeY * 0.2 + Math.random() * sizeY * 0.3;
			createFirework(x, y);
			lastFireworkTime = now;
		}

		// Update and draw confetti
		confettiParticles.forEach((particle) => {
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += 0.2; // Gravity
			particle.rotation += particle.rotationSpeed;
			particle.vx *= 0.99; // Air resistance

			if (
				particle.y > sizeY + 20 ||
				particle.x < -20 ||
				particle.x > sizeX + 20 ||
				particle.opacity <= 0
			) {
				confettiParticles.delete(particle.id);
			} else {
				drawConfetti(particle);
			}
		});

		// Update and draw fireworks
		fireworks.forEach((firework) => {
			firework.life -= 0.02;
			if (firework.life <= 0) {
				fireworks.delete(firework.id);
				return;
			}

			firework.particles.forEach((particle) => {
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.vy += 0.15; // Gravity
				particle.vx *= 0.98; // Air resistance
				particle.life = firework.life;

				if (context) {
					context.save();
					context.globalAlpha = particle.life;
					context.fillStyle = particle.color;
					context.beginPath();
					context.arc(
						firework.x + particle.x,
						firework.y + particle.y,
						3,
						0,
						Math.PI * 2
					);
					context.fill();
					context.restore();
				}
			});
		});

		animationFrame = requestAnimationFrame(animate);
	};

	onMount(async () => {
		if (!browser) return;

		canvas = document.getElementById(value) as HTMLCanvasElement;
		context = canvas.getContext('2d') as CanvasRenderingContext2D;

		sizeX = canvas.getBoundingClientRect().width;
		sizeY = canvas.getBoundingClientRect().height;

		context.canvas.width = sizeX;
		context.canvas.height = sizeY;

		new ResizeObserver(() => {
			sizeX = canvas?.getBoundingClientRect().width ?? 0;
			sizeY = canvas?.getBoundingClientRect().height ?? 0;
			if (context != null) {
				context.canvas.width = sizeX;
				context.canvas.height = sizeY;
			}
		}).observe(canvas);

		if (active) {
			animationFrame = requestAnimationFrame(animate);
		}
	});

	$effect(() => {
		if (active && context && !animationFrame) {
			animationFrame = requestAnimationFrame(animate);
		} else if (!active && animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = undefined;
			if (context) {
				context.clearRect(0, 0, sizeX, sizeY);
			}
		}
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<canvas id={value} class="absolute z-8 h-screen w-screen pointer-events-none">
	Canvas element not supported!
</canvas>

