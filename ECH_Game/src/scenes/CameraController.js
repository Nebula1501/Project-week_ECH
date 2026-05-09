
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
	    // =============================================
	    // CAMERA TUNING VALUES — edit these freely
	    // =============================================

	    // Camera Zoom
	    this.zoomLevel = 0.8;              // Camera zoom level (1 = default, >1 = zoomed in, <1 = zoomed out)

	    // Basic look-ahead (when moving or recently stopped)
	    this.lookAheadDistance = 150;    // How far the camera pans in the direction of movement (px)
	    this.lookAheadLerp = 0.05;       // How fast the camera pans normally (0.01 to 1.0)

	    // Deep pan (when stationary for a while)
	    this.deepPanDelay = 2000;        // How long the player must be stationary to trigger deep pan (ms)
	    this.deepPanDistance = 500;      // How far the camera pans during deep pan (px)
	    this.deepPanLerp = 0.015;        // How fast the camera pans during deep pan (slower for a cinematic feel)

	    // =============================================
	    // INTERNAL STATE — do not edit below
	    // =============================================
	    this.lookAheadOffset = { x: 0, y: 0 };
	    this.lookAheadTarget = { x: 0, y: 0 };
	    this.idleTimer = 0;
	    this.currentLerp = this.lookAheadLerp;
	    this.player = null;

	    this.scene.events.once('create', () => {
	        this.player = this.scene.children.list.find(child => child.constructor.name === 'Player');
	        if (this.player) {
	            this.scene.cameras.main.startFollow(this.player, true, 0.08, 0.08);
	            this.scene.cameras.main.setZoom(this.zoomLevel);
	        }
	    });
	}

	update() {
	    if (!this.player || !this.player.body) return;

	    const speed = Math.abs(this.player.body.velocity.x) + Math.abs(this.player.body.velocity.y);
	    const isMoving = speed > 10;
	    const dir = this.player.getData('lastDirection') ?? { x: 0, y: 0 };

	    if (isMoving) {
	        // Player is moving: reset idle timer and target normal look-ahead distance
	        this.idleTimer = 0;
	        this.lookAheadTarget.x = dir.x * this.lookAheadDistance;
	        this.lookAheadTarget.y = dir.y * this.lookAheadDistance;
	        this.currentLerp = this.lookAheadLerp;
	    } else {
	        // Player is stationary: increment idle timer
	        this.idleTimer += this.scene.game.loop.delta;

	        if (this.idleTimer >= this.deepPanDelay) {
	            // Trigger deep pan further in the last moved direction
	            this.lookAheadTarget.x = dir.x * this.deepPanDistance;
	            this.lookAheadTarget.y = dir.y * this.deepPanDistance;
	            this.currentLerp = this.deepPanLerp;
	        } else {
	            // Still waiting for deep pan, maintain normal look-ahead
	            this.lookAheadTarget.x = dir.x * this.lookAheadDistance;
	            this.lookAheadTarget.y = dir.y * this.lookAheadDistance;
	            this.currentLerp = this.lookAheadLerp;
	        }
	    }

	    // Lerp current offset toward target
	    this.lookAheadOffset.x += (this.lookAheadTarget.x - this.lookAheadOffset.x) * this.currentLerp;
	    this.lookAheadOffset.y += (this.lookAheadTarget.y - this.lookAheadOffset.y) * this.currentLerp;

	    this.scene.cameras.main.setFollowOffset(-this.lookAheadOffset.x, -this.lookAheadOffset.y);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
