
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
		const title = this.add.image(412, 342, "ECHOES of the HUNT");
		title.scaleX = 0.5;
		title.scaleY = 0.5;

		// Play
		const play = this.add.image(405, 680, "Play");
		play.scaleX = 0.5;
		play.scaleY = 0.5;

		// playButton
		new PlayButton(play);

		// Quit
		const quit = this.add.image(405, 827, "Quit");
		quit.scaleX = 0.5;
		quit.scaleY = 0.5;

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
