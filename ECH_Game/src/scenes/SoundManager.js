
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
			'footstep_player': { key: 'sfx_walk',    volume: 0.5, baseRate: 1.0, randomRate: 0.05, interval: 250 }, // [ms] Lower interval = faster steps!
			'footstep_ai':     { 
				key: 'sfx_walk_ai', volume: 0.25, baseRate: 1.0, randomRate: 0.20, interval: 350, // Default patrol/walk
				states: {
					'chase':  { interval: 200, baseRate: 1.15 }, // Faster steps while running
					'flee':   { interval: 180, baseRate: 1.20 }, // Frantic steps while fleeing
					'combat': { interval: 250, baseRate: 1.00 }
				}
			}, 
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

	play(type, entity = null) {
		// Backward compatibility: resolve if a string (like 'player') or an actual physical entity was passed
		const entityType = (entity && typeof entity !== 'string') ? entity.getData?.('type') : entity;

		// Resolve specific footstep types
		if (type === 'footstep') {
			type = (entityType === 'player') ? 'footstep_player' : 'footstep_ai';
		}

		let config = this.tuning[type];

		// --- STATE-BASED TUNING ---
		// Override base audio config dynamically based on the creature's current state!
		if (config && entity && typeof entity !== 'string' && entity._stateManager) {
			const state = entity._stateManager.currentState;
			if (config.states && config.states[state]) {
				config = { ...config, ...config.states[state] };
			}
		}

		let distanceVolumeScale = 1.0;

		// --- CAMERA CULLING & DISTANCE VOLUME ---
		// If a physical game object was passed, only play the sound if it is on-screen!
		if (entity && typeof entity !== 'string' && entity.x !== undefined && entity.y !== undefined) {
			const view = this.scene.cameras.main.worldView;
			const padding = 150; // Allow sound if it's just slightly off the edge of the screen
			
			if (entity.x < view.left - padding || entity.x > view.right + padding ||
				entity.y < view.top - padding || entity.y > view.bottom + padding) {
				return; // Culled! Don't play the sound.
			}

			// --- DISTANCE-BASED VOLUME ---
			// Find the player (or use camera center) to calculate the distance
			const player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
			const targetX = player ? player.x : view.centerX;
			const targetY = player ? player.y : view.centerY;

			const dist = Phaser.Math.Distance.Between(entity.x, entity.y, targetX, targetY);
			const maxDist = Math.max(view.width, view.height) / 1.5; 
			
			// Calculate linear attenuation (1.0 at center, 0.0 at maxDist)
			const attenuation = 1.0 - Phaser.Math.Clamp(dist / maxDist, 0, 1);
			
			// Square it for a more natural audio falloff curve
			distanceVolumeScale = attenuation * attenuation;
		}

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

			// Apply distance volume scaling to the base volume
			const finalVolume = (config.volume || 1.0) * distanceVolumeScale;

			// 2. Play the sound and track it
			const newSound = this.scene.sound.add(config.key, {
				volume: finalVolume,
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

	stop(type, entity = null) {
		const entityType = (entity && typeof entity !== 'string') ? entity.getData?.('type') : entity;

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
