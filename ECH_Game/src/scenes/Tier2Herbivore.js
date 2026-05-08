
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourNeutral from "./BehaviourNeutral.js";
import BehaviourOpportunity from "./BehaviourOpportunity.js";
import BehaviourFlee from "./BehaviourFlee.js";
import Tier2HerbivoreController from "./Tier2HerbivoreController.js";
import AttackResolution from "./AttackResolution.js";
import BehaviourCombat from "./BehaviourCombat.js";
import SquashStretch from "./SquashStretch.js";
import DetectionGlow from "./DetectionGlow.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2Herbivore extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_tier2-herbivore", frame);

		this.scaleX = 0.25;
		this.scaleY = 0.25;
		scene.physics.add.existing(this, false);
		this.body.setSize(500, 900, false);

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

		// attackResolution
		new AttackResolution(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// squashStretch
		new SquashStretch(this);

		// detectionGlow
		new DetectionGlow(this);

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
