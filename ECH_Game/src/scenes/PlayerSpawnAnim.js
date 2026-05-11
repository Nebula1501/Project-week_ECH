
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import FightCloudFX from './FightCloudFX.js';
/* END-USER-IMPORTS */

export default class PlayerSpawnAnim extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this._hasSpawned = false;
		const player = this.gameObject;

		this.scene.events.once('create', () => {
			const spawnX = player.x;
			const spawnY = player.y;

			// Hide player and freeze above screen
			player.setVisible(false);
			player.setPosition(spawnX, spawnY - 800);
			if (player.body) {
				player.body.setVelocity(0, 0);
				player.body.setAllowGravity(false);
			}
			player.setData('spawnLocked', true);

			// Lock camera at spawn area — don't follow player above screen
			const cam = this.scene.cameras.main;
			cam.stopFollow();
			cam.setScroll(spawnX - cam.width / 2, spawnY - cam.height / 2);

			this.scene.events.once('triggerPlayerSpawn', () => {
				if (this._hasSpawned) return;
				this._hasSpawned = true;

				// Create dark overlay in Level1 scene — fixed to camera
				const W = cam.width;
				const H = cam.height;
				const darkOverlay = this.scene.add.rectangle(
					W / 2, H / 2, W, H, 0x000000
				)
					.setScrollFactor(0)
					.setDepth(1000)
					.setAlpha(0.92);

				// Set player above the overlay
				const originalDepth = player.depth;
				player.setDepth(1002);
				player.setVisible(true);

				const spotlight = this.scene.add.graphics().setDepth(1001);

				const drawSpotlight = () => {
					spotlight.clear();
					spotlight.fillStyle(0xfff8dc, 0.08);
					spotlight.fillCircle(player.x, player.y, 160);
					spotlight.fillStyle(0xffeaa0, 0.14);
					spotlight.fillCircle(player.x, player.y, 110);
					spotlight.fillStyle(0xfff5cc, 0.20);
					spotlight.fillCircle(player.x, player.y, 70);
					spotlight.fillStyle(0xffffff, 0.12);
					spotlight.fillCircle(player.x, player.y, 40);
				};

				drawSpotlight();

				// Fall tween — Bounce easeOut for dramatic landing
				this.scene.tweens.add({
					targets: player,
					y: spawnY,
					duration: 1100,
					ease: 'Bounce.easeOut',
					onUpdate: () => drawSpotlight(),
					onComplete: () => {
						// Dust cloud
						new FightCloudFX(this.scene, spawnX, spawnY + 30);

						// Fade out darkness and spotlight over 1.5s
						this.scene.tweens.add({
							targets: [darkOverlay, spotlight],
							alpha: 0,
							duration: 1500,
							ease: 'Sine.easeIn',
							onUpdate: () => drawSpotlight(),
							onComplete: () => {
								darkOverlay.destroy();
								spotlight.destroy();
								player.setDepth(originalDepth);

								// Restore player physics and camera follow
								if (player.body) {
									player.body.setAllowGravity(true);
									player.body.reset(spawnX, spawnY);
								}
								player.setData('spawnLocked', false);
								cam.startFollow(player, true, 0.1, 0.1);
							}
						});
					}
				});
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
