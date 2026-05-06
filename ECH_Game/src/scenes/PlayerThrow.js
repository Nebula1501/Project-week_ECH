
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
import Fruit from "./Fruit.js";
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
		this.throwSpeed = 400;
		this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.heldFruit = null;
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

		const pos = this.getWorldPosition();
		const fruit = new Fruit(this.scene, pos.x, pos.y);
		this.scene.add.existing(fruit);
		fruit.setData('isHeld', true);
		this.heldFruit = fruit;
		console.log('Fruit held');
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

		this.scene.physics.add.existing(this.heldFruit, false);

		const thrownFruit = this.heldFruit;
		this.heldFruit = null;
		thrownFruit.setData('isHeld', false);

		thrownFruit.body.setVelocity(dir.x * this.throwSpeed, dir.y * this.throwSpeed);
		thrownFruit.body.setDrag(500, 500);

		const player = this.gameObject;
		this.scene.time.delayedCall(400, () => {
			if (!thrownFruit || !thrownFruit.active) return;
			this.scene.physics.add.overlap(player, thrownFruit, () => {
				const inv = this.scene.playerInventory;
				if (inv && !inv.isFull()) {
					inv.addItem('food');
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
