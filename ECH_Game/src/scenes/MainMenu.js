
// You can write more code here

/* START OF COMPILED CODE */

import PlayButton from "./PlayButton.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MainMenu extends Phaser.Scene {

	constructor() {
		super("MainMenu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// Title
		this.add.image(190, 287, "dino");

		// Play
		const play = this.add.image(184, 582, "dino");

		// playButton
		new PlayButton(play);

		// Quit
		this.add.image(184, 867, "dino");

		this.play = play;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	play;

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
