
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
			this.setupStateMachine();
		});
	}

	setupStateMachine() {
		const go = this.gameObject;

		const detectionRadius = go._detectionRadius;
		const stateDecider = go._stateDecider;
		const stateManager = go._stateManager;
		const neutral = go._behaviourNeutral;
		const opportunity = go._behaviourOpportunity;
		const flee = go._behaviourFlee;

		console.log('Scripts:', { detectionRadius, stateDecider, stateManager, neutral, opportunity, flee });

		if (!stateDecider || !stateManager) {
			console.warn('Tier2HerbivoreController: missing StateDecider or StateManager');
			return;
		}

		// Register behaviour nodes with StateManager
		stateManager.registerState('neutral', neutral);
		stateManager.registerState('opportunity', opportunity);
		stateManager.registerState('flee', flee);

		// Set priority list on StateDecider
		stateDecider.priorities = [
			{
				state: 'flee',
				condition: (tags) => tags.some(t => ['player', 't2carn', 't1carn', 't1herb', 'mimic'].includes(t))
			},
			{
				state: 'opportunity',
				condition: (tags) => tags.includes('food')
			}
		];

		// Start in neutral state
		stateManager.switchState('neutral');

		console.log('Tier2Herbivore state machine ready');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
