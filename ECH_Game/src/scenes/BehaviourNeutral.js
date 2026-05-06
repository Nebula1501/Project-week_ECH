
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourNeutral extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.moveSpeed = 60;
		this.loiterRadius = 150;
		this.directionChangeTimer = 0;
		this.directionChangeInterval = 2000;
		this.homePosition = { x: this.gameObject.x, y: this.gameObject.y };
		this.currentDirection = new Phaser.Math.Vector2(0, 0);
		this.active = false;
		this.gameObject._behaviourNeutral = this;
	}

	onActivate() {
		this.active = true;
		this.pickNewDirection();
	}

	onDeactivate() {
		this.active = false;
		this.gameObject.body.setVelocity(0, 0);
	}

	update() {
		if (!this.active) return;

		this.directionChangeTimer += this.scene.game.loop.delta;

		const distFromHome = Phaser.Math.Distance.Between(
			this.gameObject.x, this.gameObject.y,
			this.homePosition.x, this.homePosition.y
		);

		if (distFromHome > this.loiterRadius) {
			// Return to home radius
			const angle = Phaser.Math.Angle.Between(
				this.gameObject.x, this.gameObject.y,
				this.homePosition.x, this.homePosition.y
			);
			this.gameObject.body.setVelocity(
				Math.cos(angle) * this.moveSpeed,
				Math.sin(angle) * this.moveSpeed
			);
		} else {
			// Loiter within radius
			if (this.directionChangeTimer >= this.directionChangeInterval) {
				this.directionChangeTimer = 0;
				this.pickNewDirection();
			}
			this.gameObject.body.setVelocity(
				this.currentDirection.x * this.moveSpeed,
				this.currentDirection.y * this.moveSpeed
			);
		}
	}

	pickNewDirection() {
		const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
		this.currentDirection.set(Math.cos(angle), Math.sin(angle));
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
