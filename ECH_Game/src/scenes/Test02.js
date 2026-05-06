
// You can write more code here

/* START OF COMPILED CODE */

import DioramaBounds from "./DioramaBounds.js";
import Player from "./Player.js";
import Fruit from "./Fruit.js";
import Obstacle from "./Obstacle.js";
import Tier2Carnivore from "./Tier2Carnivore.js";
import Tier1Herbivore from "./Tier1Herbivore.js";
import Tier2Herbivore from "./Tier2Herbivore.js";
import Tier1Carnivore from "./Tier1Carnivore.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Test02 extends Phaser.Scene {

	constructor() {
		super("Test02");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// editabletilemap
		this.cache.tilemap.add("editabletilemap_0011afad-b347-4087-9230-2fc2b8778dbd", {
			format: 1,
			data: {
				width: 40,
				height: 10,
				orientation: "orthogonal",
				tilewidth: 64,
				tileheight: 64,
				tilesets: [
					{
						columns: 4,
						margin: 0,
						spacing: 0,
						tilewidth: 64,
						tileheight: 64,
						tilecount: 16,
						firstgid: 1,
						image: "tilesheet_ground01",
						name: "tilesheet_ground01",
						imagewidth: 256,
						imageheight: 256,
					},
				],
				layers: [
					{
						type: "tilelayer",
						name: "Ground",
						width: 40,
						height: 15,
						opacity: 1,
						data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 1, 1, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 1, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1, 5, 5, 1, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 1, 5, 5, 5, 5, 1, 2, 2, 2, 5, 5, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 5, 5, 5, 5, 3, 3, 3, 3, 3, 2, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, 0, 0],
					},
				],
			},
		});
		const editabletilemap = this.add.tilemap("editabletilemap_0011afad-b347-4087-9230-2fc2b8778dbd");
		editabletilemap.addTilesetImage("tilesheet_ground01");

		// Ground
		const ground = editabletilemap.createLayer("Ground", ["tilesheet_ground01"], 0, 74);

		// dioramaBounds
		new DioramaBounds(ground);

		// player
		const player = new Player(this, 218, 569);
		this.add.existing(player);

		// fruit
		const fruit = new Fruit(this, 491, 463);
		this.add.existing(fruit);

		// obstacle
		const obstacle = new Obstacle(this, 916, 194);
		this.add.existing(obstacle);

		// tier2Carnivore
		const tier2Carnivore = new Tier2Carnivore(this, 1275, 250);
		this.add.existing(tier2Carnivore);

		// tier1Herbivore
		const tier1Herbivore = new Tier1Herbivore(this, 1192, 730);
		this.add.existing(tier1Herbivore);

		// tier2Herbivore
		const tier2Herbivore = new Tier2Herbivore(this, 1648, 535);
		this.add.existing(tier2Herbivore);

		// tier1Carnivore
		const tier1Carnivore = new Tier1Carnivore(this, 1052, 453);
		this.add.existing(tier1Carnivore);

		this.editabletilemap = editabletilemap;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.Tilemaps.Tilemap} */
	editabletilemap;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
