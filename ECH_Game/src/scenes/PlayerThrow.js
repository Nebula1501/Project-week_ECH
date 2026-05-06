
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
		const go = this.gameObject;
		const worldX = go.parentContainer ? go.parentContainer.x + go.x : go.x;
		const worldY = go.parentContainer ? go.parentContainer.y + go.y : go.y;
		return { x: worldX, y: worldY };
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

		this.heldFruit.body.enable = true;
		this.heldFruit.body.immovable = false;

		const thrownFruit = this.heldFruit;
		this.heldFruit = null;
		thrownFruit.setData('isHeld', false);
		thrownFruit.setData('pickupDisabled', true);

		thrownFruit.body.setVelocity(dir.x * this.throwSpeed, dir.y * this.throwSpeed);
		thrownFruit.body.setDrag(500, 500);

		const landingCheck = this.scene.time.addEvent({
			delay: 100,
			loop: true,
			callback: () => {
				if (!thrownFruit || !thrownFruit.active) {
					landingCheck.remove();
					return;
				}
				if (thrownFruit.body.speed < 10) {
					thrownFruit.body.immovable = true;
					thrownFruit.body.setVelocity(0, 0);
					thrownFruit.setData('pickupDisabled', false);
					landingCheck.remove();
					console.log('Object landed');
				}
			}
		});

		const obstacles = this.scene.children.list.filter(child => child.constructor.name === 'Obstacle');
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(thrownFruit, obstacles);
		}

		const player = this.gameObject;
		const thrownItemType = this.heldItemType ?? 'food';
		this.heldItemType = null;

		this.scene.time.delayedCall(400, () => {
			if (!thrownFruit || !thrownFruit.active) return;
			this.scene.physics.add.overlap(player, thrownFruit, () => {
				const inv = this.scene.playerInventory;
				if (inv && !inv.isFull()) {
					inv.addItem(thrownItemType);
					thrownFruit.destroy();
				}
			});
		});

		console.log('Fruit released in direction', dir);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
