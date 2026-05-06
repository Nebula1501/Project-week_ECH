
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StateManager extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.currentState = null;
		this.states = {};

		// Register self on game object for StateDecider to find
		this.gameObject._stateManager = this;
	}

	registerState(stateName, behaviourNode) {
		this.states[stateName] = behaviourNode;
	}

	switchState(stateName) {
		if (this.currentState === stateName) return;

		// Deactivate current behaviour node
		if (this.currentState && this.states[this.currentState]) {
			this.states[this.currentState].onDeactivate();
		}

		this.currentState = stateName;

		// Activate new behaviour node
		if (this.states[stateName]) {
			this.states[stateName].onActivate();
		} else {
			console.warn('StateManager: no behaviour node registered for state:', stateName);
		}
	}

	getCurrentState() {
		return this.currentState;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
