import { type JBEffect, JB_TRAIN_SPEED } from '$lib/effect';

//this just draws a bridge, a train of our choice then passes over it
export class BridgeEffect implements JBEffect {
	x: number = 0;

	constructor() {}

	async loadImages() {}

	async predraw() {}

	async draw() {}
}
