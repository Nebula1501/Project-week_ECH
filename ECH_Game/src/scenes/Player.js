
// You can write more code here

/* START OF COMPILED CODE */

import PlayerMovement from "./PlayerMovement.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Player extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		// arcadeimage_1
		const arcadeimage_1 = scene.physics.add.image(0, 0, "sprite_player");
		arcadeimage_1.body.setSize(155, 132, false);
		this.add(arcadeimage_1);

		// playerMovement
		new PlayerMovement(arcadeimage_1);

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
