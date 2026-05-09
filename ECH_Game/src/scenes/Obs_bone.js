
// You can write more code here

/* START OF COMPILED CODE */

import ObstacleCollider from "./ObstacleCollider.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Obs_bone extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "A_Bone", frame);

		this.scaleX = 0.05;
		this.scaleY = 0.05;
		this.setOrigin(0, 0);
		scene.physics.add.existing(this, true);
		this.body.pushable = false;
		this.body.immovable = true;
		this.body.setSize(255, 165, false);

		// obstacleCollider
		new ObstacleCollider(this);

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
