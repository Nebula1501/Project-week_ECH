
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerMovement extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.wasd = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
		this.speed = 200;
		this.gameObject.body.setCollideWorldBounds(true);
		this.lastDirection = new Phaser.Math.Vector2(1, 0); // default facing right
	}

	update() {
		const body = this.gameObject.body;
		const cursors = this.cursors;
		const wasd = this.wasd;

		body.setVelocity(0);

		if (cursors.left.isDown || wasd.left.isDown) {
			body.setVelocityX(-this.speed);
			this.lastDirection.set(-1, 0);
			this.gameObject.setData('lastDirection', { x: -1, y: 0 });
		} else if (cursors.right.isDown || wasd.right.isDown) {
			body.setVelocityX(this.speed);
			this.lastDirection.set(1, 0);
			this.gameObject.setData('lastDirection', { x: 1, y: 0 });
		}

		if (cursors.up.isDown || wasd.up.isDown) {
			body.setVelocityY(-this.speed);
			this.lastDirection.set(0, -1);
			this.gameObject.setData('lastDirection', { x: 0, y: -1 });
		} else if (cursors.down.isDown || wasd.down.isDown) {
			body.setVelocityY(this.speed);
			this.lastDirection.set(0, 1);
			this.gameObject.setData('lastDirection', { x: 0, y: 1 });
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
