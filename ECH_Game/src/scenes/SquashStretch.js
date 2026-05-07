
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class SquashStretch extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.idleThreshold = 10;
		this.maxSpeed = 300;
		this.impactTriggerDelta = 250;
		this.impactStopSpeed = 80;
		this.movementStretchMin = 0.015;
		this.movementStretchMax = 0.05;
		this.movementTweenDuration = 240;
		this.baseScale = new Phaser.Math.Vector2(this.gameObject.scaleX, this.gameObject.scaleY);
		this.idleTween = null;
		this.movementTween = null;
		this.impactTween = null;
		this.lastVelocity = new Phaser.Math.Vector2();
		this.isImpacting = false;
		this.state = 'idle';

		this.scene.events.once('create', () => {
			this.startIdleBreathing();
		});
	}

	update() {
		if (!this.gameObject || !this.gameObject.body) return;

		const velocity = this.gameObject.body.velocity;
		const speed = velocity.length();
		const lastSpeed = this.lastVelocity.length();
		const speedDelta = Math.abs(speed - lastSpeed);
		const newState = speed < this.idleThreshold ? 'idle' : 'moving';

		const stopImpact = !this.isImpacting && this.state === 'moving' && newState === 'idle' && lastSpeed > this.impactStopSpeed;
		if (stopImpact || (!this.isImpacting && speedDelta > this.impactTriggerDelta && speed < lastSpeed)) {
			this.triggerImpact();
		}

		if (this.isImpacting) {
			this.lastVelocity.copy(velocity);
			return;
		}

		if (newState !== this.state) {
			this.state = newState;
			if (newState === 'idle') {
				this.startIdleBreathing();
			} else {
				this.stopIdleBreathing();
			}
		}

		if (this.state === 'moving') {
			this.updateMovementStretch(speed);
		}

		this.lastVelocity.copy(velocity);
	}

	startIdleBreathing() {
		if (this.idleTween || !this.gameObject) return;

		this.stopMovementTween();
		this.stopImpactTween();

		this.idleTween = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: this.baseScale.x * 0.99,
			scaleY: this.baseScale.y * 1.01,
			ease: 'Sine.easeInOut',
			duration: 1800,
			yoyo: true,
			repeat: -1
		});
	}

	stopIdleBreathing() {
		if (this.idleTween) {
			this.idleTween.stop();
			this.idleTween = null;
		}
		this.resetScale();
	}

	updateMovementStretch(speed) {
		const ratio = Phaser.Math.Clamp(speed / this.maxSpeed, 0, 1);
		const stretch = this.movementStretchMin + ratio * this.movementStretchMax;
		const targetX = this.baseScale.x * (1 + stretch);
		const targetY = this.baseScale.y * (1 - stretch);

		if (this.movementTween) return;

		this.stopIdleBreathing();
		this.stopImpactTween();

		this.movementTween = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: targetX,
			scaleY: targetY,
			ease: 'Quad.easeOut',
			duration: this.movementTweenDuration,
			overwrite: true,
			onComplete: () => {
				this.movementTween = null;
			}
		});
	}

	triggerImpact() {
		if (this.isImpacting) return;

		this.isImpacting = true;
		this.stopIdleBreathing();
		this.stopMovementTween();
		this.stopImpactTween();

		const absX = Math.abs(this.lastVelocity.x);
		const absY = Math.abs(this.lastVelocity.y);
		const horizontalImpact = absX >= absY;

		let impactX;
		let impactY;
		if (horizontalImpact) {
			impactX = this.baseScale.x * 0.85;
			impactY = this.baseScale.y * 1.15;
		} else {
			impactX = this.baseScale.x * 1.15;
			impactY = this.baseScale.y * 0.85;
		}

		const impactTween1 = this.scene.tweens.add({
			targets: this.gameObject,
			scaleX: impactX,
			scaleY: impactY,
			ease: 'Quad.easeOut',
			duration: 100,
			onComplete: () => {
				const impactTween2 = this.scene.tweens.add({
					targets: this.gameObject,
					scaleX: this.baseScale.x,
					scaleY: this.baseScale.y,
					ease: 'Quad.easeOut',
					duration: 180,
					onComplete: () => {
						this.isImpacting = false;
						this.impactTween = null;
					}
				});
				this.impactTween = impactTween2;
			}
		});
		this.impactTween = impactTween1;
	}

	stopMovementTween() {
		if (this.movementTween) {
			this.movementTween.stop();
			this.movementTween = null;
		}
	}

	stopImpactTween() {
		if (this.impactTween) {
			this.impactTween.stop();
			this.impactTween = null;
		}
	}

	resetScale() {
		if (this.gameObject) {
			this.gameObject.scaleX = this.baseScale.x;
			this.gameObject.scaleY = this.baseScale.y;
		}
	}

	destroy() {
		this.stopIdleBreathing();
		this.stopMovementTween();
		this.stopImpactTween();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
