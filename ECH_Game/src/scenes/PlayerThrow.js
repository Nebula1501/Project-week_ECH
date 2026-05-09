
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import Fruit from "./Fruit.js";
import Corpse from "./Corpse.js";
/* END-USER-IMPORTS */

export default class PlayerThrow extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// =============================================
		// PLAYER THROW TUNING VALUES
		// =============================================
		this.throwDistance = 380; // Distance the item travels (px)
		this.throwDuration = 650; // How long the throw arc takes (ms)

		this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.heldFruit = null;
		this.heldItemType = null;
		this.gameObject._playerThrow = this;
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;
		if (this.gameObject.getData('isDead')) return;

		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.spawnHeldFruit();
		}

		if (this.heldFruit) {
			this.updateHeldFruitPosition();
		}

		if (Phaser.Input.Keyboard.JustUp(this.spaceKey)) {
			this.releaseFruit();
		}
	}

	getWorldPosition() {
		// Offset Y so the item is held above the player's head
		return { x: this.gameObject.x, y: this.gameObject.y - 60 };
	}

	spawnHeldFruit() {
		const inventory = this.scene.playerInventory;
		if (!inventory || inventory.items.length === 0) return;
		if (this.heldFruit) return;

		const currentItem = inventory.getCurrentItem();
		const itemType = inventory.getCurrentItem() ?? 'food';
		const pos = this.getWorldPosition();

		let heldObject;
		if (itemType === 'corpse') {
			heldObject = new Corpse(this.scene, pos.x, pos.y);
		} else {
			heldObject = new Fruit(this.scene, pos.x, pos.y);
		}

		this.scene.add.existing(heldObject);
		heldObject.body.enable = false;
		heldObject.setData('isHeld', true);
		this.heldFruit = heldObject;
		this.heldItemType = itemType;
		console.log('Held:', itemType);
	}

	updateHeldFruitPosition() {
		const pos = this.getWorldPosition();
		this.heldFruit.setPosition(pos.x, pos.y);
	}

	releaseFruit() {
		if (!this.heldFruit) return;

		const inventory = this.scene.playerInventory;
		if (inventory) inventory.removeItem();

		const dir = this.gameObject.getData('lastDirection') ?? { x: 1, y: 0 };

		const thrownFruit = this.heldFruit;
		this.heldFruit = null;
		thrownFruit.setData('pickupDisabled', true);

		const startX = thrownFruit.x;
		const startY = thrownFruit.y;
		const playerX = this.gameObject.x;
		const playerY = this.gameObject.y;
		const throwDistance = this.throwDistance;
		const duration = this.throwDuration;

		let landX, landY;
		const indicator = this.gameObject._throwArcIndicator;
		
		if (indicator && indicator._currentLandX !== null) {
			// Use the smooth lagging indicator position for the actual throw
			landX = indicator._currentLandX;
			landY = indicator._currentLandY;
		} else {
			// Fallback if indicator is missing
			landX = playerX + dir.x * throwDistance;
			landY = playerY + dir.y * throwDistance;
		}
		
		// Fixed arc height for satisfying Z-axis pop in all directions
		const arcHeight = 150;

		thrownFruit.body.enable = false;
		
		// Capture original scale so we can safely squish/stretch it
		const baseScaleX = thrownFruit.scaleX;
		const baseScaleY = thrownFruit.scaleY;

		this.scene.tweens.addCounter({
			from: 0,
			to: 1,
			duration: duration,
			// Custom "Hang Time" Ease: Starts fast, slows down at the peak (t=0.5), ends fast
			ease: (t) => t + 0.15 * Math.sin(Math.PI * 2 * t),
			onUpdate: (tween) => {
				const t = tween.getValue();
				thrownFruit.x = startX + (landX - startX) * t;
				thrownFruit.y = startY + (landY - startY) * t - arcHeight * Math.sin(Math.PI * t);
				
				// Dynamic flight stretch: fast at start/end, normal at apex (t=0.5)
				const speedFactor = Math.abs(t - 0.5) * 2; 
				thrownFruit.scaleX = baseScaleX * (1 + 0.3 * speedFactor);
				thrownFruit.scaleY = baseScaleY * (1 - 0.3 * speedFactor);
			},
			onComplete: () => {
				thrownFruit.x = landX;
				thrownFruit.y = landY;
				thrownFruit.body.enable = true;
				thrownFruit.body.reset(landX, landY);
				thrownFruit.body.setAllowGravity(false);
				thrownFruit.body.setVelocity(0, 0);
				thrownFruit.body.immovable = true;
				thrownFruit.setData('isHeld', false);
				thrownFruit.setData('pickupDisabled', false);
				console.log('Object landed');

				// Impact Squash when hitting the ground
				this.scene.tweens.add({
					targets: thrownFruit,
					scaleX: baseScaleX * 1.25,
					scaleY: baseScaleY * 0.75,
					duration: 100,
					yoyo: true,
					ease: 'Quad.easeOut',
					onComplete: () => {
						thrownFruit.setScale(baseScaleX, baseScaleY);
					}
				});

				const obstacles = this.scene.children.list.filter(
					child => child.constructor.name === 'Obstacle'
				);
				if (obstacles.length > 0) {
					this.scene.physics.add.collider(thrownFruit, obstacles);
				}

				this.scene.time.delayedCall(400, () => {
					const player = this.gameObject;
					this.scene.physics.add.overlap(thrownFruit, player, () => {
						if (!thrownFruit.getData('isHeld') &&
							!thrownFruit.getData('pickupDisabled')) {
							const type = thrownFruit.getData('type') ?? this.heldItemType;
							this.scene.playerInventory.addItem(type);
							thrownFruit.destroy();
						}
					});
				});
			}
		});

		console.log('Fruit released in direction', dir);

		// Trigger throw animation safely
		if (this.gameObject.anims && this.scene.anims.exists('player_throw')) {
			// Force repeat: 0 to ensure it plays exactly once
			this.gameObject.play({ key: 'player_throw', repeat: 0 });
			this.gameObject.setData('isPickingUp', true); // Reuse our lock flag so movement doesn't interrupt it
			this.gameObject.off('animationcomplete-player_throw');
			this.gameObject.once('animationcomplete-player_throw', () => {
				this.gameObject.setData('isPickingUp', false);
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
