
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier1HerbivoreController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.gameObject.setData('type', 't1herb');
		this.gameObject.setData('defaultState', 'neutral');

		this.scene.events.once('create', () => {
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const neutral = go._behaviourNeutral;
		const opportunity = go._behaviourOpportunity;
		const chase = go._behaviourChase;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier1HerbivoreController: missing StateDecider or StateManager');
			return;
		}

		// Configure chase to target everything including player and carnivores
		if (chase) chase.targetTags = ['player', 't2herb', 't2carn', 't1carn', 'mimic'];
		if (chase) chase.moveSpeed = 140;

		// Set power value
		if (go._attackResolution) go._attackResolution.powerValue = 4;

		// Register behaviour nodes
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('chase', chase);
		stateManager.registerState('combat', combat);

		// Priority list
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => ['player', 't2herb', 't2carn', 't1carn', 'mimic'].includes(t))
			},
			{
				state: 'opportunity',
				condition: (tags) => tags.includes('food')
			}
		];

		// Register obstacle collision
		const obstacles = this.scene.children.list.filter(child => child.constructor.name === 'Obstacle');
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(go, obstacles);
		}

		stateManager.switchState('neutral');
		console.log('Tier1Herbivore state machine ready');
	}
}

/* END OF COMPILED CODE */

// You can write more code here
