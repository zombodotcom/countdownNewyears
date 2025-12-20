import { type JBEffect } from '$lib/effect';
import { asyncDelay } from '$lib';

export const JB_FOREST_WINTER_STAGES = [
	'/journey/tree.png',
	'/journey/wintertree1.png',
	'/journey/wintertree2.png',
	'/journey/wintertree3.png'
];

export const JB_FOREST_TREE_AMOUNT = 1000;

//this just draws a forest
export class ForestEffect implements JBEffect {
	trees: HTMLImageElement[] = [];
	positions: {
		x: number;
		scale: number;
	}[] = [];

	constructor() {
		for (const source of JB_FOREST_WINTER_STAGES) {
			this.trees.push(new Image());
			(this.trees.at(-1) as HTMLImageElement).src = source;
		}
	}

	async loadImages() {
		const promises: Promise<number>[] = [];

		for (const wintertree of this.trees) {
			promises.push(
				new Promise((resolve) => {
					wintertree.addEventListener('load', () => {
						resolve(0);
					});
				})
			);
		}

		return Promise.all(promises);
	}

	async predraw(x: number) {
		this.positions = [];
		for (let i = 0; i < JB_FOREST_TREE_AMOUNT; i++) {
			this.positions.push({
				x: 25 + Math.trunc(Math.random() * x - 50),
				scale: Math.random() * 0.5 + 0.5
			});
		}
	}

	async draw(context: CanvasRenderingContext2D) {
		context?.clearRect(0, 0, context.canvas.width, context.canvas.height);

		//await resize which clears out canvas
		await new Promise((resolve) => {
			new ResizeObserver(() => {
				resolve(0);
			}).observe(context.canvas);
		});

		for (let i = 0; i < this.trees.length; i++) {
			//draw all trees being covered in snow
			for (const position of this.positions) {
				context.save();
				context.translate(position.x * position.scale, 0);
				context.scale(position.scale, position.scale);

				context?.drawImage(
					this.trees[Math.min(this.trees.length - 1, Math.max(0, i + Math.round(Math.random())))],
					position.x,
					context.canvas.height - 50
				);
				context.restore();
			}
			await asyncDelay(1000);
		}
	}
}
