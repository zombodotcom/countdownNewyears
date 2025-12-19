import { type JBEffect, JB_TRAIN_SPEED } from "$lib/effect";

const PENDOLINO_WAGONS_AMOUNT = 5; //middle, standard wagons

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
		this.endMirrored = document.createElement("canvas");
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
			}),
		]);

		//make flipped version of image
		this.endMirrored.width = this.end.width;
		this.endMirrored.height = this.end.height
		const context = this.endMirrored.getContext("2d");

		context?.translate(this.end.width, 0);
		context?.scale(-1, 1);
		context?.drawImage(this.end, 0, 0);
		context?.setTransform(1, 0, 0, 1, 0, 0);

		console.log(this.endMirrored.toDataURL("image/png"));
	}

	//predraw does nothing
	async predraw() { }

	async draw(context: CanvasRenderingContext2D) {
		this.x = -300;

		return new Promise((resolve) => {
			//middle wagons 275x75 px, end 300x75px
			const interval = setInterval(() => {
				context?.clearRect(0, 0, context.canvas.width, context.canvas.height);

				//driver's wagon
				context?.drawImage(this.end as HTMLImageElement, this.x, context.canvas.height - 75);

				//middle wagons
				for (let i = 0; i < PENDOLINO_WAGONS_AMOUNT; i++) {
					context?.drawImage(this.mid as HTMLImageElement, this.x - (i + 1) * 275, context.canvas.height - 75);
				}

				//last wagon (front turned around)	
				context?.drawImage(
					this.endMirrored,
					this.x - (PENDOLINO_WAGONS_AMOUNT) * 275 - 300, context.canvas.height - 75
				);

				this.x += JB_TRAIN_SPEED;
				//once all pass
				if (this.x - 5 * 275 - 2 * 300 > context.canvas.width) {
					clearInterval(interval);
					resolve(0);
					return;
				}
			}, 40);
		});

	}
};