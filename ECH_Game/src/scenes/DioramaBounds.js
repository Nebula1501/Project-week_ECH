
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class DioramaBounds extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		const layer = this.gameObject;
		const tilemap = layer.tilemap;
		this.top = layer.y;
		this.left = layer.x;
		this.bottom = layer.y + (tilemap.height * tilemap.tileHeight);
		this.right = layer.x + (tilemap.width * tilemap.tileWidth);
		this.scene.dioramaBounds = this;
	}

	getBounds() {
		return {
			top: this.top,
			bottom: this.bottom,
			left: this.left,
			right: this.right
		};
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
