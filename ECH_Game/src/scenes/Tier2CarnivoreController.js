
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2CarnivoreController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	awake() {
		this.gameObject.setData('type', 't2carn');
		this.gameObject._attackResolution && (this.gameObject._attackResolution.powerValue = 3);

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
		const flee = go._behaviourFlee;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier2CarnivoreController: missing StateDecider or StateManager');
			return;
		}

		// Configure chase to target herbivores and player
		if (chase) chase.targetTags = ['t2herb', 't1herb', 'player'];
		if (chase) chase.moveSpeed = 320;

		// Register behaviour nodes
		stateManager.registerState('patrol', patrol);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('chase', chase);
		stateManager.registerState('flee', flee);
		stateManager.registerState('combat', combat);

		// Priority list
		// 1. Combat
		// 2. Flee from T1 Carnivore
		// 3. Eat corpse
		// 4. Chase prey
		// 5. Patrol
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'flee',
				condition: (tags) => tags.includes('t1carn')
			},
			{
				state: 'eatCorpse',
				condition: (tags) => tags.includes('corpse')
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => ['t2herb', 't1herb', 'player'].includes(t))
			}
		];

		// Register obstacle collision
		const obstacles = this.scene.children.list.filter(child => child.constructor.name === 'Obstacle');
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(go, obstacles);
		}

		go.setData('defaultState', 'patrol');
		stateManager.switchState('patrol');
		console.log('Tier2Carnivore state machine ready');
	}
}

/* END OF COMPILED CODE */

// You can write more code here
