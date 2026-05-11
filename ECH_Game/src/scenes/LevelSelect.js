
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LevelSelect extends Phaser.Scene {

	constructor() {
		super("LevelSelect");

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
		const W = this.scale.width;
		const H = this.scale.height;

		this.add.rectangle(W/2, H/2, W, H, 0x1a0a2e);
		this.add.rectangle(W/2, H * 0.25, W, H * 0.5, 0x2d1b4e, 0.6);

		this.add.text(W/2, H * 0.2, 'LEVEL SELECT', {
			fontFamily: 'Arial Black',
			fontSize: '52px',
			color: '#e8d5ff',
			stroke: '#4a0080',
			strokeThickness: 6
		}).setOrigin(0.5);

		this.add.rectangle(W/2, H * 0.3, 400, 2, 0x7b3fa0);

		const makeLevelBtn = (x, y, label, scene) => {
			const bg = this.add.rectangle(x, y, 240, 200, 0x3d1a6e)
				.setInteractive({ useHandCursor: true })
				.setStrokeStyle(2, 0x9b5fd4);
			this.add.text(x, y, label, {
				fontFamily: 'Arial Black',
				fontSize: '22px',
				color: '#e8d5ff',
				align: 'center'
			}).setOrigin(0.5);
			bg.on('pointerover', () => bg.setFillStyle(0x5c2a9e));
			bg.on('pointerout', () => bg.setFillStyle(0x3d1a6e));
			bg.on('pointerdown', () => {
				this.cameras.main.fadeOut(400, 0, 0, 0);
				this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(scene));
			});
		};

		makeLevelBtn(W * 0.35, H * 0.55, 'LEVEL 1\nThe Hunt Begins', 'Level1');
		makeLevelBtn(W * 0.65, H * 0.55, 'LEVEL 2\nDeeper Wilds', 'Level2');

		// Back button
		const back = this.add.text(W/2, H * 0.88, '← BACK TO MENU', {
			fontFamily: 'Arial Black',
			fontSize: '22px',
			color: '#9b7fc7'
		}).setOrigin(0.5).setInteractive({ useHandCursor: true });
		back.on('pointerover', () => back.setColor('#e8d5ff'));
		back.on('pointerout', () => back.setColor('#9b7fc7'));
		back.on('pointerdown', () => {
			this.cameras.main.fadeOut(400, 0, 0, 0);
			this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MainMenu'));
		});

		this.cameras.main.fadeIn(600, 0, 0, 0);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
