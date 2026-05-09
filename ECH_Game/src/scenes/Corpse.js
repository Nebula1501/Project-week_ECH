
// You can write more code here

/* START OF COMPILED CODE */

import CorpsePickup from "./CorpsePickup.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Corpse extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "guapen", frame);

		this.scaleX = 0.3;
		this.scaleY = 0.3;
		scene.physics.add.existing(this, false);
		this.body.allowGravity = false;
		this.body.setSize(208, 240, false);

		// corpsePickup
		new CorpsePickup(this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
