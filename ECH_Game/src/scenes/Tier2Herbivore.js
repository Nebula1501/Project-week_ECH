
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourNeutral from "./BehaviourNeutral.js";
import BehaviourOpportunity from "./BehaviourOpportunity.js";
import BehaviourFlee from "./BehaviourFlee.js";
import Tier2HerbivoreController from "./Tier2HerbivoreController.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2Herbivore extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "guapen", frame);

		scene.physics.add.existing(this, false);
		this.body.setSize(208, 240, false);

		// detectionRadius
		new DetectionRadius(this);

		// stateDecider
		new StateDecider(this);

		// stateManager
		new StateManager(this);

		// behaviourNeutral
		new BehaviourNeutral(this);

		// behaviourOpportunity
		new BehaviourOpportunity(this);

		// behaviourFlee
		new BehaviourFlee(this);

		// tier2HerbivoreController
		new Tier2HerbivoreController(this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
