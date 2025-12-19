import { type JBEffect, JB_TRAIN_SPEED } from "$lib/effect";

export class PKPEffect implements JBEffect {
	loco: HTMLImageElement;
	w1: HTMLImageElement;
	w2: HTMLImageElement;
	w3: HTMLImageElement;
	x: number = 0;
	wagons: number[] = [];

	constructor() {
		this.loco = new Image();
		this.loco.src = '/journey/griffin.png';
		this.w1 = new Image();
		this.w1.src = '/journey/wagon1.png';
		this.w2 = new Image();
		this.w2.src = '/journey/wagon2.png';
		this.w3 = new Image();
		this.w3.src = '/journey/wagon3.png';
	}

	async loadImages() {
		await Promise.all([
			new Promise((resolve) => {
				this.loco?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.w1?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.w2?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.w3?.addEventListener('load', () => {
					resolve(0);
				});
			})
		]);
	}

	async predraw() {
		const amount = Math.trunc(5 + Math.random() * 5);

		for (let w = 0; w < amount; w++) {
			this.wagons.push(Math.trunc(Math.random() * 3));
		}
	}

	async draw(context: CanvasRenderingContext2D) {
		this.x = -275;

		return new Promise((resolve) => {
			//all wagons 275x75 px
			const i = setInterval(() => {
				context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
				context?.drawImage(this.loco as HTMLImageElement, this.x, context.canvas.height - 75);

				for (let w = 0; w < this.wagons.length; w++) {
					switch (this.wagons[w]) {
						case 0:
							context?.drawImage(this.w1 as HTMLImageElement, this.x - (w + 1) * 275, context.canvas.height - 75);
							break;
						case 1:
							context?.drawImage(this.w2 as HTMLImageElement, this.x - (w + 1) * 275, context.canvas.height - 75);
							break;
						case 2:
							context?.drawImage(this.w3 as HTMLImageElement, this.x - (w + 1) * 275, context.canvas.height - 75);
							break;
					}
				}

				this.x += JB_TRAIN_SPEED;
				//once all pass
				if (this.x - this.wagons.length * 275 > context.canvas.width) {
					clearInterval(i);
					resolve(undefined);
					return;
				}
			}, 40);
		});

	}
};