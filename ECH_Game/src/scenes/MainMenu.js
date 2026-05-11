
// You can write more code here

/* START OF COMPILED CODE */

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

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	create() {
		this.editorCreate();
		const W = this.scale.width;   // 1280
		const H = this.scale.height;  // 720

		// Atmospheric gradient bands (layered rectangles)
		this.add.rectangle(W/2, H * 0.25, W, H * 0.5, 0x2d1b4e, 0.6);
		this.add.rectangle(W/2, H * 0.75, W, H * 0.5, 0x0d0618, 0.7);

		// Title
		const title = this.add.text(W/2, H * 0.22, 'ECHOES OF THE HUNT', {
			fontFamily: 'Arial Black',
			fontSize: '64px',
			color: '#e8d5ff',
			stroke: '#4a0080',
			strokeThickness: 8,
			shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 8, fill: true }
		}).setOrigin(0.5);

		// Subtitle
		this.add.text(W/2, H * 0.32, 'A game of predator and prey', {
			fontFamily: 'Arial',
			fontSize: '22px',
			color: '#9b7fc7',
			fontStyle: 'italic'
		}).setOrigin(0.5);

		// Decorative line under title
		this.add.rectangle(W/2, H * 0.38, 400, 2, 0x7b3fa0);

		// Buttons — helper
		const makeButton = (y, label, callback) => {
			const bg = this.add.rectangle(W/2, y, 320, 60, 0x3d1a6e)
				.setInteractive({ useHandCursor: true })
				.setStrokeStyle(2, 0x9b5fd4);

			const text = this.add.text(W/2, y, label, {
				fontFamily: 'Arial Black',
				fontSize: '26px',
				color: '#e8d5ff'
			}).setOrigin(0.5);

			bg.on('pointerover', () => {
				bg.setFillStyle(0x5c2a9e);
				bg.setStrokeStyle(2, 0xd4aaff);
				text.setColor('#ffffff');
			});
			bg.on('pointerout', () => {
				bg.setFillStyle(0x3d1a6e);
				bg.setStrokeStyle(2, 0x9b5fd4);
				text.setColor('#e8d5ff');
			});
			bg.on('pointerdown', () => {
				this.cameras.main.fadeOut(400, 0, 0, 0);
				this.cameras.main.once('camerafadeoutcomplete', callback);
			});
		};

		makeButton(H * 0.52, 'START GAME', () => {
			const level1 = this.scene.get('Level1');
			if (level1) level1.events.emit('triggerPlayerSpawn');
			this.scene.stop();
		});
		makeButton(H * 0.63, 'LEVEL SELECT', () => this.scene.start('LevelSelect'));
		makeButton(H * 0.74, 'QUIT', () => {
			// Browser can't force quit — show message instead
			this.add.text(W/2, H * 0.88, 'Close the browser tab to quit.', {
				fontFamily: 'Arial',
				fontSize: '18px',
				color: '#9b7fc7'
			}).setOrigin(0.5);
		});

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
