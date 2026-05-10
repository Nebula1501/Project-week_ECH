
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerDeath extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this._overlapTimer = 0;
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;
		if (this.gameObject.getData('isDead')) return;

		const dangerousTags = ['t1carn', 't2carn', 't1herb'];
		const entities = this.scene.globalEntities || [];
		const dangerousCreatures = entities.filter(child => {
			return child && child.active && child.getData && dangerousTags.includes(child.getData('type'));
		});

		let isOverlapping = false;
		let killer = null;

		for (const creature of dangerousCreatures) {
			if (this.scene.physics.overlap(this.gameObject, creature)) {
				isOverlapping = true;
				killer = creature;
				break;
			}
		}

		if (isOverlapping) {
			const threshold = this.scene.playerTuning?.health?.deathTimerThreshold ?? 500;
			
			this._overlapTimer += this.scene.game.loop.delta;
			if (this._overlapTimer >= threshold) {
				this.die(killer);
			}
		} else {
			this._overlapTimer = 0;
		}
	}

	die(killer) {
		this.gameObject.setData('isDead', true);
		
		// Stop player movement immediately
		this.gameObject.body.setVelocity(0);

		// Freeze scene physics for dramatic "Game Over" effect
		this.scene.physics.pause();

		// Play death animation (Commented out until ready)
		/*
		if (this.gameObject.anims && this.scene.anims.exists('player_death')) {
			this.gameObject.play('player_death', true);
			this.gameObject.once('animationcomplete-player_death', () => {
				this.scene.scene.restart(); // Restart scene after death
			});
		} else {
			this.scene.time.delayedCall(1000, () => {
				this.scene.scene.restart();
			});
		}
		*/
		
		// Fallback wait and restart
		this.scene.time.delayedCall(1000, () => {
			this.scene.scene.restart();
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here