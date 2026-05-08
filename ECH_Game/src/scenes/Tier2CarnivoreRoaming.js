
// You can write more code here

/* START OF COMPILED CODE */

import DetectionRadius from "./DetectionRadius.js";
import StateDecider from "./StateDecider.js";
import StateManager from "./StateManager.js";
import BehaviourEatCorpse from "./BehaviourEatCorpse.js";
import BehaviourChase from "./BehaviourChase.js";
import BehaviourFlee from "./BehaviourFlee.js";
import AttackResolution from "./AttackResolution.js";
import BehaviourPatrol from "./BehaviourPatrol.js";
import BehaviourCombat from "./BehaviourCombat.js";
import Tier2CarnivoreRoamingController from "./Tier2CarnivoreRoamingController.js";
import DetectionGlow from "./DetectionGlow.js";
import SquashStretch from "./SquashStretch.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2CarnivoreRoaming extends Phaser.Physics.Arcade.Image {

	constructor(scene, x, y, texture, frame) {
		super(scene, x ?? 0, y ?? 0, texture || "sprite_carnivore1", frame);

		this.scaleX = 0.5;
		this.scaleY = 0.5;
		scene.physics.add.existing(this, false);
		this.body.setSize(920, 800, false);

		// detectionRadius
		new DetectionRadius(this);

		// stateDecider
		new StateDecider(this);

		// stateManager
		new StateManager(this);

		// behaviourEatCorpse
		new BehaviourEatCorpse(this);

		// behaviourChase
		new BehaviourChase(this);

		// behaviourFlee
		new BehaviourFlee(this);

		// attackResolution
		new AttackResolution(this);

		// behaviourPatrol
		new BehaviourPatrol(this);

		// behaviourCombat
		new BehaviourCombat(this);

		// tier2CarnivoreRoamingController
		new Tier2CarnivoreRoamingController(this);

		// detectionGlow
		new DetectionGlow(this);

		// squashStretch
		new SquashStretch(this);

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
