<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import { timezoneList, makeCountdown, getOffsetTime } from '$lib';
	import type { TimezoneType } from '$lib/types';
	import { m } from '$lib/paraglide/messages';
	import type { LanguageType } from '$lib/types';
	import { cityCoords } from '$lib/cityCoords';

	let { locale, target, now, debug = false } = $props();

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

	// Create a glowing point texture for city markers
	const createPointTexture = (color: string = '#ffffff') => {
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		const centerX = 64;
		const centerY = 64;

		ctx.clearRect(0, 0, 128, 128);

		// Parse color to RGB
		const tempDiv = document.createElement('div');
		tempDiv.style.color = color;
		document.body.appendChild(tempDiv);
		const rgb = window.getComputedStyle(tempDiv).color;
		document.body.removeChild(tempDiv);
		const rgbMatch = rgb.match(/\d+/g);
		if (!rgbMatch) return null;
		const [r, g, b] = rgbMatch.map(Number);

		// Outer glow
		const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 64);
		outerGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
		outerGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.9)`);
		outerGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.5)`);
		outerGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

		ctx.fillStyle = outerGradient;
		ctx.fillRect(0, 0, 128, 128);

		// Bright center core
		const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
		coreGradient.addColorStop(0, `rgba(255, 255, 255, 1)`);
		coreGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
		coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

		ctx.fillStyle = coreGradient;
		ctx.fillRect(0, 0, 128, 128);

		return canvas.toDataURL();
	};

	// Create a glowing star particle texture
	const createParticleTexture = () => {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		// Create bright glowing star shape with better contrast
		const centerX = 128;
		const centerY = 128;

		// Clear canvas
		ctx.clearRect(0, 0, 256, 256);

		// Outer glow - larger and brighter
		const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 128);
		outerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		outerGradient.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
		outerGradient.addColorStop(0.4, 'rgba(255, 255, 200, 0.8)');
		outerGradient.addColorStop(0.7, 'rgba(255, 255, 150, 0.4)');
		outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

		ctx.fillStyle = outerGradient;
		ctx.fillRect(0, 0, 256, 256);

		// Bright center core - larger
		const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
		coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		coreGradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
		coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
		ctx.fillStyle = coreGradient;
		ctx.beginPath();
		ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
		ctx.fill();

		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		return texture;
	};

	// Particle Firework System
	class FireworkSystem {
		scene: THREE.Scene;
		bursts: any[] = [];
		texture: THREE.Texture | null;
		globeInstance: any;

		constructor(scene: THREE.Scene, globeInstance: any) {
			this.scene = scene;
			this.globeInstance = globeInstance;
			this.texture = createParticleTexture();
		}

		createBurst(position: THREE.Vector3, color: string) {
			// #region agent log
			fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					location: 'Earth3D.svelte:84',
					message: 'createBurst called',
					data: {
						x: position.x,
						y: position.y,
						z: position.z,
						positionLength: position.length(),
						color,
						hasScene: !!this.scene,
						hasTexture: !!this.texture,
						burstsCount: this.bursts.length
					},
					timestamp: Date.now(),
					sessionId: 'debug-session',
					runId: 'run1',
					hypothesisId: 'C'
				})
			}).catch(() => {});
			// #endregion
			const particleCount = 150; // Balanced particle count - not too overwhelming
			const geometry = new THREE.BufferGeometry();
			const positions = new Float32Array(particleCount * 3);
			const velocities = new Float32Array(particleCount * 3);
			const colors = new Float32Array(particleCount * 3);
			const sizes = new Float32Array(particleCount);
			const lifetimes = new Float32Array(particleCount); // Individual particle lifetimes

			const threeColor = new THREE.Color(color);
			// Create color variations for more interesting explosions
			const colorVariations = [
				new THREE.Color(color),
				new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.3),
				new THREE.Color(color).lerp(new THREE.Color(0xffaa00), 0.2)
			];

			// Use position directly (already calculated with correct radius)
			const surfacePosition = position.clone();
			// Calculate normal vector (pointing outward from Earth center)
			const normal = surfacePosition.clone().normalize();

			for (let i = 0; i < particleCount; i++) {
				// Start particles at the surface position
				positions[i * 3] = surfacePosition.x;
				positions[i * 3 + 1] = surfacePosition.y;
				positions[i * 3 + 2] = surfacePosition.z;

				// Create more varied explosion patterns
				const pattern = Math.random();
				let theta, phi, speed;

				if (pattern < 0.3) {
					// Upward burst pattern
					theta = Math.random() * Math.PI * 2;
					phi = Math.random() * Math.PI * 0.4; // More upward
					speed = 0.15 + Math.random() * 0.2;
				} else if (pattern < 0.6) {
					// Spherical explosion
					theta = Math.random() * Math.PI * 2;
					phi = Math.acos(2 * Math.random() - 1); // Uniform sphere distribution
					speed = 0.12 + Math.random() * 0.18;
				} else if (pattern < 0.8) {
					// Ring pattern
					theta = Math.random() * Math.PI * 2;
					phi = Math.PI / 2 + (Math.random() - 0.5) * 0.3; // Horizontal ring
					speed = 0.1 + Math.random() * 0.15;
				} else {
					// Star pattern (multiple directions)
					const starArms = 8;
					const arm = Math.floor(Math.random() * starArms);
					theta = (arm / starArms) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
					phi = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
					speed = 0.18 + Math.random() * 0.22;
				}

				// Calculate velocity in spherical coordinates, then transform to world space
				const localVel = new THREE.Vector3(
					Math.sin(phi) * Math.cos(theta) * speed,
					Math.sin(phi) * Math.sin(theta) * speed,
					Math.cos(phi) * speed
				);

				// Transform to align with Earth's surface normal
				const up = new THREE.Vector3(0, 1, 0);
				const right = new THREE.Vector3().crossVectors(up, normal).normalize();
				const forward = new THREE.Vector3().crossVectors(normal, right).normalize();

				const worldVel = new THREE.Vector3()
					.addScaledVector(normal, localVel.z)
					.addScaledVector(right, localVel.x)
					.addScaledVector(forward, localVel.y);

				velocities[i * 3] = worldVel.x;
				velocities[i * 3 + 1] = worldVel.y;
				velocities[i * 3 + 2] = worldVel.z;

				// Vary colors for more interesting explosions
				const colorVar = colorVariations[Math.floor(Math.random() * colorVariations.length)];
				colors[i * 3] = colorVar.r;
				colors[i * 3 + 1] = colorVar.g;
				colors[i * 3 + 2] = colorVar.b;

				// Vary particle sizes more dramatically
				sizes[i] = 0.8 + Math.random() * 1.2;

				// Individual particle lifetimes for staggered fading
				lifetimes[i] = 40 + Math.random() * 60;
			}

			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
			geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
			geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

			geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
			geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
			geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

			const material = new THREE.PointsMaterial({
				size: 3.5, // Slightly larger but not overwhelming
				sizeAttenuation: true,
				map: this.texture,
				vertexColors: true,
				transparent: true,
				opacity: 1,
				blending: THREE.AdditiveBlending,
				depthWrite: false, // Don't write to depth buffer to avoid z-fighting
				depthTest: true, // Enable depth test so fireworks behind Earth are occluded
				alphaTest: 0.01,
				side: THREE.DoubleSide
			});

			// Force texture to be used
			if (this.texture) {
				material.map = this.texture;
				material.needsUpdate = true;
				if (debug) console.log('Texture assigned to material:', !!material.map);
			}

			const points = new THREE.Points(geometry, material);

			// Try different methods to add particles to the globe
			let addedSuccessfully = false;
			let methodUsed = '';

			// Method 1: Try globe's customObjects method
			try {
				if (typeof (this.globeInstance as any).customObjects === 'function') {
					(this.globeInstance as any).customObjects([points]);
					methodUsed = 'customObjects';
					addedSuccessfully = true;
				}
			} catch (e: any) {
				if (debug) console.log('customObjects method failed:', e?.message);
			}

			// Method 2: Try globe's addObject method
			if (!addedSuccessfully) {
				try {
					if (typeof (this.globeInstance as any).addObject === 'function') {
						(this.globeInstance as any).addObject(points);
						methodUsed = 'addObject';
						addedSuccessfully = true;
					}
				} catch (e: any) {
					if (debug) console.log('addObject method failed:', e?.message);
				}
			}

			// Method 3: Try globe's objects method
			if (!addedSuccessfully) {
				try {
					if (typeof (this.globeInstance as any).objects === 'function') {
						(this.globeInstance as any).objects([points]);
						methodUsed = 'objects';
						addedSuccessfully = true;
					}
				} catch (e: any) {
					if (debug) console.log('objects method failed:', e?.message);
				}
			}

			// Method 4: Try globe's customLayer method
			if (!addedSuccessfully) {
				try {
					if (typeof (this.globeInstance as any).customLayer === 'function') {
						(this.globeInstance as any).customLayer(points);
						methodUsed = 'customLayer';
						addedSuccessfully = true;
					}
				} catch (e: any) {
					if (debug) console.log('customLayer method failed:', e?.message);
				}
			}

			// Method 5: Add directly to globe scene
			if (!addedSuccessfully) {
				try {
					const globeScene = this.globeInstance.scene();
					globeScene.add(points);
					methodUsed = 'globeScene';
					addedSuccessfully = true;
				} catch (e: any) {
					if (debug) console.log('globe scene add failed:', e?.message);
				}
			}

			// Method 6: Fallback to our scene
			if (!addedSuccessfully) {
				this.scene.add(points);
				methodUsed = 'fallbackScene';
			}

			if (debug) {
				console.log('Firework particles creation complete:', {
					method: methodUsed,
					position: `(${surfacePosition.x.toFixed(3)}, ${surfacePosition.y.toFixed(3)}, ${surfacePosition.z.toFixed(3)})`,
					addedSuccessfully
				});
			}

			if (debug)
				console.log('Firework particles creation complete:', {
					position: `(${surfacePosition.x.toFixed(3)}, ${surfacePosition.y.toFixed(3)}, ${surfacePosition.z.toFixed(3)})`,
					addedSuccessfully
				});
			// #region agent log
			fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					location: 'Earth3D.svelte:112',
					message: 'Particles added to scene',
					data: {
						particleCount,
						particleSize: material.size,
						hasTexture: !!material.map,
						sceneChildren: this.scene.children.length,
						burstsCount: this.bursts.length + 1
					},
					timestamp: Date.now(),
					sessionId: 'debug-session',
					runId: 'run1',
					hypothesisId: 'D'
				})
			}).catch(() => {});
			// #endregion

			this.bursts.push({
				points,
				age: 0,
				maxAge: 50 + Math.random() * 40, // Balanced lifetime
				initialPosition: surfacePosition.clone(),
				hasSecondaryBurst: false
			});
		}

		update() {
			// #region agent log
			if (this.bursts.length > 0)
				fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						location: 'Earth3D.svelte:121',
						message: 'FireworkSystem.update called',
						data: { burstsCount: this.bursts.length },
						timestamp: Date.now(),
						sessionId: 'debug-session',
						runId: 'run1',
						hypothesisId: 'F'
					})
				}).catch(() => {});
			// #endregion
			for (let i = this.bursts.length - 1; i >= 0; i--) {
				const burst = this.bursts[i];
				burst.age++;

				const positions = burst.points.geometry.attributes.position.array;
				const velocities = burst.points.geometry.attributes.velocity.array;
				const sizes = burst.points.geometry.attributes.size?.array;
				const lifetimes = burst.points.geometry.attributes.lifetime?.array;

				// Calculate Earth's center for gravity
				const earthCenter = new THREE.Vector3(0, 0, 0);

				for (let j = 0; j < positions.length / 3; j++) {
					const idx = j * 3;
					const pos = new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2]);

					// Update position
					positions[idx] += velocities[idx];
					positions[idx + 1] += velocities[idx + 1];
					positions[idx + 2] += velocities[idx + 2];

					// Improved physics: gravity pulling toward Earth center
					const toCenter = earthCenter.clone().sub(pos).normalize();
					const gravityStrength = 0.0005;
					velocities[idx] += toCenter.x * gravityStrength;
					velocities[idx + 1] += toCenter.y * gravityStrength;
					velocities[idx + 2] += toCenter.z * gravityStrength;

					// Air resistance (friction) - varies by particle
					const friction = 0.97 + Math.random() * 0.02; // Slight variation
					velocities[idx] *= friction;
					velocities[idx + 1] *= friction;
					velocities[idx + 2] *= friction;

					// Individual particle lifetime and fading
					if (lifetimes) {
						const particleAge = burst.age;
						const particleLifetime = lifetimes[j];
						const particleFade = Math.max(0, 1.0 - particleAge / particleLifetime);

						// Particles fade individually for more realistic effect
						if (sizes) {
							sizes[j] = (0.8 + Math.random() * 1.2) * particleFade;
						}
					}
				}

				burst.points.geometry.attributes.position.needsUpdate = true;
				if (sizes) {
					burst.points.geometry.attributes.size.needsUpdate = true;
				}

				// Create secondary burst effect at mid-life for some fireworks
				if (!burst.hasSecondaryBurst && burst.age > 15 && burst.age < 25 && Math.random() > 0.7) {
					// Create a smaller secondary burst (less frequent)
					if (Math.random() > 0.5) {
						// Only 50% chance for secondary burst
						const secondaryPos = new THREE.Vector3(
							positions[Math.floor(positions.length / 6) * 3],
							positions[Math.floor(positions.length / 6) * 3 + 1],
							positions[Math.floor(positions.length / 6) * 3 + 2]
						);
						const secondaryColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#ffd700'];
						this.createBurst(
							secondaryPos,
							secondaryColors[Math.floor(Math.random() * secondaryColors.length)]
						);
					}
					burst.hasSecondaryBurst = true;
				}

				// Fade out smoothly with exponential curve
				const fadeProgress = burst.age / burst.maxAge;
				burst.points.material.opacity = Math.max(0, Math.pow(1.0 - fadeProgress, 2));

				if (burst.age >= burst.maxAge) {
					// Remove from scene
					try {
						const globeScene = this.globeInstance.scene();
						globeScene.remove(burst.points);
					} catch (e) {
						this.scene.remove(burst.points);
					}
					burst.points.geometry.dispose();
					burst.points.material.dispose();
					this.bursts.splice(i, 1);
				}
			}
		}
	}

	let fireworkSystem: FireworkSystem | undefined;

	// Calculate data for cities based on countdown status
	const updateGlobeData = () => {
		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:173',
				message: 'updateGlobeData called',
				data: {
					hasNow: !!now,
					hasTarget: !!target,
					nowTime: now?.getTime(),
					targetTime: target?.getTime()
				},
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'B'
			})
		}).catch(() => {});
		// #endregion
		if (!now || !target) return;

		const newPoints: CityPoint[] = [];
		const newArcs: Arc[] = [];

		// Track cities by status
		const celebratingCities: { name: string; lat: number; lng: number }[] = [];
		const upcomingCities: { name: string; lat: number; lng: number; hours: number }[] = [];
		let totalProcessed = 0;
		let celebratingCount = 0;
		let closeCount = 0;
		let otherCount = 0;

		// Show ALL cities from cityCoords, not just one per timezone
		Object.entries(cityCoords).forEach(([cityName, [lat, lng]]) => {
			// Find which timezone this city belongs to
			let cityTimezone: TimezoneType | undefined;
			for (const tz of timezoneList) {
				if (tz.cities.includes(cityName) || tz.otherCities.includes(cityName)) {
					cityTimezone = tz;
					break;
				}
			}

			// If city not in any timezone, skip it (or show as neutral)
			if (!cityTimezone) {
				// Show all cities even if not in timezone list
				otherCount++;
				newPoints.push({
					lat,
					lng,
					size: 0.25, // Larger size for visibility
					color: '#88ccff', // Bright cyan-blue
					label: cityName,
					altitude: 0
				});
				return;
			}

			totalProcessed++;
			const countdown = makeCountdown(new Date(getOffsetTime(cityTimezone.hour, target, now)), now);
			const isCelebrating = countdown.total < 0;
			const isClose = countdown.hours === 0 && countdown.days === 0 && countdown.total > 0;

			if (isCelebrating) {
				celebratingCount++;
				// Rainbow cycling color for celebrating cities - each city has its own offset
				const time = now.getTime();
				// Use city name hash to create unique offset for each city
				let cityHash = 0;
				for (let i = 0; i < cityName.length; i++) {
					cityHash = (cityHash << 5) - cityHash + cityName.charCodeAt(i);
					cityHash = cityHash & cityHash; // Convert to 32bit integer
				}
				const offset = Math.abs(cityHash) % 360; // Unique offset per city (0-360)
				const hue = (time / 20 + offset) % 360; // Each city cycles at different phase
				const saturation = 100;
				const lightness = 65; // Bright and vibrant
				const rainbowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
				newPoints.push({
					lat,
					lng,
					size: 0.5, // Much larger size for visibility
					color: rainbowColor, // Rainbow cycling color - unique per city
					label: `🎉 ${cityName} - HAPPY NEW YEAR!`,
					altitude: 0
				});

				celebratingCities.push({ name: cityName, lat, lng });
			} else if (isClose) {
				closeCount++;
				// Bright yellow for cities close to midnight
				const minutesLeft = countdown.minutes + countdown.hours * 60;
				newPoints.push({
					lat,
					lng,
					size: 0.4, // Larger size for visibility
					color: '#ffff00', // Bright yellow
					label: `⏰ ${cityName} - ${minutesLeft}m`,
					altitude: 0
				});

				upcomingCities.push({ name: cityName, lat, lng, hours: countdown.hours });
			} else {
				otherCount++;
				// Bright white/cyan for other cities - more visible
				newPoints.push({
					lat,
					lng,
					size: 0.3, // Larger size for visibility
					color: '#88ccff', // Bright cyan-blue for better contrast
					label: cityName,
					altitude: 0
				});
			}
		});

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:230',
				message: 'Cities processed',
				data: {
					totalProcessed,
					celebratingCount,
					closeCount,
					otherCount,
					newPointsLength: newPoints.length
				},
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'B'
			})
		}).catch(() => {});
		// #endregion

		// Disable arc visualization - it creates a giant ring
		// Arcs removed to prevent visual clutter

		pointsData = newPoints;
		arcsData = newArcs;

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:252',
				message: 'pointsData updated',
				data: { pointsDataLength: pointsData.length, hasGlobe: !!globe, firstPoint: pointsData[0] },
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'E'
			})
		}).catch(() => {});
		// #endregion

		if (globe) {
			if (debug) {
				console.log(`Earth3D - Setting ${pointsData.length} city markers`, {
					sample: pointsData[0],
					celebrating: pointsData.filter((p) => p.size >= 0.5).length,
					close: pointsData.filter((p) => p.size >= 0.4 && p.size < 0.5).length,
					normal: pointsData.filter((p) => p.size < 0.4).length
				});
			}
			globe.pointsData(pointsData).arcsData(arcsData);
			if (debug) console.log(`Earth3D - Updated ${pointsData.length} city markers`);
		} else {
			if (debug) console.warn('Earth3D - Globe instance not available for updating points');
		}
	};

	let updateInterval: any;
	let handleResize: () => void;

	onMount(async () => {
		if (!browser || !container) return;
		if (debug) console.log('Earth3D - Initializing Background Globe...');

		// Dynamically import globe.gl
		const Globe = (await import('globe.gl')).default;

		// Initialize globe instance
		if (debug) console.log('Earth3D - Globe library loaded, creating instance...');

		// Note: globe.gl 2.45.0 does not support night side / nightImageUrl
		// This is a limitation of the library version
		const globeInstance = Globe()(container)
			.globeImageUrl('/Blue_Marble_2002.png')
			.bumpImageUrl('/earth-topology.png')
			.backgroundImageUrl('/night-sky.png')
			.showAtmosphere(true)
			.atmosphereColor('#3a9bdc')
			.atmosphereAltitude(0.15)
			.pointsData([])
			.pointAltitude('altitude')
			.pointRadius('size')
			.pointColor('color')
			.pointLabel('label')
			.pointsMerge(false)
			.arcsData([])
			.arcColor('color')
			.arcStroke(3)
			.enablePointerInteraction(false);

		// Store globe instance
		globe = globeInstance;

		// Get scene - let globe.gl handle the background image
		const scene = globeInstance.scene();
		if (debug) console.log('Earth3D - Scene retrieved:', !!scene);

		// Don't override the background - globe.gl's backgroundImageUrl handles it better

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:324',
				message: 'Globe initialized',
				data: {
					hasBackgroundImage: true,
					backgroundImageUrl: '/night-sky.png',
					sceneBackgroundSet: true
				},
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'G'
			})
		}).catch(() => {});
		// #endregion
		if (debug) console.log('Earth3D - Background image set:', '/night-sky.png');

		// Night side is set above - it creates the dark zone on the side facing away from the sun

		// Custom lighting - keep it simple to not interfere with globe.gl
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		// Directional light for better Earth visibility
		const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
		sunLight.position.set(5, 3, 5);
		scene.add(sunLight);

		// Initialize firework system
		if (debug) {
			console.log('Earth3D - Initializing FireworkSystem...');
			console.log('Scene info:', {
				hasScene: !!scene,
				childrenCount: scene.children.length,
				children: scene.children.map((c: any) => ({ type: c.type, position: c.position }))
			});
		}
		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:315',
				message: 'Initializing FireworkSystem',
				data: {
					hasScene: !!scene,
					sceneType: scene?.constructor?.name,
					childrenCount: scene.children.length
				},
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'A'
			})
		}).catch(() => {});
		// #endregion
		fireworkSystem = new FireworkSystem(scene, globeInstance);
		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				location: 'Earth3D.svelte:318',
				message: 'FireworkSystem created',
				data: { hasFireworkSystem: !!fireworkSystem, hasTexture: !!fireworkSystem?.texture },
				timestamp: Date.now(),
				sessionId: 'debug-session',
				runId: 'run1',
				hypothesisId: 'A'
			})
		}).catch(() => {});
		// #endregion

		// Set initial view
		globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);

		// Auto-rotate loop
		let lastTime = performance.now();
		let frameCount = 0;
		function rotate(time: number) {
			frameCount++;
			// #region agent log
			if (frameCount % 60 === 0)
				fetch('http://127.0.0.1:7243/ingest/b7f2fdcf-2e77-49dd-859e-570f08f4c8c6', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						location: 'Earth3D.svelte:322',
						message: 'Animation loop running',
						data: {
							frameCount,
							hasGlobeInstance: !!globeInstance,
							hasFireworkSystem: !!fireworkSystem,
							pointsDataLength: pointsData.length
						},
						timestamp: Date.now(),
						sessionId: 'debug-session',
						runId: 'run1',
						hypothesisId: 'F'
					})
				}).catch(() => {});
			// #endregion
			if (!globeInstance) return;
			const deltaTime = time - lastTime;
			lastTime = time;

			const pov = globeInstance.pointOfView();
			const rotationSpeed = 0.05;
			globeInstance.pointOfView(
				{
					lat: pov.lat,
					lng: pov.lng + rotationSpeed * (deltaTime / 16.6 || 1),
					altitude: pov.altitude
				},
				0
			);

			// Spawn fireworks from currently celebrating cities - less frequent to avoid overwhelming
			if (fireworkSystem && Math.random() > 0.92) {
				const celebrating = pointsData.filter((p) => p.size >= 0.5); // Celebrating cities have size 0.5
				if (celebrating.length > 0) {
					const city = celebrating[Math.floor(Math.random() * celebrating.length)];

					// Use globe.gl's built-in coordinate conversion method
					// This ensures fireworks use the exact same coordinate system as the rendered points
					try {
						const coords = (globeInstance as any).getCoords(city.lat, city.lng);
						if (coords && (coords.x !== undefined || Array.isArray(coords))) {
							let position: THREE.Vector3;
							if (Array.isArray(coords)) {
								position = new THREE.Vector3(coords[0], coords[1], coords[2]).multiplyScalar(1.01);
							} else {
								position = new THREE.Vector3(coords.x, coords.y, coords.z).multiplyScalar(1.01);
							}
							const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f'];
							fireworkSystem.createBurst(
								position,
								colors[Math.floor(Math.random() * colors.length)]
							);
							if (debug) console.log('Firework spawned at', city.label);
						} else {
							if (debug) console.log('getCoords returned invalid data for', city.label, coords);
						}
					} catch (e: any) {
						if (debug) console.log('Firework spawn error:', e?.message, 'for city', city.label);
					}
				}
			}

			if (fireworkSystem) {
				fireworkSystem.update();
			}
			requestAnimationFrame(rotate);
		}
		requestAnimationFrame(rotate);

		if (debug) console.log('Earth3D - Setup complete.');

		// Periodic updates
		updateGlobeData();
		updateInterval = setInterval(updateGlobeData, 100); // Update every 100ms for smooth rainbow cycling

		// Resize handler
		handleResize = () => {
			if (globe && browser && container) {
				// Globe automatically resizes with container, but we can trigger a render update
				if (typeof (globe as any).resize === 'function') {
					(globe as any).resize();
				}
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

<div bind:this={container} class="absolute inset-0 h-full w-full overflow-hidden"></div>
