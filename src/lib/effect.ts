export interface JBEffect {
	loadImages: () => Promise<unknown>;
	predraw: () => Promise<unknown>;
	draw: (context: CanvasRenderingContext2D) => Promise<unknown>;
};

export const JB_TRAIN_SPEED = 15;
export const JB_EFFECT_FREQUENCY = 30000; //DONT FORGET THIS