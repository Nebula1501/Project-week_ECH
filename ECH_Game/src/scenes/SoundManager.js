
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SoundManager extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		// Register globally to the scene so any component can access it
		this.scene.soundManager = this;
		
		// Track active sounds so we can prevent overlapping and stop them on demand
		this.activeSounds = {};
		this.lastPlayed = {}; // Track timestamps for interval-based rate limiting

		// =============================================
		// AUDIO TUNING DASHBOARD
		// Configure your real GarageBand audio files here!
		// =============================================
		this.tuning = {
			'footstep_player': { key: 'sfx_walk',    volume: 0.05, baseRate: 1.0, randomRate: 0.05, interval: 250 }, // [ms] Lower interval = faster steps!
			'footstep_ai':     { key: 'sfx_walk_ai', volume: 0.3, baseRate: 1.0, randomRate: 0.20 }, // Placeholder for AI footsteps
			'pickup':          { key: 'sfx_pickup',  volume: 0.6, baseRate: 1.0, randomRate: 0.05 },
			'startle':         { key: 'sfx_startle', volume: 0.7, baseRate: 1.0, randomRate: 0.05 },
			'aim':             { key: 'sfx_aim',     volume: 0.6, baseRate: 1.0, randomRate: 0.00 },
			'throw':           { key: 'sfx_throw',   volume: 0.6, baseRate: 1.0, randomRate: 0.10 },
			'impact':          { key: 'sfx_impact',  volume: 0.8, baseRate: 1.0, randomRate: 0.10 },
			'death':           { key: 'sfx_death',   volume: 1.0, baseRate: 1.0, randomRate: 0.00 },
			'brake':           { key: 'sfx_brake',   volume: 0.5, baseRate: 1.0, randomRate: 0.10 },
			'hover':           { key: 'sfx_hover',   volume: 0.4, baseRate: 1.0, randomRate: 0.00 },
			'button':          { key: 'sfx_button',  volume: 0.6, baseRate: 1.0, randomRate: 0.00 }
		};
	}

	play(type, entityType = null) {
		// Resolve specific footstep types
		if (type === 'footstep') {
			type = (entityType === 'player') ? 'footstep_player' : 'footstep_ai';
		}

		const config = this.tuning[type];

		// If a real sound asset is configured and loaded, play it!
		if (config && config.key && this.scene.cache.audio.exists(config.key)) {
			
			// 0. Rate limiting via interval (allows slight overlaps to remove gaps!)
			if (config.interval) {
				const now = this.scene.time.now;
				if (this.lastPlayed[type] && now - this.lastPlayed[type] < config.interval) return;
				this.lastPlayed[type] = now;
			}

			// 1. Prevent Overlapping if configured (wait for previous to finish)
			const existingSound = this.activeSounds[type];
			if (config.preventOverlap && existingSound && existingSound.isPlaying) {
				return;
			}

			let finalRate = config.baseRate || 1.0;
			
			// Apply pitch randomization if configured
			if (config.randomRate) {
				finalRate += Phaser.Math.FloatBetween(-config.randomRate, config.randomRate);
			}

			// 2. Play the sound and track it
			const newSound = this.scene.sound.add(config.key, {
				volume: config.volume || 1.0,
				rate: finalRate,
				loop: config.loop || false
			});
			newSound.play();
			
			this.activeSounds[type] = newSound;
			return; // Skip the synth
		}

		// Warning log if a sound is missing, so you know which GarageBand asset to make next!
		if (config && config.key) {
			console.warn(`SoundManager: Missing audio asset '${config.key}' for type '${type}'`);
		}
	}

	stop(type, entityType = null) {
		// Resolve specific footstep types
		if (type === 'footstep') {
			type = (entityType === 'player') ? 'footstep_player' : 'footstep_ai';
		}

		// Stop the currently tracked sound if it exists
		const existingSound = this.activeSounds[type];
		if (existingSound && existingSound.isPlaying) {
			// Smooth fade out instead of an abrupt cut-off!
			this.scene.tweens.add({
				targets: existingSound,
				volume: 0,
				duration: 100,
				onComplete: () => existingSound.stop()
			});
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
