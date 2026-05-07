
// You can write more code here

/* START OF COMPILED CODE */

import PlayerInventory from "./PlayerInventory.js";
import PlayerMovement from "./PlayerMovement.js";
import PlayerThrow from "./PlayerThrow.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Player extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "__DEFAULT", frame);

		this.scaleX = 0.25;
		this.scaleY = 0.25;
		scene.physics.add.existing(this, false);
		this.body.setSize(300, 580, false);
		this.play("player_idle");

		// playerInventory
		new PlayerInventory(this);

		// playerMovement
		new PlayerMovement(this);

		// playerThrow
		new PlayerThrow(this);

		/* START-USER-CTR-CODE */
		this.setData('type', 'player');
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
