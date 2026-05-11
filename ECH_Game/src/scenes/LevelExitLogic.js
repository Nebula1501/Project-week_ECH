
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class LevelExitLogic extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this._triggered = false;
		this.scene.events.once('create', () => {
			const player = (this.scene.globalEntities || []).find(c => c && c.getData && c.getData('type') === 'player');
			if (!player) {
				console.warn('LevelExitLogic: player not found');
				return;
			}
			this.scene.physics.add.existing(this.gameObject, true);
			this.scene.physics.add.overlap(this.gameObject, player, () => {
				if (this._triggered) return;
				this._triggered = true;
				this.scene.game.registry.set('level2SpawnX', 548);
				this.scene.game.registry.set('level2SpawnY', 548);
				this.scene.cameras.main.fadeOut(600, 0, 0, 0);
				this.scene.cameras.main.once('camerafadeoutcomplete', () => {
					this.scene.scene.start('Level2');
				});
			});
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
