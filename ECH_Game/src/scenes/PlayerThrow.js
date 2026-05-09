
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
		this.throwSpeed = 800;
		this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.heldFruit = null;
		this.heldItemType = null;
		this.gameObject._playerThrow = this;
	}

	update() {
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
		return { x: this.gameObject.x, y: this.gameObject.y };
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
		const worldBounds = this.scene.physics.world.bounds;
		const throwDistance = 380;
		const duration = 650;

		const landX = Phaser.Math.Clamp(
			startX + dir.x * throwDistance,
			worldBounds.left + 20,
			worldBounds.right - 20
		);
		const landY = Phaser.Math.Clamp(
			startY + dir.y * throwDistance,
			worldBounds.top + 20,
			worldBounds.bottom - 20
		);
		// Reduce arc for vertical throws so it doesn't fight the direction
		const arcHeight = 180 * Math.abs(dir.x);

		thrownFruit.body.enable = false;

		let elapsed = 0;
		const flyTicker = this.scene.time.addEvent({
			delay: 16,
			repeat: Math.ceil(duration / 16),
			callback: () => {
				elapsed += 16;
				const t = Math.min(elapsed / duration, 1);
				thrownFruit.x = startX + (landX - startX) * t;
				thrownFruit.y = startY + (landY - startY) * t - arcHeight * Math.sin(Math.PI * t);

				if (t >= 1) {
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
