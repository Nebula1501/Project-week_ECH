
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class BehaviourFlee extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.moveSpeed = 160;
		this.boundaryMargin = 32;
		this.active = false;
		this.threatPosition = { x: 0, y: 0 };
		this.gameObject._behaviourFlee = this;
	}

	onActivate() {
		this.active = true;
		this.updateThreatPosition();
		this.flee();
	}

	onDeactivate() {
		this.active = false;
		this.gameObject.body.setVelocity(0, 0);
	}

	updateThreatPosition() {
		const detected = this.gameObject._detectionRadius?.detected ?? [];
		const threat = detected.find(d => d.tag === 'player' || d.tag === 't2carn' || d.tag === 't1carn' || d.tag === 't1herb');
		if (threat && threat.entity) {
			this.threatPosition = { x: threat.entity.x, y: threat.entity.y };
		}
	}

	flee() {
		const angle = Phaser.Math.Angle.Between(
			this.threatPosition.x, this.threatPosition.y,
			this.gameObject.x, this.gameObject.y
		);

		let fleeX = Math.cos(angle);
		let fleeY = Math.sin(angle);

		// Boundary aware fleeing
		if (this.scene.dioramaBounds) {
			const bounds = this.scene.dioramaBounds.getBounds();
			const nearLeft = this.gameObject.x - bounds.left < this.boundaryMargin;
			const nearRight = bounds.right - this.gameObject.x < this.boundaryMargin;
			const nearTop = this.gameObject.y - bounds.top < this.boundaryMargin;
			const nearBottom = bounds.bottom - this.gameObject.y < this.boundaryMargin;

			if ((nearLeft && fleeX < 0) || (nearRight && fleeX > 0)) fleeX = 0;
			if ((nearTop && fleeY < 0) || (nearBottom && fleeY > 0)) fleeY = 0;
		}

		this.gameObject.body.setVelocity(fleeX * this.moveSpeed, fleeY * this.moveSpeed);
	}

	update() {
		if (!this.active) return;
		this.updateThreatPosition();
		this.flee();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
