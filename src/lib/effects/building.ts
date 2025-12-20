import { type JBEffect } from '$lib/effect';
import { error } from '@sveltejs/kit';

//tree must go first
export const JB_BUILDINGS_OFF_LIST = [
	'/journey/buildingtree.png',
	'/journey/building1.png',
	'/journey/building2.png'
];

export const JB_BUILDINGS_ON_LIST = [
	'/journey/buildingtreelight.png',
	'/journey/buildinglight1.png',
	'/journey/buildinglight2.png'
];

export const JB_BUILDING_WIDTH = 95;
export const JB_TREE_WIDTH = 40;
export const JB_BUILDING_HEIGHT = 80;

//draw row of many buildings which light up and add decorations after each other
export class BuildingEffect implements JBEffect {
	off: HTMLImageElement[] = [];
	on: HTMLImageElement[] = [];
	id: number = 0;
	buildings: {
		x: number;
		type: number;
	}[] = [];

	constructor() {
		for (const source of JB_BUILDINGS_OFF_LIST) {
			this.off.push(new Image());
			(this.off.at(-1) as HTMLImageElement).src = source;
		}
		for (const source of JB_BUILDINGS_ON_LIST) {
			this.on.push(new Image());
			(this.on.at(-1) as HTMLImageElement).src = source;
		}

		//assertion
		if (this.on.length != this.off.length) {
			throw error(500);
		}
	}

	async loadImages() {
		const promises: Promise<number>[] = [];

		for (const off of this.off) {
			promises.push(
				new Promise((resolve) => {
					off.addEventListener('load', () => {
						resolve(0);
					});
				})
			);
		}

		for (const on of this.on) {
			promises.push(
				new Promise((resolve) => {
					on.addEventListener('load', () => {
						resolve(0);
					});
				})
			);
		}

		return Promise.all(promises);
	}

	async predraw(x: number) {
		this.id = 0;
		this.buildings = [];

		const offset = Math.trunc(((x - 3 * JB_TREE_WIDTH) % JB_BUILDING_WIDTH) / 2);
		let hasTree = false; //1 per row

		let xl = offset;
		while (xl < x - offset) {
			if (xl > x / 2 && !hasTree) {
				xl += JB_TREE_WIDTH;

				hasTree = true;
				this.buildings.push({
					x: xl,
					type: 0
				});

				xl += JB_TREE_WIDTH;
				xl += JB_TREE_WIDTH;

				continue;
			}

			this.buildings.push({
				x: xl,
				type: Math.trunc(Math.random() * this.on.length - 1) + 1
			});

			xl += JB_BUILDING_WIDTH;
		}
	}

	async draw(context: CanvasRenderingContext2D) {
		const returning = Boolean(Math.round(Math.random()));

		return new Promise((resolve) => {
			const i = setInterval(() => {
				if (this.id <= this.buildings.length) {
					context?.clearRect(0, 0, context.canvas.width, context.canvas.height);

					for (let i = 0; i < this.id; i++) {
						context?.drawImage(
							this.on[
								this.buildings[returning ? this.buildings.length - 1 - i : i].type
							] as HTMLImageElement,
							this.buildings[returning ? this.buildings.length - 1 - i : i].x,
							context.canvas.height - JB_BUILDING_HEIGHT
						);
					}

					for (let i = this.id; i < this.buildings.length; i++) {
						context?.drawImage(
							this.off[
								this.buildings[returning ? this.buildings.length - 1 - i : i].type
							] as HTMLImageElement,
							this.buildings[returning ? this.buildings.length - 1 - i : i].x,
							context.canvas.height - JB_BUILDING_HEIGHT
						);
					}
				}

				if (this.id == this.buildings.length + 1) {
					clearInterval(i);
					resolve(undefined);
					return;
				}

				this.id++;
			}, 250);
		});
	}
}
