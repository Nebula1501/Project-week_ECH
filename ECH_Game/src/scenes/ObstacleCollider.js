
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class ObstacleCollider extends ScriptNode {

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

			const playerBody = player.getAt(0);
			const obstacle = this.gameObject;

			this.scene.physics.add.collider(playerBody, obstacle);
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
