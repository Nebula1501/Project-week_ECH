
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class InvisibleWallCollider extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Add static physics body to the Rectangle
		this.scene.physics.add.existing(this.gameObject, true);
		this.gameObject._isInvisibleWall = true;

		this.scene.events.once('create', () => {
			this.registerCollisions();
		});
	}

	registerCollisions() {
		const wall = this.gameObject;
		const allEntities = this.scene.children.list.filter(child => {
			const name = child.constructor.name;
			return name === 'Player' ||
				   name === 'Tier2Herbivore' ||
				   name === 'Tier2Carnivore' ||
				   name === 'Tier1Herbivore' ||
				   name === 'Tier1Carnivore' ||
				   name === 'Mimic' ||
				   name === 'Tier2HerbivoreRoaming' ||
				   name === 'Tier2CarnivoreRoaming' ||
				   name === 'Tier1HerbivoreRoaming' ||
				   name === 'Tier1CarnivoreRoaming';
		});

		allEntities.forEach(entity => {
			this.scene.physics.add.collider(entity, wall);
		});

		console.log('InvisibleWall registered collisions with', allEntities.length, 'entities');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
