<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { timezoneList, makeCountdown, getOffsetTime } from '$lib';
	import type { TimezoneType } from '$lib/types';
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { cityCoords } from '$lib/cityCoords';

	let { locale, target, now } = $props();

	let container: HTMLDivElement | undefined = $state();
	let globe: any = $state();
	
	interface CityPoint {
		lat: number;
		lng: number;
		size: number;
		color: string;
		label: string;
		altitude: number;
	}

	interface Arc {
		startLat: number;
		startLng: number;
		endLat: number;
		endLng: number;
		color: string[];
		stroke: number;
	}

	let pointsData: CityPoint[] = $state([]);
	let arcsData: Arc[] = $state([]);

	// Particle Firework System
	class FireworkSystem {
		scene: THREE.Scene;
		bursts: any[] = [];
		
		constructor(scene: THREE.Scene) {
			this.scene = scene;
		}

		createBurst(position: THREE.Vector3, color: string) {
			const particleCount = 100;
			const geometry = new THREE.BufferGeometry();
			const positions = new Float32Array(particleCount * 3);
			const velocities = new Float32Array(particleCount * 3);
			const colors = new Float32Array(particleCount * 3);
			const sizes = new Float32Array(particleCount);

			const threeColor = new THREE.Color(color);

			for (let i = 0; i < particleCount; i++) {
				positions[i * 3] = position.x;
				positions[i * 3 + 1] = position.y;
				positions[i * 3 + 2] = position.z;

				const theta = Math.random() * Math.PI * 2;
				const phi = Math.random() * Math.PI;
				const speed = 0.01 + Math.random() * 0.02;

				velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
				velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
				velocities[i * 3 + 2] = Math.cos(phi) * speed;

				colors[i * 3] = threeColor.r;
				colors[i * 3 + 1] = threeColor.g;
				colors[i * 3 + 2] = threeColor.b;

				sizes[i] = 2.0 + Math.random() * 3.0;
			}

			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
			geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

			const material = new THREE.PointsMaterial({
				size: 0.01,
				vertexColors: true,
				transparent: true,
				opacity: 1,
				blending: THREE.AdditiveBlending,
				sizeAttenuation: true
			});

			const points = new THREE.Points(geometry, material);
			this.scene.add(points);

			this.bursts.push({
				points,
				age: 0,
				maxAge: 60 + Math.random() * 40
			});
		}

		update() {
			for (let i = this.bursts.length - 1; i >= 0; i--) {
				const burst = this.bursts[i];
				burst.age++;

				const positions = burst.points.geometry.attributes.position.array;
				const velocities = burst.points.geometry.attributes.velocity.array;

				for (let j = 0; j < positions.length / 3; j++) {
					positions[j * 3] += velocities[j * 3];
					positions[j * 3 + 1] += velocities[j * 3 + 1];
					positions[j * 3 + 2] += velocities[j * 3 + 2];
					
					// Add slight gravity
					velocities[j * 3 + 1] -= 0.0001;
					
					// Slow down
					velocities[j * 3] *= 0.98;
					velocities[j * 3 + 1] *= 0.98;
					velocities[j * 3 + 2] *= 0.98;
				}

				burst.points.geometry.attributes.position.needsUpdate = true;
				burst.points.material.opacity = 1.0 - (burst.age / burst.maxAge);

				if (burst.age >= burst.maxAge) {
					this.scene.remove(burst.points);
					burst.points.geometry.dispose();
					burst.points.material.dispose();
					this.bursts.splice(i, 1);
				}
			}
		}
	}

	let fireworkSystem: FireworkSystem | undefined;

	// Convert lat/lng to Vector3 for fireworks
	const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
		const phi = (90 - lat) * (Math.PI / 180);
		const theta = (lng + 180) * (Math.PI / 180);

		const x = -(radius * Math.sin(phi) * Math.cos(theta));
		const z = radius * Math.sin(phi) * Math.sin(theta);
		const y = radius * Math.cos(phi);

		return new THREE.Vector3(x, y, z);
	};

	// Calculate data for cities based on countdown status
	const updateGlobeData = () => {
		if (!now || !target) return;

		const newPoints: CityPoint[] = [];
		const newArcs: Arc[] = [];
		
		// Track cities by status
		const celebratingCities: { name: string; lat: number; lng: number }[] = [];
		const upcomingCities: { name: string; lat: number; lng: number; hours: number }[] = [];

		timezoneList.forEach((timezone: TimezoneType) => {
			const countdown = makeCountdown(new Date(getOffsetTime(timezone.hour, target, now)), now);
			const isCelebrating = countdown.total < 0;
			const isClose = countdown.hours === 0 && countdown.days === 0 && countdown.total > 0;

			// Get first major city from timezone
			const cityName = timezone.cities[0] || timezone.otherCities[0];
			if (!cityName || !cityCoords[cityName]) return;

			const [lat, lng] = cityCoords[cityName];

			if (isCelebrating) {
				// Gold glowing markers for celebrating cities
				newPoints.push({
					lat,
					lng,
					size: 1.2,
					color: '#ffd700',
					label: `🎉 ${cityName} - HAPPY NEW YEAR!`,
					altitude: 0.03
				});
				
				celebratingCities.push({ name: cityName, lat, lng });
				
				// Spawn new fireworks bursts occasionally
				if (fireworkSystem && Math.random() > 0.8) {
					const position = latLngToVector3(lat, lng, 1.05);
					const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f'];
					fireworkSystem.createBurst(position, colors[Math.floor(Math.random() * colors.length)]);
				}
			} else if (isClose) {
				// Yellow pulsing for cities close to midnight
				const minutesLeft = countdown.minutes + (countdown.hours * 60);
				newPoints.push({
					lat,
					lng,
					size: 0.7,
					color: '#ffff00',
					label: `⏰ ${cityName} - ${minutesLeft} minutes to go!`,
					altitude: 0.02
				});
				
				upcomingCities.push({ name: cityName, lat, lng, hours: countdown.hours });
			} else {
				// White for other cities
				newPoints.push({
					lat,
					lng,
					size: 0.4,
					color: '#ffffff',
					label: cityName,
					altitude: 0.01
				});
			}
		});

		// Create New Year wave arc (following midnight line)
		if (celebratingCities.length > 0 && upcomingCities.length > 0) {
			// Sort celebrating and upcoming cities by longitude
			celebratingCities.sort((a, b) => a.lng - b.lng);
			upcomingCities.sort((a, b) => a.lng - b.lng);
			
			// Create arcs from celebrating to upcoming cities near the boundary
			const boundary = celebratingCities[celebratingCities.length - 1];
			const nextCity = upcomingCities[0];
			
			if (boundary && nextCity) {
				newArcs.push({
					startLat: -60,
					startLng: nextCity.lng,
					endLat: 60,
					endLng: nextCity.lng,
					color: ['#ffd700', '#ff6b6b', '#4ecdc4'],
					stroke: 2
				});
			}
		}

		pointsData = newPoints;
		arcsData = newArcs;

		// Update globe with new data
		if (globe) {
			globe
				.pointsData(pointsData)
				.arcsData(arcsData);
		}
	};

	let updateInterval: any;
	let handleResize: () => void;

	onMount(async () => {
		if (!browser || !container) return;

		// Dynamically import globe.gl only in browser to avoid SSR issues
		const Globe = (await import('globe.gl')).default;

		// Initialize globe
		// @ts-ignore - Globe.gl types can be tricky with dynamic imports
		const globeInstance = Globe()(container)
			.globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
			.bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
			.backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
			.showAtmosphere(true)
			.atmosphereColor('#3a9bdc')
			.atmosphereAltitude(0.25)
			.width(window.innerWidth)
			.height(window.innerHeight)
			
			// Point markers configuration
			.pointsData([])
			.pointAltitude('altitude')
			.pointRadius('size')
			.pointColor('color')
			.pointLabel('label')
			.pointsMerge(true)
			
			// Arcs configuration
			.arcsData([])
			.arcColor('color')
			.arcStroke('stroke')
			.arcDashLength(0.9)
			.arcDashGap(0.1)
			.arcDashAnimateTime(1500)
			.arcAltitudeAutoScale(0.5)
			.arcStroke(3)
			
			// Controls
			.enablePointerInteraction(false);

		// Store in $state variable AFTER setup to avoid Svelte proxy issues
		globe = globeInstance;

		// Custom lighting
		const scene = globeInstance.scene();
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);
		
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
		directionalLight.position.set(5, 3, 5);
		scene.add(directionalLight);

		// Initialize firework system
		fireworkSystem = new FireworkSystem(scene);

		// Set initial view - altitude 2.5 is better for visibility
		globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);

		// Auto-rotate
		let autoRotate = true;
		let lastTime = 0;
		(function rotate(time: number) {
			if (autoRotate && globeInstance) {
				const deltaTime = time - lastTime;
				lastTime = time;
				
				const pov = globeInstance.pointOfView();
				// Smooth rotation using deltaTime for consistency
				const rotationSpeed = 0.05; // Adjust speed as needed
				globeInstance.pointOfView({ 
					lat: pov.lat, 
					lng: pov.lng + (rotationSpeed * (deltaTime / 16.6)), 
					altitude: pov.altitude 
				}, 0);
				
				if (fireworkSystem) {
					fireworkSystem.update();
				}
			}
			requestAnimationFrame(rotate);
		})(0);

		// Initial data update
		updateGlobeData();

		// Update data every second
		updateInterval = setInterval(updateGlobeData, 1000);

		// Handle resize
		handleResize = () => {
			if (globe && container) {
				globe.width(container.clientWidth);
				globe.height(container.clientHeight);
			}
		};
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		if (updateInterval) clearInterval(updateInterval);
		if (browser && handleResize) window.removeEventListener('resize', handleResize);
		if (globe && globe._destructor) {
			globe._destructor();
		}
	});
</script>

<div
	bind:this={container}
	class="h-full w-full overflow-hidden"
></div>
