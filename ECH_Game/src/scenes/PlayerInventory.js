
// You can write more code here

/* START OF COMPILED CODE */

import ScriptNode from "../../phaserjs_editor_scripts_base/ScriptNode.js";
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class PlayerInventory extends ScriptNode {

	constructor(parent) {
		super(parent);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	awake() {
		this.items = [];
		this.maxCapacity = 1;
		this.selectedIndex = 0;
		this.scene.playerInventory = this;
	}

	addItem(itemType) {
		if (this.items.length >= this.maxCapacity) {
			console.log('Inventory full');
			return false;
		}
		this.items.push(itemType);
		console.log('Item added:', itemType, '| Inventory:', this.items);
		return true;
	}

	removeItem() {
		if (this.items.length === 0) return null;
		const item = this.items.splice(this.selectedIndex, 1)[0];
		this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, this.items.length - 1));
		return item;
	}

	cycleItem() {
		if (this.items.length === 0) return;
		this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
		console.log('Selected item:', this.getCurrentItem());
	}

	getCurrentItem() {
		return this.items[this.selectedIndex] ?? null;
	}

	isFull() {
		return this.items.length >= this.maxCapacity;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
