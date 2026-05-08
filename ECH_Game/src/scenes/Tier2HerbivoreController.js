
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2HerbivoreController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Tag this creature for detection system
		this.gameObject.setData('type', 't2herb');

		this.scene.events.once('create', () => {
			if (this.gameObject._attackResolution) {
				this.gameObject._attackResolution.powerValue = 2;
			}
		});

		this.scene.events.once('create', () => {
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;

		// =============================================
		// CREATURE TUNING VALUES — edit these freely
		// =============================================

		// Detection radius — how far this creature can sense other entities (px)
		const detectionRadius = 150;

		// Movement speeds (px per second)
		const neutralSpeed = 60;        // loiter/patrol movement speed
		const fleeSpeed = 160;          // flee movement speed
		const chaseSpeed = 120;         // chase movement speed (set per carnivore/aggressive herb)
		const eatMoveSpeed = 80;        // speed while moving toward food/corpse

		// Loiter behaviour
		const loiterRadius = 150;               // how far from home position creature will wander (px)
		const directionChangeInterval = 2000;   // how often creature picks a new loiter direction (ms)
		const loiterPauseDuration = 1200;       // pause duration between direction changes (ms)
		const returnPauseDuration = 1000;       // pause before returning to home position (ms)

		// Flee behaviour
		const fleeDuration = 2000;      // how long creature flees before re-evaluating (ms)

		// Eating behaviour
		const eatDuration = 2000;       // how long eating animation lasts before food/corpse is destroyed (ms)

		// Combat
		const powerValue = 2;           // power value for combat resolution — higher wins
		                                // Power scale: T1Carn=5, T1Herb=4, T2Carn=3, T2Herb=2, Mimic base=1

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = [];        // empty for herbivores, fill for carnivores and T1 herb

		// =============================================
		// STATE MACHINE WIRING — do not edit below
		// =============================================

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const neutral = go._behaviourNeutral;
		const opportunity = go._behaviourOpportunity;
		const flee = go._behaviourFlee;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier2HerbivoreController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = detectionRadius;

		// Apply neutral/patrol behaviour values
		if (neutral) {
			neutral.moveSpeed = neutralSpeed;
			neutral.loiterRadius = loiterRadius;
			neutral.directionChangeInterval = directionChangeInterval;
			neutral.pauseDuration = loiterPauseDuration;
			neutral.returnPauseDuration = returnPauseDuration;
		}

		// Apply flee behaviour values
		if (flee) {
			flee.moveSpeed = fleeSpeed;
			flee.fleeDuration = fleeDuration;
		}

		// Apply opportunity/eat behaviour values
		if (opportunity) {
			opportunity.moveSpeed = eatMoveSpeed;
			opportunity.eatDuration = eatDuration;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = powerValue;

		// Register behaviour nodes with StateManager
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('flee', flee);
		stateManager.registerState('combat', combat);

		// Priority list — combat must always be first
		stateDecider.priorities = [
			{
				state: 'combat',
				condition: (tags, detected, go = this.gameObject) => go._stateManager?.currentState === 'combat'
			},
			{
				state: 'flee',
				condition: (tags) => tags.some(t => ['player', 't2carn', 't1carn', 't1herb', 'mimic'].includes(t))
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

		console.log('Tier2Herbivore state machine ready');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
