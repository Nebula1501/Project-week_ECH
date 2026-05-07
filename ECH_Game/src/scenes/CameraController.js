
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class CameraController extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
	    this.lookAheadOffset = { x: 0, y: 0 };
	    this.lookAheadTarget = { x: 0, y: 0 };
	    this.lookAheadDistance = 120;
	    this.lookAheadLerp = 0.05;
	    this.lookAheadDelay = 500;
	    this.lookAheadTimer = 0;
	    this.playerWasMoving = false;
	    this.player = null;

	    this.scene.events.once('create', () => {
	        this.player = this.scene.children.list.find(child => child.constructor.name === 'Player');
	        if (this.player) {
	            this.scene.cameras.main.startFollow(this.player, true, 0.08, 0.08);
	            this.scene.cameras.main.setZoom(1);
	        }
	    });
	}

	update() {
	    if (!this.player || !this.player.body) return;

	    const speed = Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y);
	    const isMoving = speed > 10;
	    const dir = this.player.getData('lastDirection') ?? { x: 0, y: 0 };

	    if (isMoving) {
	        // Update target to current direction while moving — no reset to center
	        this.lookAheadTarget.x = dir.x * this.lookAheadDistance;
	        this.lookAheadTarget.y = dir.y * this.lookAheadDistance;
	        this.playerWasMoving = true;
	        this.lookAheadTimer = 0;
	    } else if (this.playerWasMoving) {
	        // Player just stopped — start delay timer before committing pan
	        this.lookAheadTimer += this.scene.game.loop.delta;
	        if (this.lookAheadTimer >= this.lookAheadDelay) {
	            this.playerWasMoving = false;
	        }
	        // Keep target as is during delay — no snapping
	    }

	    // Lerp current offset toward target
	    this.lookAheadOffset.x += (this.lookAheadTarget.x - this.lookAheadOffset.x) * this.lookAheadLerp;
	    this.lookAheadOffset.y += (this.lookAheadTarget.y - this.lookAheadOffset.y) * this.lookAheadLerp;

	    this.scene.cameras.main.setFollowOffset(-this.lookAheadOffset.x, -this.lookAheadOffset.y);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
