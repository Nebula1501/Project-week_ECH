
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class ThrowArcIndicator extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.gfx = this.scene.add.graphics();
		this.gfx.setDepth(10);
		this._throwSpeedX = 800;
		this._throwSpeedY = -350;
		this._gravity = 900;
	}

	update() {
		const playerThrow = this.gameObject._playerThrow;
		if (!playerThrow || !playerThrow.heldFruit) {
			this.gfx.clear();
			return;
		}

		const dir = this.gameObject.getData('lastDirection') ?? { x: 1, y: 0 };
		const startX = this.gameObject.x;
		const startY = this.gameObject.y - 40;

		this.gfx.clear();

		const throwDistance = 380;
		const worldBounds = this.scene.physics.world.bounds;

		const landX = Phaser.Math.Clamp(
			startX + dir.x * throwDistance,
			worldBounds.left + 20,
			worldBounds.right - 20
		);
		const landY = Phaser.Math.Clamp(
			startY + dir.y * throwDistance,
			worldBounds.top + 20,
			worldBounds.bottom - 20
		);
		// Reduce arc for vertical throws so it doesn't fight the direction
		const arcHeight = 180 * Math.abs(dir.x);
		const steps = 16;

		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			const px = startX + (landX - startX) * t;
			const py = startY + (landY - startY) * t - arcHeight * Math.sin(Math.PI * t);

			const alpha = 1 - (i / steps) * 0.7;
			const radius = Math.max(2, 5 - i * 0.2);
			this.gfx.fillStyle(0xffffff, alpha);
			this.gfx.fillCircle(px, py, radius);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
