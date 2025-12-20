import {
	type JBEffect,
	JB_TRAIN_SPEED,
	JB_EFFECT_WAGON_HEIGHT,
	JB_EFFECT_WAGON_LENGTH,
	JB_EFFECT_LOCO_LENGTH
} from '$lib/effect';

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
		return Promise.all([
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

		this.wagons = [];
		for (let w = 0; w < amount; w++) {
			this.wagons.push(Math.trunc(Math.random() * 3));
		}
	}

	async draw(context: CanvasRenderingContext2D) {
		const returning = Boolean(Math.round(Math.random()));

		if (!returning) this.x = -JB_EFFECT_WAGON_LENGTH;
		else this.x = context.canvas.width + (this.wagons.length + 1) * JB_EFFECT_WAGON_LENGTH;

		return new Promise((resolve) => {
			//all wagons JB_EFFECT_WAGON_LENGTHx75 px
			const i = setInterval(() => {
				context?.clearRect(0, 0, context.canvas.width, context.canvas.height);

				//loco in front
				if (!returning) {
					context?.drawImage(
						this.loco as HTMLImageElement,
						this.x,
						context.canvas.height - JB_EFFECT_WAGON_HEIGHT
					);
				}

				for (let w = 0; w < this.wagons.length; w++) {
					switch (this.wagons[w]) {
						case 0:
							context?.drawImage(
								this.w1 as HTMLImageElement,
								this.x - (w + 1) * JB_EFFECT_WAGON_LENGTH,
								context.canvas.height - JB_EFFECT_WAGON_HEIGHT
							);
							break;
						case 1:
							context?.drawImage(
								this.w2 as HTMLImageElement,
								this.x - (w + 1) * JB_EFFECT_WAGON_LENGTH,
								context.canvas.height - JB_EFFECT_WAGON_HEIGHT
							);
							break;
						case 2:
							context?.drawImage(
								this.w3 as HTMLImageElement,
								this.x - (w + 1) * JB_EFFECT_WAGON_LENGTH,
								context.canvas.height - JB_EFFECT_WAGON_HEIGHT
							);
							break;
					}
				}

				//loco in front when going back
				if (returning) {
					context?.drawImage(
						this.loco as HTMLImageElement,
						this.x - this.wagons.length * JB_EFFECT_WAGON_LENGTH - JB_EFFECT_LOCO_LENGTH,
						context.canvas.height - JB_EFFECT_WAGON_HEIGHT
					);
				}

				if (!returning) this.x += JB_TRAIN_SPEED;
				else this.x -= JB_TRAIN_SPEED;

				//once all pass
				if (
					(!returning &&
						this.x - this.wagons.length * JB_EFFECT_WAGON_LENGTH - JB_EFFECT_LOCO_LENGTH >
							context.canvas.width) ||
					(returning && this.x + JB_EFFECT_WAGON_LENGTH < 0)
				) {
					clearInterval(i);
					resolve(undefined);
					return;
				}
			}, 40);
		});
	}
}
