import { type JBEffect, JB_TRAIN_SPEED } from '$lib/effect';

//this just draws the station and the dispatcher, a train of our choice then passes over it
export class StationEffect implements JBEffect {
	x: number = 0;

	constructor() {}

	async loadImages() {}

	async predraw() {}

	async draw() {}
}
