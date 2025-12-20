import {
	type JBEffect,
	JB_TRAIN_SPEED,
	JB_EFFECT_WAGON_HEIGHT,
	JB_EFFECT_WAGON_LENGTH,
	JB_EFFECT_SHORT_LOCO_LENGTH
} from '$lib/effect';

export class PolregioEffect implements JBEffect {
	x: number = 0;
	loco: HTMLImageElement;
	double: HTMLImageElement;
	normal: HTMLImageElement;
	wagons: number[] = [];

	constructor() {
		this.loco = new Image();
		this.loco.src = '/journey/prloco.png';
		this.double = new Image();
		this.double.src = '/journey/prdouble.png';
		this.normal = new Image();
		this.normal.src = '/journey/prsmall.png';
	}

	async loadImages() {
		return Promise.all([
			new Promise((resolve) => {
				this.loco?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.double?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.normal?.addEventListener('load', () => {
					resolve(0);
				});
			})
		]);
	}

	async predraw() {
		const amount = Math.trunc(3 + Math.random() * 3);

		this.wagons = [];
		for (let w = 0; w < amount; w++) {
			this.wagons.push(Math.trunc(Math.random() * 2));
		}
	}

	async draw(context: CanvasRenderingContext2D) {
		const returning = Boolean(Math.round(Math.random()));

		if (!returning) this.x = -JB_EFFECT_SHORT_LOCO_LENGTH;
		else
			this.x =
				context.canvas.width +
				this.wagons.length * JB_EFFECT_WAGON_LENGTH +
				JB_EFFECT_SHORT_LOCO_LENGTH;

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
								this.normal as HTMLImageElement,
								this.x - (w + Number(!returning)) * JB_EFFECT_WAGON_LENGTH,
								context.canvas.height - JB_EFFECT_WAGON_HEIGHT
							);
							break;
						case 1:
							context?.drawImage(
								this.double as HTMLImageElement,
								this.x - (w + Number(!returning)) * JB_EFFECT_WAGON_LENGTH,
								context.canvas.height - JB_EFFECT_WAGON_HEIGHT
							);
							break;
					}
				}

				//loco in front when going back
				if (returning) {
					context?.drawImage(
						this.loco as HTMLImageElement,
						this.x -
							(this.wagons.length - 1) * JB_EFFECT_WAGON_LENGTH -
							JB_EFFECT_SHORT_LOCO_LENGTH,
						context.canvas.height - JB_EFFECT_WAGON_HEIGHT
					);
				}

				if (!returning) this.x += JB_TRAIN_SPEED;
				else this.x -= JB_TRAIN_SPEED;

				//once all pass
				if (
					(!returning &&
						this.x - this.wagons.length * JB_EFFECT_WAGON_LENGTH - JB_EFFECT_SHORT_LOCO_LENGTH >
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
