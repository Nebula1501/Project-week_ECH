
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

		// Variables to track the lagging position
		this._currentLandX = null;
		this._currentLandY = null;
		this.gameObject._throwArcIndicator = this; // Expose to PlayerThrow
	}

	update() {
		const playerThrow = this.gameObject._playerThrow;
		if (!playerThrow || !playerThrow.heldFruit || this.gameObject.getData('isDead')) {
			this.gfx.clear();
			this._currentLandX = null;
			this._currentLandY = null;
			return;
		}

		const dir = this.gameObject.getData('lastDirection') ?? { x: 1, y: 0 };
		const startX = this.gameObject.x;
		const startY = this.gameObject.y - 60; // Match the offset from PlayerThrow.js
		const playerY = this.gameObject.y;

		this.gfx.clear();

		const throwDistance = this.scene.playerTuning?.throw?.distance ?? 380;

		const targetLandX = startX + dir.x * throwDistance;
		const targetLandY = playerY + dir.y * throwDistance; // Calculate landing from the player's feet, not their head

		// Smoothly lerp the indicator towards the target direction
		if (this._currentLandX === null || this._currentLandY === null) {
			this._currentLandX = targetLandX;
			this._currentLandY = targetLandY;
		} else {
			this._currentLandX += (targetLandX - this._currentLandX) * 0.2;
			this._currentLandY += (targetLandY - this._currentLandY) * 0.2;
		}

		const landX = this._currentLandX;
		const landY = this._currentLandY;
		
		// Fixed arc height for satisfying Z-axis pop
		const arcHeight = this.scene.playerTuning?.throw?.arcHeight ?? 150;
		const steps = 32;

		// Draw drop shadow
		this.gfx.fillStyle(0x000000, 0.25);
		this.gfx.fillEllipse(landX, landY, 48, 24);

		// Draw solid arc line
		this.gfx.lineStyle(3, 0xffffff, 0.8);
		this.gfx.beginPath();
		this.gfx.moveTo(startX, startY);

		for (let i = 1; i <= steps; i++) {
			const t = i / steps;
			const px = startX + (landX - startX) * t;
			const py = startY + (landY - startY) * t - arcHeight * Math.sin(Math.PI * t);
			this.gfx.lineTo(px, py);
		}
		this.gfx.strokePath();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
