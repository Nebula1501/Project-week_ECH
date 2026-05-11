
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SpawnCinematic extends Phaser.Scene {

	constructor() {
		super("SpawnCinematic");

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

		let spotX = W / 2;
		let spotY = -80;
		let spotRadius = 85;
		let overlayAlpha = 0.93;

		const gfx = this.add.graphics().setScrollFactor(0).setDepth(50);

		const redraw = () => {
			gfx.clear();

			// Draw darkness as filled rectangles surrounding the spotlight
			gfx.fillStyle(0x000000, overlayAlpha);

			// Top strip (above spotlight)
			gfx.fillRect(0, 0, W, Math.max(0, spotY - spotRadius));

			// Bottom strip (below spotlight)
			const bottomY = spotY + spotRadius;
			gfx.fillRect(0, bottomY, W, Math.max(0, H - bottomY));

			// Left strip (beside spotlight, middle band)
			const midTop = spotY - spotRadius;
			const midH = spotRadius * 2;
			gfx.fillRect(0, midTop, Math.max(0, spotX - spotRadius), midH);

			// Right strip (beside spotlight, middle band)
			const rightX = spotX + spotRadius;
			gfx.fillRect(rightX, midTop, Math.max(0, W - rightX), midH);

			// Warm glow around spotlight
			gfx.fillStyle(0xfff0aa, 0.12);
			gfx.fillCircle(spotX, spotY, spotRadius * 1.8);
			gfx.fillStyle(0xffe066, 0.18);
			gfx.fillCircle(spotX, spotY, spotRadius * 1.2);
		};

		redraw();

		// Spotlight drops from top over 1400ms
		this.tweens.add({
			targets: {},
			duration: 1400,
			ease: 'Cubic.easeOut',
			onUpdate: (tween) => {
				spotY = Phaser.Math.Linear(-80, H * 0.5, tween.progress);
				spotRadius = Phaser.Math.Linear(40, 85, tween.progress);
				redraw();
			},
			onComplete: () => {
				this.time.delayedCall(150, () => {
					this.scene.get('Level1').events.emit('spawnSpotlightReady');
				});
			}
		});

		this.scene.get('Level1').events.on('spotlightPosition', (sx, sy) => {
			spotX = sx;
			spotY = sy;
			redraw();
		});

		this.events.on('playerLanded', () => {
			this.tweens.add({
				targets: {},
				duration: 1800,
				ease: 'Sine.easeIn',
				onUpdate: (tween) => {
					spotRadius = Phaser.Math.Linear(85, 800, tween.progress);
					overlayAlpha = Phaser.Math.Linear(0.93, 0, tween.progress);
					redraw();
				},
				onComplete: () => {
					gfx.destroy();
					this.scene.stop();
				}
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
