
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class FruitPickup extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.scene.events.once('create', () => {
			const player = this.scene.children.list.find(child => child.constructor.name === 'Player');
			if (!player) return;

			const playerBody = player;
			const fruit = this.gameObject;

			this.scene.physics.add.overlap(playerBody, fruit, () => {
				if (fruit.getData('isHeld')) return;
				const inv = this.scene.playerInventory;
				if (inv && !inv.isFull()) {
					inv.addItem('food');
					fruit.destroy();
				}
			});

			const obstacles = this.scene.children.list.filter(child => child.constructor.name === 'Obstacle');
			if (obstacles.length > 0) {
				this.scene.physics.add.collider(fruit, obstacles);
			}
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
