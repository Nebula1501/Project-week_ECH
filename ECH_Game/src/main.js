import config from '../config.js';
import Level from "./scenes/Level.js";
import Preload from "./scenes/Preload.js";
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import MainMenu from './scenes/MainMenu.js';
import LevelSelect from './scenes/LevelSelect.js';

window.addEventListener('load', function () {

	var game = new Phaser.Game(config);

	game.scene.add("Level1", Level1);
	game.scene.add("Level2", Level2);
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("MainMenu", MainMenu);
	game.scene.add("LevelSelect", LevelSelect);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {
		// 3. Start Preload first so your animations get created!
		this.scene.start("Preload"); 
	}
}
