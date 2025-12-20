import {
	type JBEffect,
	JB_EFFECT_PENDOLINO_WAGONS_AMOUNT,
	JB_EFFECT_LONG_LOCO_LENGTH,
	JB_TRAIN_SPEED,
	JB_EFFECT_WAGON_HEIGHT,
	JB_EFFECT_WAGON_LENGTH
} from '$lib/effect';

export class PendolinoEffect implements JBEffect {
	end: HTMLImageElement;
	endMirrored: HTMLCanvasElement;
	mid: HTMLImageElement;
	x: number = 0;

	constructor() {
		this.end = new Image();
		this.end.src = '/journey/680end.png';
		this.mid = new Image();
		this.mid.src = '/journey/680middle.png';
		this.endMirrored = document.createElement('canvas');
	}

	async loadImages() {
		await Promise.all([
			new Promise((resolve) => {
				this.end?.addEventListener('load', () => {
					resolve(0);
				});
			}),
			new Promise((resolve) => {
				this.mid?.addEventListener('load', () => {
					resolve(0);
				});
			})
		]);

		//make flipped version of image
		this.endMirrored.width = this.end.width;
		this.endMirrored.height = this.end.height;
		const context = this.endMirrored.getContext('2d');

		context?.translate(this.end.width, 0);
		context?.scale(-1, 1);
		context?.drawImage(this.end, 0, 0);
		context?.setTransform(1, 0, 0, 1, 0, 0);

		//console.log(this.endMirrored.toDataURL('image/png'));
	}

	//predraw does nothing
	async predraw() {}

	async draw(context: CanvasRenderingContext2D) {
		const returning = Boolean(Math.round(Math.random()));

		if (!returning) this.x = -JB_EFFECT_LONG_LOCO_LENGTH;
		else
			this.x =
				context.canvas.width +
				JB_EFFECT_PENDOLINO_WAGONS_AMOUNT * JB_EFFECT_WAGON_LENGTH +
				JB_EFFECT_LONG_LOCO_LENGTH;

		return new Promise((resolve) => {
			//middle wagons JB_EFFECT_WAGON_LENGTHx75 px, end 300x75px
			const interval = setInterval(() => {
				context?.clearRect(0, 0, context.canvas.width, context.canvas.height);

				//driver's wagon
				context?.drawImage(
					this.end as HTMLImageElement,
					this.x,
					context.canvas.height - JB_EFFECT_WAGON_HEIGHT
				);

				//middle wagons
				for (let i = 0; i < JB_EFFECT_PENDOLINO_WAGONS_AMOUNT; i++) {
					context?.drawImage(
						this.mid as HTMLImageElement,
						this.x - (i + 1) * JB_EFFECT_WAGON_LENGTH,
						context.canvas.height - JB_EFFECT_WAGON_HEIGHT
					);
				}

				//last wagon (front turned around)
				context?.drawImage(
					this.endMirrored,
					this.x -
						JB_EFFECT_PENDOLINO_WAGONS_AMOUNT * JB_EFFECT_WAGON_LENGTH -
						JB_EFFECT_LONG_LOCO_LENGTH,
					context.canvas.height - JB_EFFECT_WAGON_HEIGHT
				);

				if (!returning) this.x += JB_TRAIN_SPEED;
				else this.x -= JB_TRAIN_SPEED;

				//once all pass
				if (
					(!returning &&
						this.x -
							JB_EFFECT_PENDOLINO_WAGONS_AMOUNT * JB_EFFECT_WAGON_LENGTH -
							JB_EFFECT_LONG_LOCO_LENGTH * 2 >
							context.canvas.width) ||
					(returning && this.x + JB_EFFECT_LONG_LOCO_LENGTH < 0)
				) {
					clearInterval(interval);
					resolve(0);
					return;
				}
			}, 40);
		});
	}
}
