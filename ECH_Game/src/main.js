import config from '../config.js';
import Test02 from "./scenes/Level1.js";
import Level from "./scenes/Level.js";
import Preload from "./scenes/Preload.js";
import Level1 from './scenes/Level1.js';

window.addEventListener('load', function () {

	var game = new Phaser.Game(config);

	game.scene.add("Level1", Level1);
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Level1");
	}
}