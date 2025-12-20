export interface JBEffect {
	loadImages: () => Promise<unknown>;
	predraw: (x: number) => Promise<unknown>;
	draw: (context: CanvasRenderingContext2D) => Promise<unknown>;
}

export const JB_TRAIN_SPEED = 25;
export const JB_EFFECT_FREQUENCY = 30000; //DONT FORGET THIS
export const JB_EFFECT_WAGON_LENGTH = 275; //px
export const JB_EFFECT_WAGON_HEIGHT = 75; //px
export const JB_EFFECT_SHORT_LOCO_LENGTH = 150; //px, for PolRegio loco
export const JB_EFFECT_LONG_LOCO_LENGTH = 300; //px, for CD 680 loco
export const JB_EFFECT_PENDOLINO_WAGONS_AMOUNT = 5; //middle, standard wagons
export const JB_EFFECT_LOCO_LENGTH = 200; //PKPIC
