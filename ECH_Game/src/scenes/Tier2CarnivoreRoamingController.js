
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class Tier2CarnivoreRoamingController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gameObject.setData('type', 't2carn');
		this.gameObject._attackResolution && (this.gameObject._attackResolution.powerValue = 3);

		this.scene.events.once('create', () => {
			this.gameObject.play('tier2carn__idle', true);
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;

		// =============================================
		// CREATURE TUNING VALUES — edit these freely
		// =============================================

		// Detection radius — how far this creature can sense other entities (px)
		const detectionRadius = 300;

		// Movement speeds (px per second)
		const neutralSpeed = 50;        // loiter/patrol movement speed
		const fleeSpeed = 150;          // flee movement speed
		const chaseSpeed = 300;         // chase movement speed (set per carnivore/aggressive herb)
		const eatMoveSpeed = 100;        // speed while moving toward food/corpse

		// Loiter behaviour
		const loiterRadius = 200;               // how far from home position creature will wander (px)
		const directionChangeInterval = 3000;   // how often creature picks a new loiter direction (ms)
		const loiterPauseDuration = 2250;       // pause duration between direction changes (ms)
		const returnPauseDuration = 2000;       // pause before returning to home position (ms)

		// Flee behaviour
		const fleeDuration = 2000;      // how long creature flees before re-evaluating (ms)

		// Eating behaviour
		const eatDuration = 10000;       // how long eating animation lasts before food/corpse is destroyed (ms)

		// Combat
		const powerValue = 3;           // power value for combat resolution — higher wins
		                                // Power scale: T1Carn=5, T1Herb=4, T2Carn=3, T2Herb=2, Mimic base=1

		// Chase targets — which entity types this creature will chase
		// Available tags: 'player', 't2herb', 't1herb', 't2carn', 't1carn', 'mimic'
		const chaseTargets = ['t2herb', 't1herb', 'player'];        // empty for herbivores, fill for carnivores and T1 herb

		// =============================================
		// STATE MACHINE WIRING — do not edit below
		// =============================================

		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const patrol = go._behaviourPatrol;
		const eatCorpse = go._behaviourEatCorpse;
		const chase = go._behaviourChase;
		const flee = go._behaviourFlee;
		const combat = go._behaviourCombat;

		if (!stateDecider || !stateManager) {
			console.warn('Tier2CarnivoreRoamingController: missing StateDecider or StateManager');
			return;
		}

		// Apply detection radius
		if (go._detectionRadius) go._detectionRadius.radius = detectionRadius;

		// Apply neutral/patrol behaviour values
		if (patrol) {
			patrol.moveSpeed = neutralSpeed;
			patrol.loiterRadius = loiterRadius;
			patrol.directionChangeInterval = directionChangeInterval;
			patrol.pauseDuration = loiterPauseDuration;
			patrol.returnPauseDuration = returnPauseDuration;
		}

		// Apply flee behaviour values
		if (flee) {
			flee.moveSpeed = fleeSpeed;
			flee.fleeDuration = fleeDuration;
		}

		// Apply opportunity/eat behaviour values
		if (eatCorpse) {
			eatCorpse.moveSpeed = eatMoveSpeed;
			eatCorpse.eatDuration = eatDuration;
		}

		if (chase) {
			chase.targetTags = chaseTargets;
			chase.moveSpeed = chaseSpeed;
		}

		// Apply power value for combat resolution
		if (go._attackResolution) go._attackResolution.powerValue = powerValue;

		// Register behaviour nodes
		stateManager.registerState('patrol', patrol);
		stateManager.registerState('eatCorpse', eatCorpse);
		stateManager.registerState('chase', chase);
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
				condition: (tags) => tags.includes('t1carn')
			},
			{
				state: 'eatCorpse',
				condition: (tags) => tags.includes('corpse')
			},
			{
				state: 'chase',
				condition: (tags) => tags.some(t => chaseTargets.includes(t))
			}
		];

		// Register obstacle collision
		const obstacles = this.scene.children.list.filter(child => 
			child.constructor.name === 'Obstacle' || child._isInvisibleWall
		);
		if (obstacles.length > 0) {
			this.scene.physics.add.collider(go, obstacles);
		}

		go.setData('defaultState', 'patrol');
		stateManager.switchState('patrol');

		const defaultBehaviour = go._behaviourNeutral ?? go._behaviourPatrol;
		if (defaultBehaviour) defaultBehaviour.roaming = true;

		console.log('Tier2Carnivore Roaming state machine ready');
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;

		const body = this.gameObject.body;

		// Handle sprite flipping
		if (body.velocity.x < -1) {
			this.gameObject.flipX = true; // Face left
		} else if (body.velocity.x > 1) {
			this.gameObject.flipX = false; // Face right
		}

		// Check if actively eating a corpse
		const isEating = this.gameObject._stateManager?.currentState === 'eatCorpse' && 
		                 this.gameObject._behaviourEatCorpse?.eating;

		// Handle animation switching
		if (isEating) {
			this.gameObject.play('tier2carn_eat', true);
		} else if (Math.abs(body.velocity.x) > 1 || Math.abs(body.velocity.y) > 1) {
			const currentAnim = this.gameObject.anims.currentAnim?.key;
			if (currentAnim !== 'tier2carn_walkstart' && currentAnim !== 'tier2carn_walk') {
				this.gameObject.play('tier2carn_walkstart', true).chain('tier2carn_walk');
			}
		} else {
			const currentAnim = this.gameObject.anims.currentAnim?.key;
			if (currentAnim === 'tier2carn_walk' || currentAnim === 'tier2carn_walkstart') {
				this.gameObject.play('tier2carn_walkend', true);
			} else if (currentAnim === 'tier2carn_walkend') {
				if (!this.gameObject.anims.isPlaying) {
					this.gameObject.play('tier2carn__idle', true);
				}
			} else {
				this.gameObject.play('tier2carn__idle', true);
			}
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
