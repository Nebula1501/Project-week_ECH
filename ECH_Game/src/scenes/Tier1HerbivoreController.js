
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
		const tuning = this.scene.creatureTuning?.tier1Herbivore ?? {};

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = ['player', 't2herb', 't2carn', 't1carn', 'mimic'];        // empty for herbivores, fill for carnivores and T1 herb

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

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = tuning.detectionRadius ?? 200;

		// Apply neutral/patrol behaviour values
		if (neutral) {
			neutral.moveSpeed = tuning.neutralSpeed ?? 60;
			neutral.loiterRadius = tuning.loiterRadius ?? 150;
			neutral.directionChangeInterval = tuning.directionChangeInterval ?? 2000;
			neutral.pauseDuration = tuning.loiterPauseDuration ?? 1200;
			neutral.returnPauseDuration = tuning.returnPauseDuration ?? 1000;
		}

		// Apply opportunity/eat behaviour values
		if (opportunity) {
			opportunity.moveSpeed = tuning.eatMoveSpeed ?? 80;
			opportunity.eatDuration = tuning.eatDuration ?? 2000;
		}

		if (chase) {
			chase.targetTags = chaseTargets;
			chase.moveSpeed = tuning.chaseSpeed ?? 140;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = tuning.combatPower ?? 4;

		// Register behaviour nodes
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('chase', chase);
		stateManager.registerState('combat', combat);

		// Priority list — combat must always be first
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => chaseTargets.includes(t))
			},
			{
				state: 'opportunity',
				condition: (tags) => tags.includes('food')
			}
		];

		// Register obstacle collision
		const obstacles = this.scene.children.list.filter(child => 
			child.constructor.name === 'Obstacle' || child._isInvisibleWall
		);
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(go, obstacles);
		}

		go.setData('defaultState', 'neutral');
		stateManager.switchState('neutral');
		console.log('Tier1Herbivore state machine ready');
	}
}

/* END OF COMPILED CODE */

// You can write more code here
