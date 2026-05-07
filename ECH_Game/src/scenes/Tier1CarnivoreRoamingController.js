
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1CarnivoreRoamingController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 't1carn');
		this.gameObject.setData('defaultState', 'patrol');

		this.scene.events.once('create', () => {
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const patrol = go._behaviourPatrol;
		const eatCorpse = go._behaviourEatCorpse;
		const chase = go._behaviourChase;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier1CarnivoreController: missing StateDecider or StateManager');
			return;
		}

		// Apex predator — chases everything
		if (chase) chase.targetTags = ['player', 't2herb', 't1herb', 't2carn', 'mimic'];
		if (chase) chase.moveSpeed = 180;

		// Highest power value
		if (go._attackResolution) go._attackResolution.powerValue = 5;

		// Wide patrol radius
		if (patrol) patrol.loiterRadius = 400;

		// Register behaviour nodes
		stateManager.registerState('patrol', patrol);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('chase', chase);
		stateManager.registerState('combat', combat);

		// Priority list — apex predator eats corpses then chases everything
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'eatCorpse',
				condition: (tags) => tags.includes('corpse')
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => ['player', 't2herb', 't1herb', 't2carn', 'mimic'].includes(t))
			}
		];

		// Register obstacle collision
		const obstacles = this.scene.children.list.filter(child => child.constructor.name === 'Obstacle');
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(go, obstacles);
		}

		stateManager.switchState('patrol');
		if (patrol) patrol.roaming = true;
		console.log('Tier1Carnivore Roaming state machine ready');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
