
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class DetectionGlow extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.glowGraphic = null;
		this.noiseTime = Math.random() * 100; // randomise flicker phase per creature
		this.baseAlpha = 0.18;
		this.gameObject._detectionGlow = this;

		this.scene.events.once('create', () => {
			this.createGlow();
		});
	}

	createGlow() {
		const radius = this.gameObject._detectionRadius?.radius ?? 150;
		
		this.glowGraphic = this.scene.add.graphics();
		this.glowGraphic.setDepth(this.gameObject.depth - 1);
		this.glowGraphic.setBlendMode(Phaser.BlendModes.ADD);
		
		this.drawGlow(radius, this.baseAlpha);
	}

	drawGlow(radius, alpha) {
		if (!this.glowGraphic) return;
		
		this.glowGraphic.clear();

		// Draw radial gradient using concentric circles from outside in
		const steps = 12;
		for (let i = steps; i >= 0; i--) {
			const t = i / steps;
			const r = radius * t;
			const a = alpha * (1 - t) * (1 - t); // quadratic falloff — bright center, soft edge
			this.glowGraphic.fillStyle(0xC4A8D4, a);
			this.glowGraphic.fillCircle(0, 0, r);
		}
	}

	update() {
		if (!this.glowGraphic || !this.gameObject.active) return;

		// Keep glow centered on creature
		this.glowGraphic.setPosition(this.gameObject.x, this.gameObject.y);

		// Noise flicker — subtle opacity variation
		this.noiseTime += 0.02;
		const flicker = Math.sin(this.noiseTime) * 0.03 + Math.sin(this.noiseTime * 2.3) * 0.015;
		const alpha = this.baseAlpha + flicker;

		const radius = this.gameObject._detectionRadius?.radius ?? 150;
		this.drawGlow(radius, alpha);
	}

	destroy() {
		if (this.glowGraphic) {
			this.glowGraphic.destroy();
			this.glowGraphic = null;
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
