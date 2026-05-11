
// You can write more code here

/* START OF COMPILED CODE */

import LevelExitLogic from "./LevelExitLogic.js";
import HideOnAwake from "./HideOnAwake.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LevelExit extends Phaser.GameObjects.Rectangle {

	constructor(scene, x, y, width, height) {
		super(scene, x ?? 0, y ?? 0, width ?? 128, height ?? 128);

		this.isFilled = true;

		// levelExitLogic
		new LevelExitLogic(this);

		// hideOnAwake
		new HideOnAwake(this);

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
