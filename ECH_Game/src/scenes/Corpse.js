
// You can write more code here

/* START OF COMPILED CODE */

import CorpsePickup from "./CorpsePickup.js";
import SyncPhysicsBody from "./SyncPhysicsBody.js";
import AtmosphereDepth from "./AtmosphereDepth.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Corpse extends Phaser.GameObjects.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_corpse", frame);

		this.scaleX = 0.15;
		this.scaleY = 0.2;
		scene.physics.add.existing(this, false);
		this.body.allowGravity = false;
		this.body.pushable = false;
		this.body.setSize(860, 482, false);

		// corpsePickup
		new CorpsePickup(this);

		// syncPhysicsBody
		new SyncPhysicsBody(this);

		// atmosphereDepth
		new AtmosphereDepth(this);

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
